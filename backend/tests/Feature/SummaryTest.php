<?php

namespace Tests\Feature;

use App\Models\ExpenseItem;
use App\Models\IncomeItem;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SummaryTest extends TestCase
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

    public function test_returns_monthly_summary_for_year(): void
    {
        IncomeItem::factory()->create(['user_id' => $this->user->id, 'year' => 2026, 'month' => 1, 'amount' => 300000]);
        IncomeItem::factory()->create(['user_id' => $this->user->id, 'year' => 2026, 'month' => 1, 'amount' => 50000]);
        ExpenseItem::factory()->create(['user_id' => $this->user->id, 'year' => 2026, 'month' => 1, 'amount' => 100000]);

        IncomeItem::factory()->create(['user_id' => $this->user->id, 'year' => 2026, 'month' => 3, 'amount' => 200000]);

        $response = $this->withHeaders($this->authHeaders())
            ->getJson('/api/summary?year=2026');

        $response->assertStatus(200);

        $data = $response->json();
        $this->assertCount(12, $data);

        $jan = collect($data)->firstWhere('month', 1);
        $this->assertEquals(350000, $jan['income']);
        $this->assertEquals(100000, $jan['expense']);
        $this->assertEquals(250000, $jan['balance']);

        $mar = collect($data)->firstWhere('month', 3);
        $this->assertEquals(200000, $mar['income']);
        $this->assertEquals(0, $mar['expense']);
        $this->assertEquals(200000, $mar['balance']);

        $feb = collect($data)->firstWhere('month', 2);
        $this->assertEquals(0, $feb['income']);
        $this->assertEquals(0, $feb['expense']);
        $this->assertEquals(0, $feb['balance']);
    }

    public function test_does_not_include_other_users_data(): void
    {
        $other = User::factory()->create();
        IncomeItem::factory()->create(['user_id' => $other->id, 'year' => 2026, 'month' => 1, 'amount' => 999999]);

        $response = $this->withHeaders($this->authHeaders())
            ->getJson('/api/summary?year=2026');

        $response->assertStatus(200);
        $jan = collect($response->json())->firstWhere('month', 1);
        $this->assertEquals(0, $jan['income']);
    }

    public function test_unauthenticated_cannot_access_summary(): void
    {
        $response = $this->getJson('/api/summary?year=2026');
        $response->assertStatus(401);
    }
}
