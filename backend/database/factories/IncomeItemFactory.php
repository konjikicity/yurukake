<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class IncomeItemFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'year' => 2026,
            'month' => fake()->numberBetween(1, 12),
            'name' => fake()->randomElement(['給料', 'ボーナス', '副業', '投資']),
            'amount' => fake()->numberBetween(10000, 500000),
        ];
    }
}
