<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class CategoryFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'type' => fake()->randomElement(['income', 'expense']),
            'name' => fake()->randomElement(['給料', '食費', '家賃', '交通費']),
            'color' => fake()->hexColor(),
        ];
    }
}
