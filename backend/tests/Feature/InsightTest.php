<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\ExpenseItem;
use App\Models\IncomeItem;
use App\Models\MonthlyBudget;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class InsightTest extends TestCase
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

    private function expense(int $year, int $month, int $amount, ?int $categoryId = null): void
    {
        ExpenseItem::factory()->create([
            'user_id' => $this->user->id,
            'year' => $year,
            'month' => $month,
            'amount' => $amount,
            'category_id' => $categoryId,
        ]);
    }

    private function factsOf(array $body, string $type): ?array
    {
        foreach ($body['facts'] as $fact) {
            if ($fact['type'] === $type) {
                return $fact;
            }
        }

        return null;
    }

    public function test_year_over_year_expense_compares_with_the_same_month_last_year(): void
    {
        $this->expense(2025, 6, 205000);
        $this->expense(2026, 6, 182000);

        $response = $this->withHeaders($this->authHeaders())->getJson('/api/insights?year=2026&month=6');
        $response->assertStatus(200);

        $fact = $this->factsOf($response->json(), 'yoy_expense');
        $this->assertNotNull($fact);
        $this->assertSame(182000, $fact['current']);
        $this->assertSame(205000, $fact['previous']);
        $this->assertSame(-23000, $fact['diff']);
        $this->assertEqualsWithDelta(-11.2, $fact['rate'], 0.01);
        $this->assertSame('down', $fact['direction']);
    }

    public function test_year_over_year_reports_new_when_there_is_no_previous_data(): void
    {
        $this->expense(2026, 6, 182000);

        $response = $this->withHeaders($this->authHeaders())->getJson('/api/insights?year=2026&month=6');

        $fact = $this->factsOf($response->json(), 'yoy_expense');
        $this->assertNotNull($fact);
        $this->assertSame(0, $fact['previous']);
        $this->assertNull($fact['rate']);
        $this->assertSame('new', $fact['direction']);
    }

    public function test_month_over_month_for_january_looks_at_december_of_the_previous_year(): void
    {
        $this->expense(2025, 12, 100000);
        $this->expense(2026, 1, 150000);

        $response = $this->withHeaders($this->authHeaders())->getJson('/api/insights?year=2026&month=1');

        $fact = $this->factsOf($response->json(), 'mom_expense');
        $this->assertNotNull($fact);
        $this->assertSame(100000, $fact['previous']);
        $this->assertSame(50000, $fact['diff']);
        $this->assertSame('up', $fact['direction']);
    }

    public function test_top_category_reports_name_colour_and_share(): void
    {
        $food = Category::factory()->create([
            'user_id' => $this->user->id,
            'type' => 'expense',
            'name' => '食費',
            'color' => '#f48fb1',
        ]);
        $this->expense(2026, 6, 60000, $food->id);
        $this->expense(2026, 6, 40000);

        $response = $this->withHeaders($this->authHeaders())->getJson('/api/insights?year=2026&month=6');

        $fact = $this->factsOf($response->json(), 'top_category');
        $this->assertNotNull($fact);
        $this->assertSame('食費', $fact['category_name']);
        $this->assertSame('#f48fb1', $fact['category_color']);
        $this->assertSame(60000, $fact['total']);
        $this->assertEqualsWithDelta(60.0, $fact['share'], 0.01);
    }

    public function test_budget_fact_is_omitted_when_no_budget_is_set(): void
    {
        $this->expense(2026, 6, 182000);

        $response = $this->withHeaders($this->authHeaders())->getJson('/api/insights?year=2026&month=6');

        $this->assertNull($this->factsOf($response->json(), 'budget'));
    }

    public function test_budget_fact_reports_the_usage_level(): void
    {
        $this->expense(2026, 6, 182000);
        MonthlyBudget::create([
            'user_id' => $this->user->id,
            'year' => 2026,
            'month' => 6,
            'amount' => 200000,
        ]);

        $response = $this->withHeaders($this->authHeaders())->getJson('/api/insights?year=2026&month=6');

        $fact = $this->factsOf($response->json(), 'budget');
        $this->assertNotNull($fact);
        $this->assertSame(200000, $fact['budget']);
        $this->assertEqualsWithDelta(91.0, $fact['rate'], 0.01);
        $this->assertSame('warn', $fact['level']);
    }

    public function test_returns_yearly_insights_when_month_is_omitted(): void
    {
        $this->expense(2025, 3, 100000);
        $this->expense(2026, 3, 120000);
        IncomeItem::factory()->create([
            'user_id' => $this->user->id,
            'year' => 2026,
            'month' => 3,
            'amount' => 400000,
        ]);

        $response = $this->withHeaders($this->authHeaders())->getJson('/api/insights?year=2026');

        $response->assertStatus(200);
        $this->assertNull($response->json('month'));
        $fact = $this->factsOf($response->json(), 'yoy_expense');
        $this->assertSame(120000, $fact['current']);
        $this->assertSame(100000, $fact['previous']);
    }

    public function test_does_not_include_other_users_data(): void
    {
        $other = User::factory()->create();
        ExpenseItem::factory()->create([
            'user_id' => $other->id,
            'year' => 2026,
            'month' => 6,
            'amount' => 999999,
        ]);
        $this->expense(2026, 6, 1000);

        $response = $this->withHeaders($this->authHeaders())->getJson('/api/insights?year=2026&month=6');

        $fact = $this->factsOf($response->json(), 'yoy_expense');
        $this->assertSame(1000, $fact['current']);
    }

    public function test_requires_authentication(): void
    {
        $this->getJson('/api/insights?year=2026&month=6')->assertStatus(401);
    }
}
