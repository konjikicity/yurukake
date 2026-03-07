<?php

namespace Tests\Feature;

use App\Models\IncomeItem;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class IncomeItemTest extends TestCase
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

    public function test_can_list_income_items_by_year_and_month(): void
    {
        IncomeItem::factory()->create(['user_id' => $this->user->id, 'year' => 2026, 'month' => 3]);
        IncomeItem::factory()->create(['user_id' => $this->user->id, 'year' => 2026, 'month' => 4]);

        $response = $this->withHeaders($this->authHeaders())
            ->getJson('/api/income-items?year=2026&month=3');

        $response->assertStatus(200)
            ->assertJsonCount(1);
    }

    public function test_cannot_see_other_users_income_items(): void
    {
        $other = User::factory()->create();
        IncomeItem::factory()->create(['user_id' => $other->id, 'year' => 2026, 'month' => 3]);

        $response = $this->withHeaders($this->authHeaders())
            ->getJson('/api/income-items?year=2026&month=3');

        $response->assertStatus(200)
            ->assertJsonCount(0);
    }

    public function test_can_create_income_item(): void
    {
        $response = $this->withHeaders($this->authHeaders())
            ->postJson('/api/income-items', [
                'year' => 2026,
                'month' => 3,
                'name' => '給料',
                'amount' => 300000,
            ]);

        $response->assertStatus(201)
            ->assertJsonFragment(['name' => '給料', 'amount' => 300000]);

        $this->assertDatabaseHas('income_items', [
            'user_id' => $this->user->id,
            'name' => '給料',
        ]);
    }

    public function test_create_income_item_validates(): void
    {
        $response = $this->withHeaders($this->authHeaders())
            ->postJson('/api/income-items', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['year', 'month', 'name', 'amount']);
    }

    public function test_can_update_income_item(): void
    {
        $item = IncomeItem::factory()->create(['user_id' => $this->user->id]);

        $response = $this->withHeaders($this->authHeaders())
            ->putJson("/api/income-items/{$item->id}", [
                'name' => '更新済み',
                'amount' => 500000,
            ]);

        $response->assertStatus(200)
            ->assertJsonFragment(['name' => '更新済み']);
    }

    public function test_cannot_update_other_users_income_item(): void
    {
        $other = User::factory()->create();
        $item = IncomeItem::factory()->create(['user_id' => $other->id]);

        $response = $this->withHeaders($this->authHeaders())
            ->putJson("/api/income-items/{$item->id}", [
                'name' => 'ハック',
                'amount' => 999999,
            ]);

        $response->assertStatus(403);
    }

    public function test_can_delete_income_item(): void
    {
        $item = IncomeItem::factory()->create(['user_id' => $this->user->id]);

        $response = $this->withHeaders($this->authHeaders())
            ->deleteJson("/api/income-items/{$item->id}");

        $response->assertStatus(204);
        $this->assertDatabaseMissing('income_items', ['id' => $item->id]);
    }

    public function test_cannot_delete_other_users_income_item(): void
    {
        $other = User::factory()->create();
        $item = IncomeItem::factory()->create(['user_id' => $other->id]);

        $response = $this->withHeaders($this->authHeaders())
            ->deleteJson("/api/income-items/{$item->id}");

        $response->assertStatus(403);
    }

    public function test_unauthenticated_cannot_access(): void
    {
        $response = $this->getJson('/api/income-items?year=2026&month=3');
        $response->assertStatus(401);
    }
}
