<?php

namespace Tests\Feature\Auth;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ApiJsonErrorTest extends TestCase
{
    use RefreshDatabase;

    public function test_unauthenticated_api_request_without_json_accept_header_returns_401(): void
    {
        $response = $this->get('/api/user');

        $response->assertStatus(401);
        $response->assertJson(['message' => 'Unauthenticated.']);
    }

    public function test_api_request_with_invalid_token_returns_401(): void
    {
        $response = $this->withHeaders(['Authorization' => 'Bearer invalid-token'])
            ->get('/api/user');

        $response->assertStatus(401);
    }

    public function test_unknown_api_route_returns_json_404(): void
    {
        $response = $this->get('/api/does-not-exist');

        $response->assertStatus(404);
        $response->assertHeader('content-type', 'application/json');
    }
}
