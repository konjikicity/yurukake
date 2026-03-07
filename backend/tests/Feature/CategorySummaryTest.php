<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\ExpenseItem;
use App\Models\IncomeItem;
use App\Models\MonthlyBudget;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CategorySummaryTest extends TestCase
{
    use RefreshDatabase;

    private User $user;
    private string $token;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
        $this->token = $this->user->createToken('test')->plainTextToken;
    }

    private function authHeaders(): array
    {
        return ['Authorization' => "Bearer {$this->token}"];
    }

    public function test_category_summary_for_month(): void
    {
        $food = Category::factory()->create(['user_id' => $this->user->id, 'type' => 'expense', 'name' => '食費']);
        $rent = Category::factory()->create(['user_id' => $this->user->id, 'type' => 'expense', 'name' => '家賃']);

        ExpenseItem::factory()->create(['user_id' => $this->user->id, 'year' => 2026, 'month' => 3, 'category_id' => $food->id, 'amount' => 30000]);
        ExpenseItem::factory()->create(['user_id' => $this->user->id, 'year' => 2026, 'month' => 3, 'category_id' => $food->id, 'amount' => 20000]);
        ExpenseItem::factory()->create(['user_id' => $this->user->id, 'year' => 2026, 'month' => 3, 'category_id' => $rent->id, 'amount' => 80000]);
        ExpenseItem::factory()->create(['user_id' => $this->user->id, 'year' => 2026, 'month' => 3, 'amount' => 5000]);

        $response = $this->withHeaders($this->authHeaders())
            ->getJson('/api/category-summary?year=2026&month=3&type=expense');

        $response->assertStatus(200);
        $data = $response->json();

        $foodItem = collect($data)->firstWhere('category_name', '食費');
        $this->assertEquals(50000, $foodItem['total']);

        $rentItem = collect($data)->firstWhere('category_name', '家賃');
        $this->assertEquals(80000, $rentItem['total']);

        $uncategorized = collect($data)->firstWhere('category_name', '未分類');
        $this->assertEquals(5000, $uncategorized['total']);
    }

    public function test_summary_includes_budget(): void
    {
        MonthlyBudget::factory()->create([
            'user_id' => $this->user->id,
            'year' => 2026,
            'month' => 1,
            'amount' => 200000,
        ]);

        $response = $this->withHeaders($this->authHeaders())
            ->getJson('/api/summary?year=2026');

        $response->assertStatus(200);
        $jan = collect($response->json())->firstWhere('month', 1);
        $this->assertEquals(200000, $jan['budget']);
    }

    public function test_summary_includes_previous_year(): void
    {
        IncomeItem::factory()->create(['user_id' => $this->user->id, 'year' => 2025, 'month' => 1, 'amount' => 250000]);
        ExpenseItem::factory()->create(['user_id' => $this->user->id, 'year' => 2025, 'month' => 1, 'amount' => 150000]);

        $response = $this->withHeaders($this->authHeaders())
            ->getJson('/api/summary?year=2026');

        $response->assertStatus(200);
        $jan = collect($response->json())->firstWhere('month', 1);
        $this->assertEquals(250000, $jan['prev_income']);
        $this->assertEquals(150000, $jan['prev_expense']);
    }
}
