<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CategorySummaryController;
use App\Http\Controllers\ExpenseItemController;
use App\Http\Controllers\ExpenseTemplateController;
use App\Http\Controllers\IncomeItemController;
use App\Http\Controllers\MonthlyBudgetController;
use App\Http\Controllers\SummaryController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/register', RegisterController::class);
Route::post('/login', [LoginController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', fn (Request $request) => $request->user());
    Route::post('/logout', [LoginController::class, 'logout']);

    Route::apiResource('income-items', IncomeItemController::class)->except(['show']);
    Route::apiResource('expense-items', ExpenseItemController::class)->except(['show']);

    Route::get('/summary', SummaryController::class);

    Route::post('/expense-templates/apply', [ExpenseTemplateController::class, 'apply']);
    Route::apiResource('expense-templates', ExpenseTemplateController::class)->except(['show']);

    Route::apiResource('categories', CategoryController::class)->except(['show']);
    Route::get('/category-summary', CategorySummaryController::class);
    Route::get('/monthly-budgets', [MonthlyBudgetController::class, 'index']);
    Route::post('/monthly-budgets', [MonthlyBudgetController::class, 'store']);
});
