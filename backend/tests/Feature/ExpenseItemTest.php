<?php

namespace Tests\Feature;

use App\Models\ExpenseItem;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ExpenseItemTest extends TestCase
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

    public function test_can_list_expense_items_by_year_and_month(): void
    {
        ExpenseItem::factory()->create(['user_id' => $this->user->id, 'year' => 2026, 'month' => 3]);
        ExpenseItem::factory()->create(['user_id' => $this->user->id, 'year' => 2026, 'month' => 4]);

        $response = $this->withHeaders($this->authHeaders())
            ->getJson('/api/expense-items?year=2026&month=3');

        $response->assertStatus(200)
            ->assertJsonCount(1);
    }

    public function test_cannot_see_other_users_expense_items(): void
    {
        $other = User::factory()->create();
        ExpenseItem::factory()->create(['user_id' => $other->id, 'year' => 2026, 'month' => 3]);

        $response = $this->withHeaders($this->authHeaders())
            ->getJson('/api/expense-items?year=2026&month=3');

        $response->assertStatus(200)
            ->assertJsonCount(0);
    }

    public function test_can_create_expense_item(): void
    {
        $response = $this->withHeaders($this->authHeaders())
            ->postJson('/api/expense-items', [
                'year' => 2026,
                'month' => 3,
                'name' => '家賃',
                'amount' => 80000,
            ]);

        $response->assertStatus(201)
            ->assertJsonFragment(['name' => '家賃', 'amount' => 80000]);

        $this->assertDatabaseHas('expense_items', [
            'user_id' => $this->user->id,
            'name' => '家賃',
        ]);
    }

    public function test_create_expense_item_validates(): void
    {
        $response = $this->withHeaders($this->authHeaders())
            ->postJson('/api/expense-items', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['year', 'month', 'name', 'amount']);
    }

    public function test_can_update_expense_item(): void
    {
        $item = ExpenseItem::factory()->create(['user_id' => $this->user->id]);

        $response = $this->withHeaders($this->authHeaders())
            ->putJson("/api/expense-items/{$item->id}", [
                'name' => '更新済み',
                'amount' => 100000,
            ]);

        $response->assertStatus(200)
            ->assertJsonFragment(['name' => '更新済み']);
    }

    public function test_cannot_update_other_users_expense_item(): void
    {
        $other = User::factory()->create();
        $item = ExpenseItem::factory()->create(['user_id' => $other->id]);

        $response = $this->withHeaders($this->authHeaders())
            ->putJson("/api/expense-items/{$item->id}", [
                'name' => 'ハック',
                'amount' => 999999,
            ]);

        $response->assertStatus(403);
    }

    public function test_can_delete_expense_item(): void
    {
        $item = ExpenseItem::factory()->create(['user_id' => $this->user->id]);

        $response = $this->withHeaders($this->authHeaders())
            ->deleteJson("/api/expense-items/{$item->id}");

        $response->assertStatus(204);
        $this->assertDatabaseMissing('expense_items', ['id' => $item->id]);
    }

    public function test_cannot_delete_other_users_expense_item(): void
    {
        $other = User::factory()->create();
        $item = ExpenseItem::factory()->create(['user_id' => $other->id]);

        $response = $this->withHeaders($this->authHeaders())
            ->deleteJson("/api/expense-items/{$item->id}");

        $response->assertStatus(403);
    }

    public function test_unauthenticated_cannot_access(): void
    {
        $response = $this->getJson('/api/expense-items?year=2026&month=3');
        $response->assertStatus(401);
    }
}
