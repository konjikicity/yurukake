<?php

namespace App\Http\Controllers;

use App\Services\CategoryYearlySummaryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CategoryYearlySummaryController extends Controller
{
    public function __invoke(Request $request, CategoryYearlySummaryService $service): JsonResponse
    {
        $validated = $request->validate([
            'year' => 'nullable|integer|between:2000,2100',
            'type' => 'required|in:income,expense',
            'limit' => 'nullable|integer|between:1,20',
        ]);

        $summary = $service->getSummary(
            $request->user(),
            (int) ($validated['year'] ?? date('Y')),
            $validated['type'],
            (int) ($validated['limit'] ?? 8),
        );

        return response()->json($summary);
    }
}
