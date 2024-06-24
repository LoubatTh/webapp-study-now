<?php

namespace Tests\Feature;

use App\Enums\TokenAbility;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Carbon;
use Illuminate\Testing\Fluent\AssertableJson;
use Tests\TestCase;

class AuthTest extends TestCase
{
    private $user;
    private $token;
    private $refreshToken;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create(
            [
                'name' => 'testUser' . date_create()->format('m-d-Y'),
                'email' => 'testUser@test.test',
                'password' => Hash::make('testPassword'),
            ]
        );
        $this->accessToken = $this->user->createToken('access_token', [TokenAbility::ACCESS_API->value], Carbon::now()->addMinutes(config('sanctum.ac_expiration')))->plainTextToken;
        $this->refreshToken = $this->user->createToken('refresh_token', [TokenAbility::ISSUE_ACCESS_TOKEN->value], Carbon::now()->addMinutes(config('sanctum.rt_expiration')))->plainTextToken;
    }

    protected function tearDown(): void
    {
        parent::tearDown();
        $this->user->delete();
        $this->token = null;
        $this->refreshToken = null;
    }

    public function test_user_can_be_registered(): void
    {
        $response = $this->postJson(
            '/api/register',
            [
                'name' => 'authTest',
                'email' => 'authTest@test.com',
                'password' => 'authTest'
            ],
            [
                'Accept' => 'application/json',
                'Content-Type' => 'application/json'
            ],
        );

        $response->assertStatus(201)->assertJson(
            fn(AssertableJson $json) =>
            $json->hasAll(['access-token', 'access-token-expiration', 'refresh-token', 'refresh-token-expiration'])
        );

    }

    public function test_user_register_validation_fails(): void
    {
        // Sending register request whith missing name, already taken email and password length < 8
        $response = $this->postJson(
            '/api/register',
            [
                'email' => 'authTest@test.com',
                'password' => 'auth'
            ],
            [
                'Accept' => 'application/json',
                'Content-Type' => 'application/json'
            ],
        );

        $response->assertStatus(400)->assertJson(
            fn(AssertableJson $json) =>
            $json->hasAll(['name', 'email', 'password'])
        );
    }

    public function test_user_can_be_logged_in(): void
    {
        $response = $this->postJson(
            '/api/login',
            [
                'email' => 'authTest@test.com',
                'password' => 'authTest'
            ],
            [
                'Accept' => 'application/json',
                'Content-Type' => 'application/json'
            ],
        );

        $response->assertStatus(200)->assertJson(
            fn(AssertableJson $json) =>
            $json->hasAll(['access-token', 'access-token-expiration', 'refresh-token', 'refresh-token-expiration'])
        );

        $token = $response['access-token'];
        $deleteResponse = $this->deleteJson(
            '/api/user',
            [],
            [
                'Accept' => 'application/json',
                'Content-Type' => 'application/json',
                'Authorization' => 'Bearer ' . $token
            ],
        );

        $deleteResponse->assertStatus(200);
    }

    public function test_user_refresh_token(): void
    {
        $this->actingAs($this->user);

        $response = $this->getJson(
            '/api/refresh',
            [
                'Accept' => 'application/json',
                'Content-Type' => 'application/json',
                'Authorization' => 'Bearer ' . $this->refreshToken
            ],
        );

        $response->assertStatus(200)->assertJson(
            fn(AssertableJson $json) =>
            $json->hasAll(['access-token', 'access-token-expiration'])
        );
    }

    public function test_user_logout(): void
    {
        $this->actingAs($this->user);

        $response = $this->postJson(
            '/api/logout',
            [],
            [
                'Accept' => 'application/json',
                'Content-Type' => 'application/json',
                'Authorization' => 'Bearer ' . $this->token
            ]
        );

        $response->assertStatus(200)->assertJson(
            fn(AssertableJson $json) =>
            $json->hasAll(['message'])
        );
    }
}

