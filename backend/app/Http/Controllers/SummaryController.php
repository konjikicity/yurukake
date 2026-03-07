<?php

namespace App\Http\Controllers;

use App\Services\MonthlySummaryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SummaryController extends Controller
{
    public function __invoke(Request $request, MonthlySummaryService $service): JsonResponse
    {
        $year = (int) $request->query('year', date('Y'));
        $summary = $service->getSummary($request->user(), $year);

        return response()->json($summary);
    }
}
