<?php

namespace App\Http\Controllers;

use App\Models\ExpenseTemplate;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ExpenseTemplateController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $templates = $request->user()->expenseTemplates()->get();

        return response()->json($templates);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'amount' => 'required|integer|min:0',
            'category_id' => 'nullable|integer|exists:categories,id',
        ]);

        $template = $request->user()->expenseTemplates()->create($validated);

        return response()->json($template, 201);
    }

    public function update(Request $request, ExpenseTemplate $expenseTemplate): JsonResponse
    {
        if ($expenseTemplate->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'amount' => 'sometimes|required|integer|min:0',
            'category_id' => 'nullable|integer|exists:categories,id',
        ]);

        $expenseTemplate->update($validated);

        return response()->json($expenseTemplate);
    }

    public function destroy(Request $request, ExpenseTemplate $expenseTemplate): JsonResponse
    {
        if ($expenseTemplate->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $expenseTemplate->delete();

        return response()->json(null, 204);
    }

    public function apply(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'year' => 'required|integer',
            'month' => 'required|integer|between:1,12',
        ]);

        $templates = $request->user()->expenseTemplates()->get();

        $items = $templates->map(function ($template) use ($request, $validated) {
            return $request->user()->expenseItems()->create([
                'year' => $validated['year'],
                'month' => $validated['month'],
                'name' => $template->name,
                'amount' => $template->amount,
                'category_id' => $template->category_id,
            ]);
        });

        return response()->json($items->values(), 201);
    }
}
