<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CategoryTest extends TestCase
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

    public function test_can_list_categories_by_type(): void
    {
        Category::factory()->create(['user_id' => $this->user->id, 'type' => 'income']);
        Category::factory()->create(['user_id' => $this->user->id, 'type' => 'expense']);
        Category::factory()->create(['user_id' => $this->user->id, 'type' => 'expense']);

        $response = $this->withHeaders($this->authHeaders())
            ->getJson('/api/categories?type=expense');

        $response->assertStatus(200)->assertJsonCount(2);
    }

    public function test_can_list_all_categories(): void
    {
        Category::factory()->count(3)->create(['user_id' => $this->user->id]);

        $response = $this->withHeaders($this->authHeaders())
            ->getJson('/api/categories');

        $response->assertStatus(200)->assertJsonCount(3);
    }

    public function test_can_create_category(): void
    {
        $response = $this->withHeaders($this->authHeaders())
            ->postJson('/api/categories', [
                'type' => 'expense',
                'name' => '食費',
                'color' => '#ff9800',
            ]);

        $response->assertStatus(201)
            ->assertJsonFragment(['name' => '食費', 'color' => '#ff9800']);
    }

    public function test_can_update_category(): void
    {
        $category = Category::factory()->create(['user_id' => $this->user->id]);

        $response = $this->withHeaders($this->authHeaders())
            ->putJson("/api/categories/{$category->id}", ['name' => '更新済み']);

        $response->assertStatus(200)->assertJsonFragment(['name' => '更新済み']);
    }

    public function test_cannot_update_other_users_category(): void
    {
        $other = User::factory()->create();
        $category = Category::factory()->create(['user_id' => $other->id]);

        $response = $this->withHeaders($this->authHeaders())
            ->putJson("/api/categories/{$category->id}", ['name' => 'ハック']);

        $response->assertStatus(403);
    }

    public function test_can_delete_category(): void
    {
        $category = Category::factory()->create(['user_id' => $this->user->id]);

        $response = $this->withHeaders($this->authHeaders())
            ->deleteJson("/api/categories/{$category->id}");

        $response->assertStatus(204);
    }

    public function test_create_validates(): void
    {
        $response = $this->withHeaders($this->authHeaders())
            ->postJson('/api/categories', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['type', 'name']);
    }
}
