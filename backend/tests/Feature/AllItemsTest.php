<?php

namespace Tests\Feature;

use App\Models\Deck;
use App\Models\Quiz;
use App\Models\User;
use Illuminate\Foundation\Testing\TestCase;

class AllItemsTest extends TestCase
{
    private static $user1;
    private static $user2;

    public static function setUpBeforeClass(): void
    {
        parent::setUpBeforeClass();

        self::$user1 = User::factory()->hasDecks(7)->hasQuizzes(4)->create();
        self::$user2 = User::factory()->hasDecks(100)->hasQuizzes(50)->create();
    }

    protected function setUp(): void
    {
        parent::setUp();
    }

    protected function tearDown(): void
    {
        parent::tearDown();
    }

    public static function tearDownAfterClass(): void
    {
        self::$user1->delete();
        self::$user2->delete();

        parent::tearDownAfterClass();
    }

    public function test_all_items_get_by_page(): void
    {
        $response = $this->getJson('/api/all');

        $response->assertStatus(200)->assertJsonCount(18, 'data');

        $response->assertJsonStructure()
            ->orWhereJsonStructure([
                'data' => [
                    '*' => [
                        'id',
                        'name',
                        'is_public',
                        'type',
                        'likes',
                        'tag',
                        'owner',
                        'is_liked',
                        'flashcards' => [
                            '*' => [
                                'question',
                                'answer'
                            ]
                        ]
                    ]
                ],
                'links',
                'meta'
            ])
            ->orWhereJsonStructure([
                'data' => [
                    '*' => [
                        'id',
                        'name',
                        'is_public',
                        'type',
                        'likes',
                        'tag',
                        'owner',
                        'is_liked',
                        'qcms' => [
                            '*' => [
                                'id',
                                'question',
                                'answers' => [
                                    '*' => [
                                        'answer',
                                        'isValid'
                                    ]
                                ]
                            ]
                        ]
                    ]
                ],
                'links',
                'meta'
            ]);


        $this->assertEquals($response['meta']['total'], Deck::where('is_public', true)->count() + Quiz::where('is_public', true)->count());
    }

    public function test_all_items_get_my_items(): void
    {
        $this->actingAs(self::$user1);

        $response = $this->getJson('/api/all?me');

        $response->assertStatus(200)->assertJsonCount(11, 'data');
        $this->assertEquals($response['meta']['total'], 11);

        $response->assertJsonStructure()
            ->orWhereJsonStructure([
                'data' => [
                    '*' => [
                        'id',
                        'name',
                        'is_public',
                        'type',
                        'likes',
                        'tag',
                        'owner',
                        'is_liked',
                        'flashcards' => [
                            '*' => [
                                'question',
                                'answer'
                            ]
                        ]
                    ]
                ],
                'links',
                'meta'
            ])
            ->orWhereJsonStructure([
                'data' => [
                    '*' => [
                        'id',
                        'name',
                        'is_public',
                        'type',
                        'likes',
                        'tag',
                        'owner',
                        'is_liked',
                        'qcms' => [
                            '*' => [
                                'id',
                                'question',
                                'answers' => [
                                    '*' => [
                                        'answer',
                                        'isValid'
                                    ]
                                ]
                            ]
                        ]
                    ]
                ],
                'links',
                'meta'
            ]);
    }

    public function test_get_all_items_unauthorized(): void
    {
        $response = $this->getJson('/api/all?me');

        $response->assertStatus(401)->assertJson([
            'message' => 'Unauthorized'
        ]);
    }
}