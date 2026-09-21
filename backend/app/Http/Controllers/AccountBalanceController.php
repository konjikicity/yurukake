<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AccountBalanceController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        $balance = $request->user()->accountBalances()
            ->orderByDesc('year')
            ->orderByDesc('month')
            ->first();

        $now = now();

        return response()->json([
            'year' => $balance?->year,
            'month' => $balance?->month,
            'amount' => $balance?->amount,
            'is_current' => $balance !== null
                && $balance->year === $now->year
                && $balance->month === $now->month,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'amount' => 'required|integer|min:0',
        ]);

        $now = now();

        $balance = $request->user()->accountBalances()->updateOrCreate(
            ['year' => $now->year, 'month' => $now->month],
            ['amount' => $validated['amount']],
        );

        return response()->json([
            'year' => $balance->year,
            'month' => $balance->month,
            'amount' => $balance->amount,
            'is_current' => true,
        ], $balance->wasRecentlyCreated ? 201 : 200);
    }
}
