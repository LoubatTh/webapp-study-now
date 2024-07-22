<?php

namespace Tests\Feature;

use App\Models\Organization;
use App\Models\User;
use Illuminate\Foundation\Testing\TestCase;

class OrganizationTest extends TestCase
{
    private static $premiumUser;
    private static $user;
    private $organization;

    public static function setUpBeforeClass(): void
    {
        parent::setUpBeforeClass();

        self::$premiumUser = User::factory()->create();
        self::$premiumUser->newSubscription('default', 'price_1PVCT5LDBaFPKLdsUk1W8WUK')->create('pm_card_visa');
        self::$user = User::factory()->create();
    }

    public function setUp(): void
    {
        parent::setUp();

        $this->organization = Organization::factory()->set('owner_id', self::$premiumUser->id)->create([
            'name' => 'unit_test_organization'
        ]);
    }

    public function tearDown(): void
    {
        parent::tearDown();

        $this->organization->delete();
    }

    public static function tearDownAfterClass(): void
    {
        self::$premiumUser->delete();
        self::$user->delete();

        parent::tearDownAfterClass();
    }

    public function test_store_organization(): void
    {
        $this->actingAs(self::$premiumUser);

        $response = $this->postJson(
            '/api/organizations',
            [
                'name' => 'test_organization',
                'description' => 'This is an organization created for testing purpose',
            ],
            [
                'Accept' => 'application/json',
                'Content-Type' => 'application/json',
            ],
        );

        $response->assertJsonStructure([
            'message'
        ]);
        $response->assertSuccessful();

        if ($response->assertSuccessful()) {
            Organization::where('owner_id', self::$premiumUser->id)->first()->delete();
        }
    }

    public function test_try_storing_organization_without_premium(): void
    {
        $this->actingAs(self::$user);

        $response = $this->postJson(
            '/api/organizations',
            [
                'name' => 'test_organization',
                'description' => 'This is an organization created for testing purpose',
            ],
            [
                'Accept' => 'application/json',
                'Content-Type' => 'application/json',
            ],
        );

        $response->assertJsonStructure([
            'error'
        ]);
        $response->assertStatus(403);
    }

    public function test_show_organization(): void
    {
        $this->actingAs(self::$premiumUser);

        $response = $this->getJson(
            '/api/organizations/' . $this->organization->id,
            [
                'Accept' => 'application/json',
                'Content-Type' => 'application/json',
            ]
        );

        $response->assertSuccessful();
    }

    public function test_update_organization(): void
    {
        $this->actingAs(self::$premiumUser);

        $response = $this->putJson(
            '/api/organizations/' . $this->organization->id,
            [
                'name' => 'updated_test_organization',
            ],
            [
                'Accept' => 'application/json',
                'Content-Type' => 'application/json',
            ]
        );

        $response->assertJsonStructure([
            'message'
        ]);
        $response->assertSuccessful();
    }

    public function test_update_organization_without_being_owner(): void
    {
        $this->actingAs(self::$user);

        $response = $this->putJson(
            '/api/organizations/' . $this->organization->id,
            [
                'name' => 'updated_test_organization',
            ],
            [
                'Accept' => 'application/json',
                'Content-Type' => 'application/json',
            ]
        );

        $response->assertJsonStructure([
            'error'
        ]);
        $response->assertStatus(403);
    }

    public function test_delete_organization(): void
    {
        $this->actingAs(self::$premiumUser);

        $response = $this->deleteJson(
            '/api/organizations/' . $this->organization->id,
            [
                'Accept' => 'application/json',
                'Content-Type' => 'application/json',
            ]
        );

        $response->assertStatus(204);
    }
}
