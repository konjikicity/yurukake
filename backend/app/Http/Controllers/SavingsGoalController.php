<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class SavingsGoalController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        return response()->json($request->user()->savingsGoal);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'type' => ['required', Rule::in(['fixed', 'ratio'])],
            'amount' => 'nullable|integer|min:0|required_if:type,fixed',
            'percentage' => 'nullable|integer|min:1|max:100|required_if:type,ratio',
        ]);

        $payload = [
            'type' => $validated['type'],
            'amount' => $validated['type'] === 'fixed' ? $validated['amount'] : null,
            'percentage' => $validated['type'] === 'ratio' ? $validated['percentage'] : null,
        ];

        $goal = $request->user()->savingsGoal()->updateOrCreate([], $payload);

        return response()->json($goal);
    }
}
