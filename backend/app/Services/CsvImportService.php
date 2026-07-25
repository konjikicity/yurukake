<?php

namespace App\Services;

use App\Models\Category;
use App\Models\ExpenseItem;
use App\Models\IncomeItem;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class CsvImportService
{
    public const MAX_ROWS = 5000;
    private const MAX_ERRORS = 100;
    private const CHUNK = 500;

    private const COLUMN_ALIASES = [
        'type' => ['type', '種別', '区分'],
        'year' => ['year', '年'],
        'month' => ['month', '月'],
        'name' => ['name', '項目名', '名前'],
        'amount' => ['amount', '金額'],
        'category' => ['category', 'カテゴリ', 'カテゴリー'],
    ];

    private const TYPE_ALIASES = [
        'income' => 'income',
        '収入' => 'income',
        'expense' => 'expense',
        '支出' => 'expense',
    ];

    public function import(User $user, string $path, array $options): array
    {
        [$rows, $errors] = $this->parse($path);

        if ($errors !== []) {
            return [
                'status' => 422,
                'body' => [
                    'imported' => 0,
                    'skipped' => 0,
                    'created_categories' => [],
                    'errors' => array_slice($errors, 0, self::MAX_ERRORS),
                ],
            ];
        }

        if ($options['dry_run']) {
            return [
                'status' => 200,
                'body' => [
                    'imported' => count($rows),
                    'skipped' => 0,
                    'created_categories' => [],
                    'errors' => [],
                ],
            ];
        }

        return ['status' => 200, 'body' => $this->write($user, $rows, $options)];
    }

    private function parse(string $path): array
    {
        $content = (string) file_get_contents($path);
        $content = preg_replace('/^\xEF\xBB\xBF/', '', $content);

        if (! mb_check_encoding($content, 'UTF-8')) {
            $content = mb_convert_encoding($content, 'UTF-8', 'SJIS-win,EUC-JP,UTF-8');
        }

        $handle = fopen('php://memory', 'r+');
        fwrite($handle, $content);
        rewind($handle);

        $header = fgetcsv($handle);

        if ($header === false) {
            fclose($handle);

            return [[], [['row' => 1, 'messages' => ['ファイルが空です']]]];
        }

        $indexes = $this->mapColumns($header);

        if ($missing = array_keys(array_filter($indexes, fn ($i) => $i === null))) {
            fclose($handle);

            return [[], [['row' => 1, 'messages' => ['見出しに ' . implode(', ', $missing) . ' がありません']]]];
        }

        $rows = [];
        $errors = [];
        $lineNo = 1;

        while (($record = fgetcsv($handle)) !== false) {
            $lineNo += 1 + array_sum(array_map(fn ($f) => substr_count((string) $f, "\n"), $record));

            if ($record === [null] || $record === ['']) {
                continue;
            }

            if (count($rows) >= self::MAX_ROWS) {
                fclose($handle);

                return [[], [['row' => $lineNo, 'messages' => ['行が多すぎます（' . self::MAX_ROWS . '行まで）']]]];
            }

            $row = $this->extract($record, $indexes);
            $validator = Validator::make($row, [
                'type' => 'required|in:income,expense',
                'year' => 'required|integer|between:2000,2100',
                'month' => 'required|integer|between:1,12',
                'name' => 'required|string|max:255',
                'amount' => 'required|integer|min:0',
                'category' => 'nullable|string|max:255',
            ], [
                'type.required' => '種別が空です',
                'type.in' => '種別は income か expense で指定してください',
                'year.required' => '年が空です',
                'year.integer' => '年は数字で指定してください',
                'year.between' => '年は2000から2100の間で指定してください',
                'month.required' => '月が空です',
                'month.integer' => '月は数字で指定してください',
                'month.between' => '月は1から12の間で指定してください',
                'name.required' => '項目名が空です',
                'name.max' => '項目名が長すぎます（255文字まで）',
                'amount.required' => '金額が空です',
                'amount.integer' => '金額は数字で指定してください',
                'amount.min' => '金額は0以上で指定してください',
                'category.max' => 'カテゴリ名が長すぎます（255文字まで）',
            ]);

            if ($validator->fails()) {
                $errors[] = ['row' => $lineNo, 'messages' => $validator->errors()->all()];

                continue;
            }

            $rows[] = $validator->validated();
        }

        fclose($handle);

        return [$rows, $errors];
    }

    private function mapColumns(array $header): array
    {
        $normalized = array_map(fn ($h) => mb_strtolower(trim((string) $h)), $header);
        $indexes = [];

        foreach (self::COLUMN_ALIASES as $key => $aliases) {
            $indexes[$key] = null;
            foreach ($aliases as $alias) {
                $found = array_search(mb_strtolower($alias), $normalized, true);
                if ($found !== false) {
                    $indexes[$key] = $found;
                    break;
                }
            }
        }

        return $indexes;
    }

    private function extract(array $record, array $indexes): array
    {
        $value = fn (string $key) => trim((string) ($record[$indexes[$key]] ?? ''));

        $type = mb_strtolower($value('type'));
        $category = $value('category');

        return [
            'type' => self::TYPE_ALIASES[$type] ?? self::TYPE_ALIASES[$value('type')] ?? $value('type'),
            'year' => $value('year'),
            'month' => $value('month'),
            'name' => $value('name'),
            'amount' => $value('amount'),
            'category' => $category === '' ? null : $category,
        ];
    }

    private function write(User $user, array $rows, array $options): array
    {
        return DB::transaction(function () use ($user, $rows, $options) {
            if ($options['mode'] === 'replace') {
                $this->clearTargetMonths($user, $rows);
            }

            $categories = $this->categoryMap($user);
            $created = [];
            $existing = $this->existingKeys($user, $rows);

            $pending = ['income' => [], 'expense' => []];
            $imported = 0;
            $skipped = 0;
            $now = now();

            foreach ($rows as $row) {
                $key = implode('|', [$row['type'], $row['year'], $row['month'], $row['name'], $row['amount']]);

                if ($options['on_duplicate'] === 'skip' && isset($existing[$key])) {
                    $skipped++;

                    continue;
                }
                $existing[$key] = true;

                $categoryId = null;
                if ($row['category'] !== null) {
                    $categoryKey = $row['type'] . '|' . $row['category'];
                    if (isset($categories[$categoryKey])) {
                        $categoryId = $categories[$categoryKey];
                    } elseif ($options['create_categories']) {
                        $category = Category::create([
                            'user_id' => $user->id,
                            'type' => $row['type'],
                            'name' => $row['category'],
                        ]);
                        $categories[$categoryKey] = $category->id;
                        $categoryId = $category->id;
                        $created[] = $row['category'];
                    }
                }

                $pending[$row['type']][] = [
                    'user_id' => $user->id,
                    'year' => (int) $row['year'],
                    'month' => (int) $row['month'],
                    'name' => $row['name'],
                    'amount' => (int) $row['amount'],
                    'category_id' => $categoryId,
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
                $imported++;
            }

            foreach (array_chunk($pending['income'], self::CHUNK) as $chunk) {
                IncomeItem::insert($chunk);
            }
            foreach (array_chunk($pending['expense'], self::CHUNK) as $chunk) {
                ExpenseItem::insert($chunk);
            }

            return [
                'imported' => $imported,
                'skipped' => $skipped,
                'created_categories' => array_values(array_unique($created)),
                'errors' => [],
            ];
        });
    }

    private function clearTargetMonths(User $user, array $rows): void
    {
        $targets = [];
        foreach ($rows as $row) {
            $targets[$row['type']][$row['year'] . '-' . $row['month']] = [(int) $row['year'], (int) $row['month']];
        }

        foreach ($targets as $type => $months) {
            $relation = $type === 'income' ? 'incomeItems' : 'expenseItems';
            $user->{$relation}()
                ->where(function ($query) use ($months) {
                    foreach ($months as [$year, $month]) {
                        $query->orWhere(fn ($q) => $q->where('year', $year)->where('month', $month));
                    }
                })
                ->delete();
        }
    }

    private function categoryMap(User $user): array
    {
        return $user->categories()
            ->get()
            ->mapWithKeys(fn ($c) => [$c->type . '|' . $c->name => $c->id])
            ->all();
    }

    private function existingKeys(User $user, array $rows): array
    {
        $years = array_unique(array_map(fn ($r) => (int) $r['year'], $rows));

        if ($years === []) {
            return [];
        }

        $keys = [];

        foreach (['income' => 'incomeItems', 'expense' => 'expenseItems'] as $type => $relation) {
            $user->{$relation}()
                ->whereIn('year', $years)
                ->select('year', 'month', 'name', 'amount')
                ->chunk(1000, function ($items) use (&$keys, $type) {
                    foreach ($items as $item) {
                        $keys[implode('|', [$type, $item->year, $item->month, $item->name, $item->amount])] = true;
                    }
                });
        }

        return $keys;
    }
}
