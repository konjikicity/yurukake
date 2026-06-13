<?php

namespace Tests\Feature;

use App\Models\SavingsGoal;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SavingsGoalTest extends TestCase
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

    public function test_get_returns_empty_when_not_set(): void
    {
        $response = $this->withHeaders($this->authHeaders())
            ->getJson('/api/savings-goal');

        $response->assertStatus(200)->assertExactJson([]);
    }

    public function test_can_create_fixed_goal(): void
    {
        $response = $this->withHeaders($this->authHeaders())
            ->postJson('/api/savings-goal', [
                'type' => 'fixed',
                'amount' => 50000,
            ]);

        $response->assertStatus(200)
            ->assertJsonFragment(['type' => 'fixed', 'amount' => 50000, 'percentage' => null]);

        $this->assertDatabaseHas('savings_goals', [
            'user_id' => $this->user->id,
            'type' => 'fixed',
            'amount' => 50000,
        ]);
    }

    public function test_can_create_ratio_goal(): void
    {
        $response = $this->withHeaders($this->authHeaders())
            ->postJson('/api/savings-goal', [
                'type' => 'ratio',
                'percentage' => 20,
            ]);

        $response->assertStatus(200)
            ->assertJsonFragment(['type' => 'ratio', 'amount' => null, 'percentage' => 20]);
    }

    public function test_upserts_existing_goal(): void
    {
        SavingsGoal::create([
            'user_id' => $this->user->id,
            'type' => 'fixed',
            'amount' => 30000,
        ]);

        $response = $this->withHeaders($this->authHeaders())
            ->postJson('/api/savings-goal', [
                'type' => 'ratio',
                'percentage' => 25,
            ]);

        $response->assertStatus(200);
        $this->assertDatabaseCount('savings_goals', 1);
        $this->assertDatabaseHas('savings_goals', [
            'user_id' => $this->user->id,
            'type' => 'ratio',
            'percentage' => 25,
            'amount' => null,
        ]);
    }

    public function test_fixed_requires_amount(): void
    {
        $response = $this->withHeaders($this->authHeaders())
            ->postJson('/api/savings-goal', ['type' => 'fixed']);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['amount']);
    }

    public function test_ratio_requires_percentage_in_range(): void
    {
        $response = $this->withHeaders($this->authHeaders())
            ->postJson('/api/savings-goal', ['type' => 'ratio', 'percentage' => 150]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['percentage']);
    }

    public function test_requires_authentication(): void
    {
        $this->getJson('/api/savings-goal')->assertStatus(401);
        $this->postJson('/api/savings-goal', ['type' => 'fixed', 'amount' => 1000])
            ->assertStatus(401);
    }
}
