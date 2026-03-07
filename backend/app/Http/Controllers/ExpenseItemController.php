<?php

namespace App\Http\Controllers;

use App\Models\ExpenseItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ExpenseItemController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $items = $request->user()->expenseItems()
            ->where('year', $request->query('year'))
            ->where('month', $request->query('month'))
            ->get();

        return response()->json($items);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'year' => 'required|integer',
            'month' => 'required|integer|between:1,12',
            'name' => 'required|string|max:255',
            'amount' => 'required|integer|min:0',
            'category_id' => 'nullable|integer|exists:categories,id',
        ]);

        $item = $request->user()->expenseItems()->create($validated);

        return response()->json($item, 201);
    }

    public function update(Request $request, ExpenseItem $expenseItem): JsonResponse
    {
        if ($expenseItem->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'amount' => 'sometimes|required|integer|min:0',
            'category_id' => 'nullable|integer|exists:categories,id',
        ]);

        $expenseItem->update($validated);

        return response()->json($expenseItem);
    }

    public function destroy(Request $request, ExpenseItem $expenseItem): JsonResponse
    {
        if ($expenseItem->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $expenseItem->delete();

        return response()->json(null, 204);
    }
}
