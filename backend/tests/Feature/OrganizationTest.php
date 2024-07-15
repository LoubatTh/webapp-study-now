<?php

namespace Tests\Feature;

use App\Models\User;
use App\Enums\TokenAbility;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\TestCase;
use Illuminate\Support\Facades\Hash;
use Laravel\Cashier\Cashier;

class OrganizationTest extends TestCase
{
    private static $premiumUser;
    private static $user;

    public static function setUpBeforeClass(): void
    {
        parent::setUpBeforeClass();

        self::$premiumUser = User::factory()->create();
        self::$premiumUser->newSubscription('default', 'price_1PVCT5LDBaFPKLdsUk1W8WUK')->create();
        self::$user = User::factory()->create();
    }

    public static function tearDownAfterClass(): void
    {
        self::$premiumUser->delete();
        self::$user->delete();
        // $this->token = null;
        // $this->refreshToken = null;

        parent::tearDownAfterClass();
    }

    public function test_store_organization(): void
    {
        $this->actingAs($this->premiumUser);

        $response = $this->postJson(
            '/organizations',
            [
                'name' => 'test_organization',
            ],
            [
                'Accept' => 'application/json',
                'Content-Type' => 'application/json',
                //     'Authorization' => "Bearer {$this->refreshToken}"
            ],
        );

        $response->dump();
        $response->assertStatus(200);
    }
}
