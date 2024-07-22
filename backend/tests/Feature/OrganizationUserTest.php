<?php

namespace Tests\Feature;

use App\Models\Organization;
use App\Models\OrganizationInvitation;
use App\Models\User;
use Illuminate\Foundation\Testing\TestCase;

class OrganizationUserTest extends TestCase
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

    public function test_invite_a_user_to_the_organization(): void
    {
        $this->actingAs(self::$premiumUser);

        $response = $this->postJson(
            "/api/organizations/{$this->organization->id}/users",
            [
                'email' => self::$user->email,
            ],
            [
                'Accept' => 'application/json',
                'Content-Type' => 'application/json',
            ],
        );

        $response->assertSuccessful();
    }

    public function test_show_organization_invitation(): void
    {
        $this->actingAs(self::$user);
        OrganizationInvitation::factory()
            ->set('user_id', self::$user->id)
            ->set('organization_id', $this->organization->id)
            ->create();

        $response = $this->getJson(
            '/api/user/invites',
            [
                'Accept' => 'application/json',
                'Content-Type' => 'application/json',
            ]
        );

        $response->assertJsonCount(1);
        $response->assertSuccessful();
    }

    public function test_accept_organization_invitation(): void
    {
        $this->actingAs(self::$user);
        $invitation = OrganizationInvitation::factory()
            ->set('user_id', self::$user->id)
            ->set('organization_id', $this->organization->id)
            ->create();

        $response = $this->postJson(
            "/api/organizations/invites/{$invitation->id}",
            [
                'accept' => true,
            ],
            [
                'Accept' => 'application/json',
                'Content-Type' => 'application/json',
            ]
        );

        $response->assertJsonStructure(['message']);
        $response->assertSuccessful();
    }

    public function test_list_user_organizations(): void
    {
        $this->actingAs(self::$premiumUser);

        $response = $this->getJson(
            '/api/user/organizations',
            [
                'Accept' => 'application/json',
                'Content-Type' => 'application/json',
            ]
        );

        $response->assertJsonStructure([
            'owned_organizations',
            'organizations',
        ]);
        $response->assertSuccessful();
    }

    public function test_get_organization_members(): void
    {
        $this->actingAs(self::$user);
        $this->organization->users()->attach(self::$user->id);

        $response = $this->getJson(
            "/api/organizations/{$this->organization->id}/users",
        );

        $response->assertJsonStructure(['owner', 'members']);
        $response->assertJsonCount(1, 'members');
        $response->assertSuccessful();
    }

    public function test_remove_user_from_organization(): void
    {
        $this->actingAs(self::$premiumUser);
        $userId = self::$user->id;
        $this->organization->users()->attach($userId);

        $response = $this->deleteJson(
            "/api/organizations/{$this->organization->id}/users/{$userId}",
            [
                'Accept' => 'application/json',
                'Content-Type' => 'application/json',
            ]
        );

        $response->assertStatus(204);
    }
}
