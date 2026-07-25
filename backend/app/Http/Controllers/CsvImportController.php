<?php

namespace App\Http\Controllers;

use App\Http\Requests\CsvImportRequest;
use App\Services\CsvImportService;
use Illuminate\Http\JsonResponse;

class CsvImportController extends Controller
{
    public function __invoke(CsvImportRequest $request, CsvImportService $service): JsonResponse
    {
        $result = $service->import(
            $request->user(),
            $request->file('file')->getRealPath(),
            [
                'mode' => $request->input('mode', 'append'),
                'on_duplicate' => $request->input('on_duplicate', 'skip'),
                'create_categories' => $request->boolean('create_categories', true),
                'dry_run' => $request->boolean('dry_run'),
            ]
        );

        return response()->json($result['body'], $result['status']);
    }
}
