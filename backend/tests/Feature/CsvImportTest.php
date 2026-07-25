<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\ExpenseItem;
use App\Models\IncomeItem;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Tests\TestCase;

class CsvImportTest extends TestCase
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

    private function csv(string $body, string $name = 'import.csv'): UploadedFile
    {
        $path = tempnam(sys_get_temp_dir(), 'csv');
        file_put_contents($path, $body);

        return new UploadedFile($path, $name, 'text/csv', null, true);
    }

    private function import(string $body, array $params = [])
    {
        return $this->withHeaders($this->authHeaders())
            ->post('/api/import', array_merge(['file' => $this->csv($body)], $params));
    }

    private const HEADER = "type,year,month,name,amount,category\n";

    public function test_imports_valid_rows(): void
    {
        $response = $this->import(self::HEADER . "income,2026,3,給与,320000,\nexpense,2026,3,家賃,85000,\n");

        $response->assertStatus(200);
        $this->assertSame(2, $response->json('imported'));
        $this->assertDatabaseHas('income_items', ['name' => '給与', 'amount' => 320000, 'year' => 2026]);
        $this->assertDatabaseHas('expense_items', ['name' => '家賃', 'amount' => 85000]);
    }

    public function test_rejects_the_whole_file_when_any_row_is_invalid(): void
    {
        $response = $this->import(
            self::HEADER . "income,2026,3,給与,320000,\nexpense,2026,13,こわれた,-5,\n"
        );

        $response->assertStatus(422);
        $this->assertSame(0, $response->json('imported'));
        $this->assertDatabaseCount('income_items', 0);
        $this->assertDatabaseCount('expense_items', 0);
    }

    public function test_reports_the_original_file_line_number_for_errors(): void
    {
        $response = $this->import(self::HEADER . "income,2026,3,ok,1000,\nbogus,2026,3,ng,1000,\n");

        $response->assertStatus(422);
        $this->assertSame(3, $response->json('errors.0.row'));
    }

    public function test_skips_rows_that_already_exist(): void
    {
        ExpenseItem::factory()->create([
            'user_id' => $this->user->id,
            'year' => 2026, 'month' => 3, 'name' => '家賃', 'amount' => 85000, 'category_id' => null,
        ]);

        $response = $this->import(self::HEADER . "expense,2026,3,家賃,85000,\n");

        $response->assertStatus(200);
        $this->assertSame(0, $response->json('imported'));
        $this->assertSame(1, $response->json('skipped'));
        $this->assertDatabaseCount('expense_items', 1);
    }

    public function test_collapses_duplicates_inside_the_file(): void
    {
        $response = $this->import(self::HEADER . "expense,2026,3,家賃,85000,\nexpense,2026,3,家賃,85000,\n");

        $this->assertSame(1, $response->json('imported'));
        $this->assertSame(1, $response->json('skipped'));
        $this->assertDatabaseCount('expense_items', 1);
    }

    public function test_creates_unknown_categories_by_default(): void
    {
        $response = $this->import(self::HEADER . "expense,2026,3,ランチ,1200,娯楽\n");

        $response->assertStatus(200);
        $this->assertSame(['娯楽'], $response->json('created_categories'));
        $this->assertDatabaseHas('categories', ['user_id' => $this->user->id, 'type' => 'expense', 'name' => '娯楽']);
        $category = Category::where('name', '娯楽')->first();
        $this->assertDatabaseHas('expense_items', ['name' => 'ランチ', 'category_id' => $category->id]);
    }

    public function test_reuses_an_existing_category(): void
    {
        $existing = Category::factory()->create([
            'user_id' => $this->user->id, 'type' => 'expense', 'name' => '食費',
        ]);

        $response = $this->import(self::HEADER . "expense,2026,3,スーパー,3000,食費\n");

        $this->assertSame([], $response->json('created_categories'));
        $this->assertDatabaseHas('expense_items', ['name' => 'スーパー', 'category_id' => $existing->id]);
        $this->assertDatabaseCount('categories', 1);
    }

    public function test_leaves_category_null_when_creation_is_disabled(): void
    {
        $response = $this->import(
            self::HEADER . "expense,2026,3,ランチ,1200,娯楽\n",
            ['create_categories' => '0']
        );

        $response->assertStatus(200);
        $this->assertDatabaseMissing('categories', ['name' => '娯楽']);
        $this->assertDatabaseHas('expense_items', ['name' => 'ランチ', 'category_id' => null]);
    }

    public function test_replace_mode_clears_only_the_months_present_in_the_file(): void
    {
        ExpenseItem::factory()->create([
            'user_id' => $this->user->id, 'year' => 2026, 'month' => 3, 'name' => 'ふるい', 'amount' => 1,
        ]);
        ExpenseItem::factory()->create([
            'user_id' => $this->user->id, 'year' => 2026, 'month' => 4, 'name' => 'のこる', 'amount' => 1,
        ]);

        $this->import(self::HEADER . "expense,2026,3,あたらしい,5000,\n", ['mode' => 'replace'])
            ->assertStatus(200);

        $this->assertDatabaseMissing('expense_items', ['name' => 'ふるい']);
        $this->assertDatabaseHas('expense_items', ['name' => 'のこる']);
        $this->assertDatabaseHas('expense_items', ['name' => 'あたらしい']);
    }

    public function test_accepts_a_shift_jis_file(): void
    {
        $body = mb_convert_encoding(self::HEADER . "expense,2026,3,家賃,85000,\n", 'SJIS-win', 'UTF-8');

        $this->import($body)->assertStatus(200);

        $this->assertDatabaseHas('expense_items', ['name' => '家賃']);
    }

    public function test_accepts_a_file_with_a_bom(): void
    {
        $this->import("\xEF\xBB\xBF" . self::HEADER . "expense,2026,3,家賃,85000,\n")
            ->assertStatus(200);

        $this->assertDatabaseHas('expense_items', ['name' => '家賃']);
    }

    public function test_accepts_japanese_header_names(): void
    {
        $this->import("種別,年,月,項目名,金額,カテゴリ\n支出,2026,3,家賃,85000,\n")
            ->assertStatus(200);

        $this->assertDatabaseHas('expense_items', ['name' => '家賃']);
    }

    public function test_rejects_a_file_with_too_many_rows(): void
    {
        $rows = str_repeat("expense,2026,3,x,100,\n", 5001);

        $response = $this->import(self::HEADER . $rows);

        $response->assertStatus(422);
        $this->assertDatabaseCount('expense_items', 0);
    }

    public function test_dry_run_validates_without_writing(): void
    {
        $response = $this->import(self::HEADER . "expense,2026,3,家賃,85000,\n", ['dry_run' => '1']);

        $response->assertStatus(200);
        $this->assertSame(1, $response->json('imported'));
        $this->assertDatabaseCount('expense_items', 0);
    }

    public function test_export_then_import_round_trips(): void
    {
        $category = Category::factory()->create([
            'user_id' => $this->user->id, 'type' => 'expense', 'name' => '食費',
        ]);
        ExpenseItem::factory()->create([
            'user_id' => $this->user->id,
            'year' => 2026, 'month' => 3, 'name' => 'スーパー, 特売', 'amount' => 3000,
            'category_id' => $category->id,
        ]);
        IncomeItem::factory()->create([
            'user_id' => $this->user->id,
            'year' => 2026, 'month' => 3, 'name' => '給与', 'amount' => 320000, 'category_id' => null,
        ]);

        $csv = $this->withHeaders($this->authHeaders())->get('/api/export?year=2026')->streamedContent();

        ExpenseItem::query()->delete();
        IncomeItem::query()->delete();

        $response = $this->import($csv);

        $response->assertStatus(200);
        $this->assertSame(2, $response->json('imported'));
        $this->assertDatabaseHas('expense_items', [
            'name' => 'スーパー, 特売', 'amount' => 3000, 'category_id' => $category->id,
        ]);
        $this->assertDatabaseHas('income_items', ['name' => '給与', 'amount' => 320000]);
    }

    public function test_requires_authentication(): void
    {
        $this->postJson('/api/import')->assertStatus(401);
    }
}
