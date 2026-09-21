<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class AccountBalanceFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'year' => 2026,
            'month' => fake()->numberBetween(1, 12),
            'amount' => fake()->numberBetween(100000, 1000000),
        ];
    }
}
