<?php

namespace Tests\Feature;

use App\Models\ExpenseTemplate;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ExpenseTemplateTest extends TestCase
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

    public function test_can_list_templates(): void
    {
        ExpenseTemplate::factory()->count(3)->create(['user_id' => $this->user->id]);
        $other = User::factory()->create();
        ExpenseTemplate::factory()->create(['user_id' => $other->id]);

        $response = $this->withHeaders($this->authHeaders())
            ->getJson('/api/expense-templates');

        $response->assertStatus(200)
            ->assertJsonCount(3);
    }

    public function test_can_create_template(): void
    {
        $response = $this->withHeaders($this->authHeaders())
            ->postJson('/api/expense-templates', [
                'name' => '家賃',
                'amount' => 80000,
            ]);

        $response->assertStatus(201)
            ->assertJsonFragment(['name' => '家賃', 'amount' => 80000]);

        $this->assertDatabaseHas('expense_templates', [
            'user_id' => $this->user->id,
            'name' => '家賃',
        ]);
    }

    public function test_create_template_validates(): void
    {
        $response = $this->withHeaders($this->authHeaders())
            ->postJson('/api/expense-templates', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name', 'amount']);
    }

    public function test_can_update_template(): void
    {
        $template = ExpenseTemplate::factory()->create(['user_id' => $this->user->id]);

        $response = $this->withHeaders($this->authHeaders())
            ->putJson("/api/expense-templates/{$template->id}", [
                'name' => '更新済み',
                'amount' => 90000,
            ]);

        $response->assertStatus(200)
            ->assertJsonFragment(['name' => '更新済み']);
    }

    public function test_cannot_update_other_users_template(): void
    {
        $other = User::factory()->create();
        $template = ExpenseTemplate::factory()->create(['user_id' => $other->id]);

        $response = $this->withHeaders($this->authHeaders())
            ->putJson("/api/expense-templates/{$template->id}", [
                'name' => 'ハック',
                'amount' => 999999,
            ]);

        $response->assertStatus(403);
    }

    public function test_can_delete_template(): void
    {
        $template = ExpenseTemplate::factory()->create(['user_id' => $this->user->id]);

        $response = $this->withHeaders($this->authHeaders())
            ->deleteJson("/api/expense-templates/{$template->id}");

        $response->assertStatus(204);
        $this->assertDatabaseMissing('expense_templates', ['id' => $template->id]);
    }

    public function test_can_apply_templates_to_month(): void
    {
        ExpenseTemplate::factory()->create(['user_id' => $this->user->id, 'name' => '家賃', 'amount' => 80000]);
        ExpenseTemplate::factory()->create(['user_id' => $this->user->id, 'name' => '通信費', 'amount' => 5000]);

        $response = $this->withHeaders($this->authHeaders())
            ->postJson('/api/expense-templates/apply', [
                'year' => 2026,
                'month' => 3,
            ]);

        $response->assertStatus(201)
            ->assertJsonCount(2);

        $this->assertDatabaseHas('expense_items', [
            'user_id' => $this->user->id,
            'year' => 2026,
            'month' => 3,
            'name' => '家賃',
            'amount' => 80000,
        ]);
        $this->assertDatabaseHas('expense_items', [
            'user_id' => $this->user->id,
            'year' => 2026,
            'month' => 3,
            'name' => '通信費',
            'amount' => 5000,
        ]);
    }

    public function test_apply_validates_year_and_month(): void
    {
        $response = $this->withHeaders($this->authHeaders())
            ->postJson('/api/expense-templates/apply', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['year', 'month']);
    }

    public function test_unauthenticated_cannot_access(): void
    {
        $response = $this->getJson('/api/expense-templates');
        $response->assertStatus(401);
    }
}
