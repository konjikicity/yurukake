<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MonthlyBudgetController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $budget = $request->user()->monthlyBudgets()
            ->where('year', $request->query('year'))
            ->where('month', $request->query('month'))
            ->first();

        return response()->json(['amount' => $budget?->amount]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'year' => 'required|integer',
            'month' => 'required|integer|between:1,12',
            'amount' => 'required|integer|min:0',
        ]);

        $budget = $request->user()->monthlyBudgets()
            ->where('year', $validated['year'])
            ->where('month', $validated['month'])
            ->first();

        if ($budget) {
            $budget->update($validated);
            return response()->json($budget);
        }

        $budget = $request->user()->monthlyBudgets()->create($validated);

        return response()->json($budget, 201);
    }
}
