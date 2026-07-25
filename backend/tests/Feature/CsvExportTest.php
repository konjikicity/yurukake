<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\ExpenseItem;
use App\Models\IncomeItem;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CsvExportTest extends TestCase
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

    private function download(string $query = '?year=2026'): string
    {
        $response = $this->withHeaders($this->authHeaders())->get("/api/export{$query}");
        $response->assertStatus(200);

        return $response->streamedContent();
    }

    public function test_starts_with_a_bom_and_a_header_row(): void
    {
        $content = $this->download();

        $this->assertStringStartsWith("\xEF\xBB\xBF", $content);
        $this->assertStringContainsString('type,year,month,name,amount,category', $content);
    }

    public function test_exports_income_and_expense_with_category_names(): void
    {
        $salary = Category::factory()->create([
            'user_id' => $this->user->id,
            'type' => 'income',
            'name' => '給与',
        ]);
        IncomeItem::factory()->create([
            'user_id' => $this->user->id,
            'year' => 2026,
            'month' => 3,
            'name' => '3月給与',
            'amount' => 320000,
            'category_id' => $salary->id,
        ]);
        ExpenseItem::factory()->create([
            'user_id' => $this->user->id,
            'year' => 2026,
            'month' => 3,
            'name' => '家賃',
            'amount' => 85000,
            'category_id' => null,
        ]);

        $content = $this->download();

        $this->assertStringContainsString('income,2026,3,3月給与,320000,給与', $content);
        $this->assertStringContainsString('expense,2026,3,家賃,85000,', $content);
    }

    public function test_filters_by_year(): void
    {
        ExpenseItem::factory()->create([
            'user_id' => $this->user->id, 'year' => 2025, 'month' => 1, 'name' => '去年', 'amount' => 1000,
        ]);
        ExpenseItem::factory()->create([
            'user_id' => $this->user->id, 'year' => 2026, 'month' => 1, 'name' => '今年', 'amount' => 2000,
        ]);

        $content = $this->download('?year=2026');

        $this->assertStringContainsString('今年', $content);
        $this->assertStringNotContainsString('去年', $content);
    }

    public function test_filters_by_type(): void
    {
        IncomeItem::factory()->create([
            'user_id' => $this->user->id, 'year' => 2026, 'month' => 1, 'name' => 'にゅうきん', 'amount' => 1000,
        ]);
        ExpenseItem::factory()->create([
            'user_id' => $this->user->id, 'year' => 2026, 'month' => 1, 'name' => 'しゅっきん', 'amount' => 2000,
        ]);

        $content = $this->download('?year=2026&type=income');

        $this->assertStringContainsString('にゅうきん', $content);
        $this->assertStringNotContainsString('しゅっきん', $content);
    }

    public function test_escapes_names_containing_commas_quotes_and_newlines(): void
    {
        ExpenseItem::factory()->create([
            'user_id' => $this->user->id,
            'year' => 2026,
            'month' => 1,
            'name' => "a,b\"c\nd",
            'amount' => 100,
        ]);

        $content = $this->download();

        $this->assertStringContainsString('"a,b""c' . "\n" . 'd"', $content);
    }

    public function test_does_not_include_other_users_data(): void
    {
        $other = User::factory()->create();
        ExpenseItem::factory()->create([
            'user_id' => $other->id, 'year' => 2026, 'month' => 1, 'name' => 'ひみつ', 'amount' => 1,
        ]);

        $this->assertStringNotContainsString('ひみつ', $this->download());
    }

    public function test_sends_a_filename(): void
    {
        $response = $this->withHeaders($this->authHeaders())->get('/api/export?year=2026');

        $this->assertStringContainsString(
            'yurukake_2026.csv',
            $response->headers->get('content-disposition')
        );
        $this->assertStringStartsWith('attachment;', $response->headers->get('content-disposition'));
    }

    public function test_requires_authentication(): void
    {
        $this->getJson('/api/export?year=2026')->assertStatus(401);
    }
}
