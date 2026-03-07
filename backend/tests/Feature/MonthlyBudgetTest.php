<?php

namespace Tests\Feature;

use App\Models\MonthlyBudget;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MonthlyBudgetTest extends TestCase
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

    public function test_can_set_budget(): void
    {
        $response = $this->withHeaders($this->authHeaders())
            ->postJson('/api/monthly-budgets', [
                'year' => 2026,
                'month' => 3,
                'amount' => 200000,
            ]);

        $response->assertStatus(201)
            ->assertJsonFragment(['amount' => 200000]);
    }

    public function test_can_update_existing_budget(): void
    {
        MonthlyBudget::factory()->create([
            'user_id' => $this->user->id,
            'year' => 2026,
            'month' => 3,
            'amount' => 200000,
        ]);

        $response = $this->withHeaders($this->authHeaders())
            ->postJson('/api/monthly-budgets', [
                'year' => 2026,
                'month' => 3,
                'amount' => 300000,
            ]);

        $response->assertStatus(200)
            ->assertJsonFragment(['amount' => 300000]);

        $this->assertDatabaseCount('monthly_budgets', 1);
    }

    public function test_can_get_budget(): void
    {
        MonthlyBudget::factory()->create([
            'user_id' => $this->user->id,
            'year' => 2026,
            'month' => 3,
            'amount' => 200000,
        ]);

        $response = $this->withHeaders($this->authHeaders())
            ->getJson('/api/monthly-budgets?year=2026&month=3');

        $response->assertStatus(200)
            ->assertJsonFragment(['amount' => 200000]);
    }

    public function test_get_budget_returns_null_when_not_set(): void
    {
        $response = $this->withHeaders($this->authHeaders())
            ->getJson('/api/monthly-budgets?year=2026&month=3');

        $response->assertStatus(200)
            ->assertJson(['amount' => null]);
    }

    public function test_validates_input(): void
    {
        $response = $this->withHeaders($this->authHeaders())
            ->postJson('/api/monthly-budgets', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['year', 'month', 'amount']);
    }
}
