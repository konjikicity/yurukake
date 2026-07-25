<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\ExpenseItem;
use App\Models\IncomeItem;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CategoryYearlySummaryTest extends TestCase
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

    private function category(string $name, string $color = '#7ec8e3', string $type = 'expense'): Category
    {
        return Category::factory()->create([
            'user_id' => $this->user->id,
            'type' => $type,
            'name' => $name,
            'color' => $color,
        ]);
    }

    private function expense(int $month, int $amount, ?int $categoryId = null): void
    {
        ExpenseItem::factory()->create([
            'user_id' => $this->user->id,
            'year' => 2026,
            'month' => $month,
            'amount' => $amount,
            'category_id' => $categoryId,
        ]);
    }

    public function test_returns_twelve_rows_with_zero_filled_months(): void
    {
        $rent = $this->category('家賃');
        $this->expense(1, 80000, $rent->id);

        $response = $this->withHeaders($this->authHeaders())
            ->getJson('/api/category-yearly-summary?year=2026&type=expense');

        $response->assertStatus(200);
        $data = $response->json('data');

        $this->assertCount(12, $data);
        $this->assertSame(1, $data[0]['month']);
        $this->assertSame(80000, $data[0]["cat_{$rent->id}"]);
        $this->assertSame(0, $data[1]["cat_{$rent->id}"]);
        $this->assertSame(0, $data[1]['total']);
    }

    public function test_series_carry_name_and_colour_and_are_ordered_by_yearly_total(): void
    {
        $rent = $this->category('家賃', '#7ec8e3');
        $food = $this->category('食費', '#f48fb1');
        $this->expense(1, 30000, $food->id);
        $this->expense(1, 80000, $rent->id);

        $response = $this->withHeaders($this->authHeaders())
            ->getJson('/api/category-yearly-summary?year=2026&type=expense');

        $series = $response->json('series');
        $this->assertSame("cat_{$rent->id}", $series[0]['key']);
        $this->assertSame('家賃', $series[0]['name']);
        $this->assertSame('#7ec8e3', $series[0]['color']);
        $this->assertSame(80000, $series[0]['total']);
        $this->assertSame("cat_{$food->id}", $series[1]['key']);
    }

    public function test_uncategorised_items_are_grouped_under_a_fixed_key(): void
    {
        $this->expense(2, 5000);

        $response = $this->withHeaders($this->authHeaders())
            ->getJson('/api/category-yearly-summary?year=2026&type=expense');

        $series = $response->json('series');
        $this->assertSame('cat_none', $series[0]['key']);
        $this->assertSame('未分類', $series[0]['name']);
        $this->assertNull($series[0]['color']);
        $this->assertSame(5000, $response->json('data')[1]['cat_none']);
    }

    public function test_collapses_categories_beyond_the_limit_into_other(): void
    {
        for ($i = 1; $i <= 10; $i++) {
            $category = $this->category("カテゴリ{$i}");
            $this->expense(1, $i * 1000, $category->id);
        }

        $response = $this->withHeaders($this->authHeaders())
            ->getJson('/api/category-yearly-summary?year=2026&type=expense');

        $series = $response->json('series');
        $this->assertCount(9, $series);
        $this->assertSame('cat_other', $series[8]['key']);
        $this->assertSame('その他', $series[8]['name']);
        $this->assertSame(3000, $series[8]['total']);
        $this->assertSame(3000, $response->json('data')[0]['cat_other']);
    }

    public function test_month_totals_match_the_sum_of_all_series(): void
    {
        $rent = $this->category('家賃');
        $food = $this->category('食費');
        $this->expense(3, 80000, $rent->id);
        $this->expense(3, 30000, $food->id);
        $this->expense(3, 1000);

        $march = $this->withHeaders($this->authHeaders())
            ->getJson('/api/category-yearly-summary?year=2026&type=expense')
            ->json('data')[2];

        $this->assertSame(111000, $march['total']);
    }

    public function test_supports_income_type(): void
    {
        $salary = Category::factory()->create([
            'user_id' => $this->user->id,
            'type' => 'income',
            'name' => '給与',
            'color' => '#81c784',
        ]);
        IncomeItem::factory()->create([
            'user_id' => $this->user->id,
            'year' => 2026,
            'month' => 5,
            'amount' => 320000,
            'category_id' => $salary->id,
        ]);
        $this->expense(5, 80000);

        $response = $this->withHeaders($this->authHeaders())
            ->getJson('/api/category-yearly-summary?year=2026&type=income');

        $series = $response->json('series');
        $this->assertCount(1, $series);
        $this->assertSame('給与', $series[0]['name']);
        $this->assertSame(320000, $response->json('data')[4]['total']);
    }

    public function test_does_not_include_other_users_data(): void
    {
        $other = User::factory()->create();
        ExpenseItem::factory()->create([
            'user_id' => $other->id,
            'year' => 2026,
            'month' => 1,
            'amount' => 999999,
        ]);

        $response = $this->withHeaders($this->authHeaders())
            ->getJson('/api/category-yearly-summary?year=2026&type=expense');

        $this->assertSame([], $response->json('series'));
        $this->assertSame(0, $response->json('data')[0]['total']);
    }

    public function test_rejects_an_unknown_type(): void
    {
        $this->withHeaders($this->authHeaders())
            ->getJson('/api/category-yearly-summary?year=2026&type=bogus')
            ->assertStatus(422);
    }

    public function test_requires_authentication(): void
    {
        $this->getJson('/api/category-yearly-summary?year=2026&type=expense')->assertStatus(401);
    }
}
