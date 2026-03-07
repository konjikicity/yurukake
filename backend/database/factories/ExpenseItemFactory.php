<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ExpenseItemFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'year' => 2026,
            'month' => fake()->numberBetween(1, 12),
            'name' => fake()->randomElement(['家賃', '食費', '光熱費', '通信費']),
            'amount' => fake()->numberBetween(1000, 200000),
        ];
    }
}
