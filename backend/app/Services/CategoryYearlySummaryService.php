<?php

namespace App\Services;

use App\Models\Category;
use App\Models\User;

class CategoryYearlySummaryService
{
    private const OTHER_KEY = 'cat_other';
    private const NONE_KEY = 'cat_none';

    public function getSummary(User $user, int $year, string $type, int $limit): array
    {
        $relation = $type === 'income' ? 'incomeItems' : 'expenseItems';

        $rows = $user->{$relation}()
            ->where('year', $year)
            ->selectRaw('month, category_id, SUM(amount) as total')
            ->groupBy('month', 'category_id')
            ->get();

        if ($rows->isEmpty()) {
            return ['series' => [], 'data' => $this->emptyMonths([])];
        }

        $categories = Category::whereIn('id', $rows->pluck('category_id')->filter()->unique())
            ->get()
            ->keyBy('id');

        $totals = [];
        foreach ($rows as $row) {
            $key = $row->category_id ? "cat_{$row->category_id}" : self::NONE_KEY;
            $totals[$key] = ($totals[$key] ?? 0) + (int) $row->total;
        }
        arsort($totals);

        $keptKeys = array_slice(array_keys($totals), 0, $limit);
        $isCollapsed = count($totals) > $limit;

        $series = [];
        foreach ($keptKeys as $key) {
            $category = $key === self::NONE_KEY ? null : $categories->get((int) substr($key, 4));
            $series[] = [
                'key' => $key,
                'name' => $category?->name ?? ($key === self::NONE_KEY ? '未分類' : '不明'),
                'color' => $category?->color,
                'total' => $totals[$key],
            ];
        }

        if ($isCollapsed) {
            $series[] = [
                'key' => self::OTHER_KEY,
                'name' => 'その他',
                'color' => null,
                'total' => array_sum(array_diff_key($totals, array_flip($keptKeys))),
            ];
        }

        $seriesKeys = array_column($series, 'key');
        $data = $this->emptyMonths($seriesKeys);

        foreach ($rows as $row) {
            $key = $row->category_id ? "cat_{$row->category_id}" : self::NONE_KEY;
            $target = in_array($key, $keptKeys, true) ? $key : self::OTHER_KEY;
            $index = $row->month - 1;
            $data[$index][$target] += (int) $row->total;
            $data[$index]['total'] += (int) $row->total;
        }

        return ['series' => $series, 'data' => $data];
    }

    private function emptyMonths(array $seriesKeys): array
    {
        return array_map(
            fn (int $month) => array_merge(
                ['month' => $month],
                array_fill_keys($seriesKeys, 0),
                ['total' => 0]
            ),
            range(1, 12)
        );
    }
}
