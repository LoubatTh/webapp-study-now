<?php

namespace Tests\Feature;

use App\Enums\TokenAbility;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Hash;
use Illuminate\Testing\Fluent\AssertableJson;
use Illuminate\Foundation\Testing\TestCase;

class UserTest extends TestCase
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

    public function test_get_user_with_token(): void
    {
        $this->actingAs($this->user);
        $response = $this->getJson(
            '/api/user',
            [
                'Accept' => 'application/json',
                'Content-Type' => 'application/json',
                'Authorization' => "Bearer {$this->token}"
            ]
        );

        $response->assertStatus(200)->assertJson(
            fn(AssertableJson $json) =>
            $json->hasAll(['id', 'name', 'email', 'role', 'email_verified_at', 'created_at', 'updated_at', 'is_subscribed'])
        );
    }

    public function test_update_user_with_token(): void
    {
        $this->actingAs($this->user);
        $response = $this->putJson(
            '/api/user',
            [
                'name' => 'testUserUpdated' . date_create()->format('m-d-Y'),
            ],
            [
                'Accept' => 'application/json',
                'Content-Type' => 'application/json',
                'Authorization' => "Bearer {$this->token}"
            ]
        );

        $response->assertStatus(200)->assertJson(
            fn(AssertableJson $json) =>
            $json->hasAll(['message'])
        );
    }

    public function test_update_user_password_with_token(): void
    {
        $this->actingAs($this->user);
        $response = $this->putJson(
            '/api/user',
            [
                'name' => 'testUserUpdated' . date_create()->format('m-d-Y'),
                'password' => 'testPassword',
                'new_password' => 'newTestPassword'
            ],
            [
                'Accept' => 'application/json',
                'Content-Type' => 'application/json',
                'Authorization' => "Bearer {$this->token}"
            ]
        );

        $response->assertStatus(200)->assertJson(
            fn(AssertableJson $json) =>
            $json->hasAll(['message'])
        );
    }

    public function test_delete_user_with_token(): void
    {
        $this->actingAs($this->user);
        $response = $this->deleteJson(
            '/api/user',
            [],
            [
                'Accept' => 'application/json',
                'Content-Type' => 'application/json',
                'Authorization' => "Bearer {$this->token}"
            ]
        );

        $response->assertStatus(200)->assertJson(
            fn(AssertableJson $json) =>
            $json->hasAll(['message'])
        );

    }
}
