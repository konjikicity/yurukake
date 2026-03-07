<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ExpenseTemplateFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'name' => fake()->randomElement(['家賃', '光熱費', '通信費', '保険料']),
            'amount' => fake()->numberBetween(1000, 100000),
        ];
    }
}
