<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;

class CsvExportController extends Controller
{
    public const HEADER = ['type', 'year', 'month', 'name', 'amount', 'category'];

    public function __invoke(Request $request): StreamedResponse
    {
        $validated = $request->validate([
            'year' => 'nullable|integer|between:2000,2100',
            'type' => 'nullable|in:all,income,expense',
        ]);

        $year = (int) ($validated['year'] ?? date('Y'));
        $type = $validated['type'] ?? 'all';
        $user = $request->user();

        $types = $type === 'all' ? ['income', 'expense'] : [$type];

        return response()->streamDownload(function () use ($user, $year, $types) {
            $out = fopen('php://output', 'w');
            fwrite($out, "\xEF\xBB\xBF");
            fputcsv($out, self::HEADER);

            foreach ($types as $current) {
                $relation = $current === 'income' ? 'incomeItems' : 'expenseItems';

                $user->{$relation}()
                    ->with('category')
                    ->where('year', $year)
                    ->orderBy('month')
                    ->orderBy('id')
                    ->chunk(500, function ($items) use ($out, $current) {
                        foreach ($items as $item) {
                            fputcsv($out, [
                                $current,
                                $item->year,
                                $item->month,
                                $item->name,
                                $item->amount,
                                $item->category?->name ?? '',
                            ]);
                        }
                    });
            }

            fclose($out);
        }, "yurukake_{$year}.csv", [
            'Content-Type' => 'text/csv; charset=UTF-8',
        ]);
    }
}
