<?php

namespace Tests\Feature;

use App\Models\Deck;
use App\Models\User;
use Illuminate\Testing\Fluent\AssertableJson;
use Illuminate\Foundation\Testing\TestCase;

class DeckTest extends TestCase
{
    private $deck;
    private $privateDeck;
    private static $user;
    private static $userPrivate;
    private static $user1;
    private static $user2;

    public static function setUpBeforeClass(): void
    {
        parent::setUpBeforeClass();

        self::$user = User::factory()->hasDecks(2)->create();
        self::$user->delete();
        self::$user = User::factory()->create();

        self::$userPrivate = User::factory()->create();

        self::$user1 = User::factory()->hasDecks(7)->create();
        self::$user2 = User::factory()->hasDecks(100)->create();
    }

    protected function setUp(): void
    {
        parent::setUp();

        $this->deck = Deck::factory()->hasFlashcards(10)->create(
            [
                'id' => 1,
                'name' => 'Test',
                'is_public' => true,
                'is_organization' => false,
                'likes' => 2,
                'tag_id' => 1,
                'user_id' => self::$user->id,
            ]
        );

        $this->privateDeck = Deck::factory()->hasFlashcards(3)->create(
            [
                'id' => 2,
                'name' => 'TestPrivate',
                'is_public' => false,
                'is_organization' => false,
                'likes' => 20,
                'tag_id' => 1,
                'user_id' => self::$userPrivate->id,
            ]
        );
    }

    protected function tearDown(): void
    {
        $this->deck->delete();
        $this->privateDeck->delete();
        parent::tearDown();
    }

    public static function tearDownAfterClass(): void
    {
        self::$user->delete();
        self::$userPrivate->delete();
        self::$user1->delete();
        self::$user2->delete();
        self::$tag1->delete();

        parent::tearDownAfterClass();
    }

    public function test_deck_get_by_page(): void
    {
        $response = $this->getJson('/api/decks');

        $response->assertStatus(200)->assertJsonCount(10, 'decks');

        $response->assertJsonStructure([
            'decks' => [
                '*' => [
                    'id',
                    'name',
                    'is_public',
                    'is_organization',
                    'type',
                    'likes',
                    'tag',
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
        ]);

        $this->assertEquals($response['meta']['total'], Deck::where('is_public', true)->count());
    }

    public function test_deck_get_my_decks(): void
    {
        $this->actingAs(self::$user1);

        $response = $this->getJson('/api/decks?myDecks');

        $response->assertStatus(200)->assertJsonCount(7, 'decks');
        $this->assertEquals($response['meta']['total'], 7);

        $response->assertJsonStructure([
            'decks' => [
                '*' => [
                    'id',
                    'name',
                    'is_public',
                    'is_organization',
                    'type',
                    'likes',
                    'tag',
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
        ]);
    }

    public function test_deck_get_my_decks_unauthorized(): void
    {
        $response = $this->getJson('/api/decks?myDecks');

        $response->assertStatus(401)->assertJson([
            'message' => 'Unauthorized'
        ]);
    }

    public function test_deck_get_by_id(): void
    {
        $response = $this->getJson('/api/decks/1');

        $response->assertStatus(200)->assertJson(
            fn(AssertableJson $json) =>
            $json->hasAll(['id', 'name', 'is_public', 'is_organization', 'type', 'likes', 'tag', 'flashcards'])
                ->has(
                    'flashcards',
                    fn($json) =>
                    $json->each(
                        fn($json) =>
                        $json->whereType('id', 'integer')
                            ->whereType('question', 'string')
                            ->whereType('answer', 'string')
                    )
                )
        );

        $this->assertTrue($response['name'] == 'Test');
        $this->assertTrue($response['is_public'] == true);
        $this->assertTrue($response['is_organization'] == false);
        $this->assertTrue($response['type'] == 'Deck');
        $this->assertTrue($response['tag'] == 'Mathematics');
        $this->assertTrue($response['likes'] == 2);
        $this->assertTrue(count($response['flashcards']) == 10);

        foreach ($response['flashcards'] as $flashcard) {
            $this->assertTrue($flashcard['question'] != null);
            $this->assertTrue($flashcard['answer'] != null);
        }
    }

    public function test_deck_get_by_id_private(): void
    {
        $this->actingAs(self::$userPrivate);

        $response = $this->getJson('/api/decks/2');

        $response->assertStatus(200)->assertJson(
            fn(AssertableJson $json) =>
            $json->hasAll(['id', 'name', 'is_public', 'is_organization', 'type', 'likes', 'tag', 'flashcards'])
                ->has(
                    'flashcards',
                    fn($json) =>
                    $json->each(
                        fn($json) =>
                        $json->whereType('id', 'integer')
                            ->whereType('question', 'string')
                            ->whereType('answer', 'string')
                    )
                )
        );

        $this->assertTrue($response['name'] == 'TestPrivate');
        $this->assertTrue($response['is_public'] == false);
        $this->assertTrue($response['is_organization'] == false);
        $this->assertTrue($response['type'] == 'Deck');
        $this->assertTrue($response['tag'] == 'Mathematics');
        $this->assertTrue($response['likes'] == 20);
        $this->assertTrue(count($response['flashcards']) == 3);

        foreach ($response['flashcards'] as $flashcard) {
            $this->assertTrue($flashcard['question'] != null);
            $this->assertTrue($flashcard['answer'] != null);
        }
    }

    public function test_deck_get_by_id_unauthorized(): void
    {
        $response = $this->getJson('/api/decks/2');

        $response->assertStatus(401)->assertJson([
            'message' => 'Unauthorized'
        ]);
    }

    public function test_deck_get_by_id_forbidden(): void
    {
        $this->actingAs(self::$user);

        $response = $this->getJson('/api/decks/2');

        $response->assertStatus(403)->assertJson([
            'message' => 'Forbidden'
        ]);
    }

    public function test_deck_get_by_id_not_found(): void
    {
        $response = $this->getJson('/api/decks/1000');

        $response->assertStatus(404)->assertJson([
            'message' => 'Deck not found'
        ]);
    }

    public function test_deck_can_be_created(): void
    {
        $this->actingAs(self::$user);

        $deckData = [
            'name' => 'Test2',
            'is_public' => false,
            'is_organization' => false,
            'tag_id' => 3,
            'flashcards' => [
                [
                    'question' => 'Question1',
                    'answer' => 'Answer1',
                ],
                [
                    'question' => 'Question2',
                    'answer' => 'Answer2',
                ]
            ]
        ];

        $response = $this->postJson('/api/decks', $deckData, [
            'Accept' => 'application/json',
            'Content-Type' => 'application/json'
        ]);

        $response->assertStatus(201)->assertJson([
            'message' => 'Deck created successfully'
        ]);

        $this->assertDatabaseHas('decks', [
            'name' => $deckData['name'],
            'is_public' => $deckData['is_public'],
            'is_organization' => $deckData['is_organization'],
            'type' => 'Deck',
            'tag_id' => 3
        ]);

        $deckId = Deck::where('name', $deckData['name'])->first()->id;

        foreach ($deckData['flashcards'] as $flashcard) {
            $this->assertDatabaseHas('flashcards', [
                'deck_id' => $deckId,
                'question' => $flashcard['question'],
                'answer' => $flashcard['answer']
            ]);
        }
    }

    public function test_deck_creation_unauthorized(): void
    {
        $deckData = [
            'name' => 'Test2',
            'is_public' => true,
            'is_organization' => false,
            'tag_id' => 4,
            'flashcards' => [
                [
                    'question' => 'Question1',
                    'answer' => 'Answer1',
                ],
                [
                    'question' => 'Question2',
                    'answer' => 'Answer2',
                ]
            ]
        ];

        $response = $this->postJson('/api/decks', $deckData, [
            'Accept' => 'application/json',
            'Content-Type' => 'application/json'
        ]);

        $response->assertStatus(401)->assertJson([
            'message' => 'Unauthenticated.'
        ]);
    }

    public function test_deck_can_be_updated(): void
    {
        $this->actingAs(self::$user);

        $deckData = [
            'name' => 'Test3',
            'is_public' => false,
            'is_organization' => true,
            'likes' => 14,
            'tag_id' => 8,
            'flashcards' => [
                [
                    'question' => 'Question3',
                    'answer' => 'Answer3',
                ],
                [
                    'question' => 'Question4',
                    'answer' => 'Answer4',
                ]
            ]
        ];

        $response = $this->putJson('/api/decks/1', $deckData, [
            'Accept' => 'application/json',
            'Content-Type' => 'application/json'
        ]);

        $this->assertEquals(Deck::find(1)->user_id, self::$user->id);

        $response->assertStatus(204);

        $this->assertDatabaseHas('decks', [
            'name' => $deckData['name'],
            'is_public' => $deckData['is_public'],
            'is_organization' => $deckData['is_organization'],
            'type' => 'Deck',
            'tag_id' => 8
        ]);

        $this->assertEquals(Deck::where('name', $deckData['name'])->first()->id, 1);

        foreach ($deckData['flashcards'] as $flashcard) {
            $this->assertDatabaseHas('flashcards', [
                'deck_id' => 1,
                'question' => $flashcard['question'],
                'answer' => $flashcard['answer']
            ]);
        }
    }

    public function test_deck_update_unauthorized(): void
    {
        $deckData = [
            'name' => 'Test3',
            'is_public' => false,
            'is_organization' => true,
            'likes' => 14,
            'flashcards' => [
                [
                    'question' => 'Question3',
                    'answer' => 'Answer3',
                ],
                [
                    'question' => 'Question4',
                    'answer' => 'Answer4',
                ]
            ]
        ];

        $response = $this->putJson('/api/decks/1', $deckData, [
            'Accept' => 'application/json',
            'Content-Type' => 'application/json'
        ]);

        $response->assertStatus(401)->assertJson([
            'message' => 'Unauthenticated.'
        ]);
    }

    public function test_deck_update_forbidden(): void
    {
        $this->actingAs(self::$user);

        $deckData = [
            'name' => 'Test3',
            'is_public' => false,
            'is_organization' => true,
            'likes' => 14,
            'flashcards' => [
                [
                    'question' => 'Question3',
                    'answer' => 'Answer3',
                ],
                [
                    'question' => 'Question4',
                    'answer' => 'Answer4',
                ]
            ]
        ];

        $response = $this->putJson('/api/decks/2', $deckData, [
            'Accept' => 'application/json',
            'Content-Type' => 'application/json'
        ]);

        $response->assertStatus(403)->assertJson([
            'message' => 'Forbidden'
        ]);
    }

    public function test_deck_can_be_deleted(): void
    {
        $this->actingAs(self::$user);

        $flashcards = Deck::find(1)->flashcards();

        $this->assertEquals(Deck::find(1)->user_id, self::$user->id);

        $response = $this->deleteJson('/api/decks/1', [
            'Accept' => 'application/json',
            'Content-Type' => 'application/json'
        ]);

        $response->assertStatus(204);

        $this->assertDatabaseMissing('decks', [
            'name' => 'Test',
            'id' => 1,
        ]);

        foreach ($flashcards as $flashcard) {
            $this->assertDatabaseMissing('flashcards', [
                'id' => $flashcard->id,
            ]);
        }
    }

    public function test_deck_deletion_unauthorized(): void
    {
        $response = $this->deleteJson('/api/decks/1', [
            'Accept' => 'application/json',
            'Content-Type' => 'application/json'
        ]);

        $response->assertStatus(401)->assertJson([
            'message' => 'Unauthenticated.'
        ]);
    }

    public function test_deck_deletion_forbidden(): void
    {
        $this->actingAs(self::$user);

        $response = $this->deleteJson('/api/decks/2', [
            'Accept' => 'application/json',
            'Content-Type' => 'application/json'
        ]);

        $response->assertStatus(403)->assertJson([
            'message' => 'Forbidden'
        ]);
    }
}

