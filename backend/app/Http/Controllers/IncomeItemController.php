<?php

namespace App\Http\Controllers;

use App\Models\IncomeItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class IncomeItemController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $items = $request->user()->incomeItems()
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

        $item = $request->user()->incomeItems()->create($validated);

        return response()->json($item, 201);
    }

    public function update(Request $request, IncomeItem $incomeItem): JsonResponse
    {
        if ($incomeItem->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'amount' => 'sometimes|required|integer|min:0',
            'category_id' => 'nullable|integer|exists:categories,id',
        ]);

        $incomeItem->update($validated);

        return response()->json($incomeItem);
    }

    public function destroy(Request $request, IncomeItem $incomeItem): JsonResponse
    {
        if ($incomeItem->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $incomeItem->delete();

        return response()->json(null, 204);
    }
}
