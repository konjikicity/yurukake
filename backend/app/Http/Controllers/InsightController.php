<?php

namespace App\Http\Controllers;

use App\Services\InsightService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InsightController extends Controller
{
    public function __invoke(Request $request, InsightService $service): JsonResponse
    {
        $validated = $request->validate([
            'year' => 'nullable|integer|between:2000,2100',
            'month' => 'nullable|integer|between:1,12',
        ]);

        $year = (int) ($validated['year'] ?? date('Y'));
        $month = isset($validated['month']) ? (int) $validated['month'] : null;

        return response()->json($service->getInsights($request->user(), $year, $month));
    }
}
