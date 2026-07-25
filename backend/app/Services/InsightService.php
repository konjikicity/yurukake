<?php

namespace App\Services;

use App\Models\Category;
use App\Models\User;

class InsightService
{
    private const BUDGET_WARN_THRESHOLD = 80.0;

    public function getInsights(User $user, int $year, ?int $month): array
    {
        $facts = [];

        $current = $this->expenseTotal($user, $year, $month);

        $facts[] = $this->comparison(
            'yoy_expense',
            $current,
            $this->expenseTotal($user, $year - 1, $month)
        );

        if ($month !== null) {
            [$prevYear, $prevMonth] = $month === 1 ? [$year - 1, 12] : [$year, $month - 1];
            $facts[] = $this->comparison(
                'mom_expense',
                $current,
                $this->expenseTotal($user, $prevYear, $prevMonth)
            );
        }

        if ($topCategory = $this->topCategory($user, $year, $month, $current)) {
            $facts[] = $topCategory;
        }

        if ($budget = $this->budget($user, $year, $month, $current)) {
            $facts[] = $budget;
        }

        if ($average = $this->versusAverage($user, $year, $month, $current)) {
            $facts[] = $average;
        }

        return [
            'year' => $year,
            'month' => $month,
            'facts' => $facts,
        ];
    }

    private function expenseTotal(User $user, int $year, ?int $month): int
    {
        $query = $user->expenseItems()->where('year', $year);

        if ($month !== null) {
            $query->where('month', $month);
        }

        return (int) $query->sum('amount');
    }

    private function comparison(string $type, int $current, int $previous): array
    {
        $diff = $current - $previous;

        if ($previous === 0) {
            return [
                'type' => $type,
                'current' => $current,
                'previous' => 0,
                'diff' => $diff,
                'rate' => null,
                'direction' => 'new',
            ];
        }

        $rate = round(($diff / $previous) * 100, 1);

        return [
            'type' => $type,
            'current' => $current,
            'previous' => $previous,
            'diff' => $diff,
            'rate' => $rate,
            'direction' => $diff > 0 ? 'up' : ($diff < 0 ? 'down' : 'flat'),
        ];
    }

    private function topCategory(User $user, int $year, ?int $month, int $total): ?array
    {
        if ($total <= 0) {
            return null;
        }

        $query = $user->expenseItems()
            ->where('year', $year)
            ->selectRaw('category_id, SUM(amount) as total')
            ->groupBy('category_id')
            ->orderByDesc('total');

        if ($month !== null) {
            $query->where('month', $month);
        }

        $top = $query->first();

        if (! $top) {
            return null;
        }

        $category = $top->category_id ? Category::find($top->category_id) : null;

        return [
            'type' => 'top_category',
            'category_id' => $top->category_id,
            'category_name' => $category?->name ?? '未分類',
            'category_color' => $category?->color,
            'total' => (int) $top->total,
            'share' => round(((int) $top->total / $total) * 100, 1),
        ];
    }

    private function budget(User $user, int $year, ?int $month, int $expense): ?array
    {
        $query = $user->monthlyBudgets()->where('year', $year);

        if ($month !== null) {
            $query->where('month', $month);
        }

        $budget = (int) $query->sum('amount');

        if ($budget <= 0) {
            return null;
        }

        $rate = round(($expense / $budget) * 100, 1);

        return [
            'type' => 'budget',
            'budget' => $budget,
            'expense' => $expense,
            'rate' => $rate,
            'level' => $expense >= $budget ? 'over' : ($rate >= self::BUDGET_WARN_THRESHOLD ? 'warn' : 'safe'),
        ];
    }

    private function versusAverage(User $user, int $year, ?int $month, int $current): ?array
    {
        if ($month === null) {
            return null;
        }

        $monthly = $user->expenseItems()
            ->where('year', $year)
            ->where('month', '!=', $month)
            ->selectRaw('month, SUM(amount) as total')
            ->groupBy('month')
            ->pluck('total');

        if ($monthly->isEmpty()) {
            return null;
        }

        $average = (int) round($monthly->avg());

        if ($average <= 0) {
            return null;
        }

        $diff = $current - $average;

        return [
            'type' => 'vs_average',
            'current' => $current,
            'average' => $average,
            'diff' => $diff,
            'rate' => round(($diff / $average) * 100, 1),
            'direction' => $diff > 0 ? 'up' : ($diff < 0 ? 'down' : 'flat'),
        ];
    }
}
