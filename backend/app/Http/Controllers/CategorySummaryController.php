<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CategorySummaryController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $year = (int) $request->query('year');
        $month = (int) $request->query('month');
        $type = $request->query('type');

        $relation = $type === 'income' ? 'incomeItems' : 'expenseItems';

        $items = $request->user()->{$relation}()
            ->where('year', $year)
            ->where('month', $month)
            ->selectRaw('category_id, SUM(amount) as total')
            ->groupBy('category_id')
            ->get();

        $categoryIds = $items->pluck('category_id')->filter()->all();
        $categories = \App\Models\Category::whereIn('id', $categoryIds)
            ->pluck('name', 'id');

        $result = $items->map(function ($item) use ($categories) {
            return [
                'category_id' => $item->category_id,
                'category_name' => $item->category_id ? ($categories[$item->category_id] ?? '不明') : '未分類',
                'total' => (int) $item->total,
            ];
        })->values()->all();

        return response()->json($result);
    }
}
