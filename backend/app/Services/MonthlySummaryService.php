<?php

namespace App\Services;

use App\Models\User;

class MonthlySummaryService
{
    public function getSummary(User $user, int $year): array
    {
        $incomes = $user->incomeItems()
            ->where('year', $year)
            ->selectRaw('month, SUM(amount) as total')
            ->groupBy('month')
            ->pluck('total', 'month');

        $expenses = $user->expenseItems()
            ->where('year', $year)
            ->selectRaw('month, SUM(amount) as total')
            ->groupBy('month')
            ->pluck('total', 'month');

        $budgets = $user->monthlyBudgets()
            ->where('year', $year)
            ->pluck('amount', 'month');

        $prevIncomes = $user->incomeItems()
            ->where('year', $year - 1)
            ->selectRaw('month, SUM(amount) as total')
            ->groupBy('month')
            ->pluck('total', 'month');

        $prevExpenses = $user->expenseItems()
            ->where('year', $year - 1)
            ->selectRaw('month, SUM(amount) as total')
            ->groupBy('month')
            ->pluck('total', 'month');

        return collect(range(1, 12))->map(function ($month) use ($incomes, $expenses, $budgets, $prevIncomes, $prevExpenses) {
            $income = (int) ($incomes[$month] ?? 0);
            $expense = (int) ($expenses[$month] ?? 0);
            return [
                'month' => $month,
                'income' => $income,
                'expense' => $expense,
                'balance' => $income - $expense,
                'budget' => $budgets[$month] ?? null,
                'prev_income' => (int) ($prevIncomes[$month] ?? 0),
                'prev_expense' => (int) ($prevExpenses[$month] ?? 0),
            ];
        })->values()->all();
    }
}
