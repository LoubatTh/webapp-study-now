<?php

namespace Tests\Feature;

use App\Models\Deck;
use App\Models\User;
use App\Models\UserDeck;
use Illuminate\Foundation\Testing\TestCase;

class UserDeckTest extends TestCase
{
    private $deck;
    private $privateDeck;
    private $userDeck;
    private static $user;

    private static $userPrivate;

    public static function setUpBeforeClass(): void
    {
        parent::setUpBeforeClass();

        self::$user = User::factory()->create();
        self::$userPrivate = User::factory()->create();
    }

    protected function setUp(): void
    {
        parent::setUp();

        $this->deck = Deck::factory()->hasFlashcards(10)->create(
            [
                'id' => 1,
                'name' => 'Test',
                'is_public' => true,
                'likes' => 2,
                'user_id' => self::$user->id,
            ]
        );

        $this->privateDeck = Deck::factory()->hasFlashcards(3)->create(
            [
                'id' => 2,
                'name' => 'TestPrivate',
                'is_public' => false,
                'likes' => 20,
                'user_id' => self::$userPrivate->id,
            ]
        );
        $userDeck = UserDeck::factory()->create();
        $userDeck->delete();

        $this->userDeck = UserDeck::factory()->create(
            [
                'user_id' => self::$user->id,
                'deck_id' => $this->deck->id,
                'next_repetition' => 10,
                'is_liked' => true,
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

        parent::tearDownAfterClass();
    }

    public function test_dislike_deck_by_id(): void
    {
        $this->actingAs(self::$user);

        $likeData = [
            "isLiked" => false,
        ];

        $userDeckBefore = UserDeck::where('user_id', self::$user->id)->where('deck_id', 1)->first();
        $response = $this->putJson('/api/decks/1/like', $likeData, [
            'Accept' => 'application/json',
            'Content-Type' => 'application/json'
        ]);

        $response->assertStatus(204);
        $userDeckAfter = UserDeck::where('user_id', self::$user->id)->where('deck_id', 1)->first();

        $this->assertEquals($userDeckAfter->user_id, self::$user->id);
        $this->assertEquals($userDeckAfter->deck_id, 1);
        $this->assertEquals($userDeckAfter->repetition, $userDeckBefore->repetition);

        $this->assertTrue($userDeckBefore->is_liked);
        $this->assertFalse($userDeckAfter->is_liked);
    }

    public function test_like_deck_first_time_by_id(): void
    {
        $this->actingAs(self::$user);

        $likeData = [
            "isLiked" => true,
        ];

        $response = $this->putJson('/api/decks/2/like', $likeData, [
            'Accept' => 'application/json',
            'Content-Type' => 'application/json'
        ]);

        $response->assertStatus(204);
        $userDeckAfter = UserDeck::where('user_id', self::$user->id)->where('deck_id', 2)->first();

        $this->assertEquals($userDeckAfter->user_id, self::$user->id);
        $this->assertEquals($userDeckAfter->deck_id, 2);
        $this->assertEquals($userDeckAfter->next_repetition, 0);

        $this->assertTrue($userDeckAfter->is_liked);
    }

    public function test_like_deck_by_id_unauthorized(): void
    {
        $likeData = [
            "isLiked" => true,
        ];

        $response = $this->putJson('/api/decks/1/like', $likeData, [
            'Accept' => 'application/json',
            'Content-Type' => 'application/json'
        ]);

        $response->assertStatus(401)->assertJson([
            'message' => 'Unauthenticated.'
        ]);
    }

    public function test_like_deck_by_id_not_found(): void
    {
        $this->actingAs(self::$user);

        $likeData = [
            "isLiked" => true,
        ];

        $response = $this->putJson('/api/decks/1000/like', $likeData, [
            'Accept' => 'application/json',
            'Content-Type' => 'application/json'
        ]);

        $response->assertStatus(404)->assertJson([
            'message' => 'Deck not found'
        ]);
    }

    public function test_store_deck_results(): void
    {
        $this->actingAs(self::$user);

        $gradeData = [
            'deck_id' => 2,
            'grade' => 5,
        ];

        $response = $this->postJson('/api/decks/results', $gradeData);

        $response->assertStatus(201);
        $userDeck = UserDeck::where('user_id', self::$user->id)->where('deck_id', 2)->first();

        $this->assertDatabaseHas('user_decks', [
            'user_id' => self::$user->id,
            'deck_id' => 2,
            'is_liked' => false,
        ]);

        $this->assertDatabaseHas('user_deck_results', [
            'user_deck_id' => $userDeck->id,
            'grade' => 5
        ]);

    }

    public function test_store_deck_results_repetition(): void
    {
        $this->actingAs(self::$user);

        $gradeData = [
            'deck_id' => 2,
            'grade' => 0,
        ];

        $this->postJson('/api/decks/results', $gradeData);

        $grade = [
            'deck_id' => 2,
            'grade' => 1,
        ];

        $response = $this->postJson('/api/decks/results', $grade);

        $response->assertStatus(201);
        $userDeck = UserDeck::where('user_id', self::$user->id)->where('deck_id', 2)->first();

        $this->assertDatabaseHas('user_decks', [
            'user_id' => self::$user->id,
            'deck_id' => 2,
            'is_liked' => false,
        ]);

        $this->assertDatabaseHas('user_deck_results', [
            'user_deck_id' => $userDeck->id,
            'grade' => 1,
        ]);

        $this->assertDatabaseHas('user_deck_results', [
            'user_deck_id' => $userDeck->id,
            'grade' => 0,
        ]);

    }

    // public function test_grade_deck_badly_by_id(): void
    // {
    //     $this->actingAs(self::$user);

    //     $grade = [
    //         'grade' => 3.2,
    //     ];

    //     $this->putJson('/api/decks/2/grade', $grade, [
    //         'Accept' => 'application/json',
    //         'Content-Type' => 'application/json'
    //     ]);

    //     $grade = [
    //         'grade' => 5,
    //     ];

    //     $this->putJson('/api/decks/2/grade', $grade, [
    //         'Accept' => 'application/json',
    //         'Content-Type' => 'application/json'
    //     ]);

    //     $grade = [
    //         'grade' => 1.2
    //     ];

    //     $userDeckBefore = UserDeck::where('user_id', self::$user->id)->where('deck_id', 2)->first();
    //     $response = $this->putJson('/api/decks/2/grade', $grade, [
    //         'Accept' => 'application/json',
    //         'Content-Type' => 'application/json'
    //     ]);

    //     $response->assertStatus(204);
    //     $userDeck = UserDeck::where('user_id', self::$user->id)->where('deck_id', 2)->first();

    //     $this->assertDatabaseHas('user_decks', [
    //         'user_id' => self::$user->id,
    //         'deck_id' => 2,
    //         'next_repetition' => 0,
    //         'is_liked' => false,
    //     ]);

    // }

    public function test_store_deck_results_unauthorized(): void
    {
        $gradeData = [
            'deck_id' => 2,
            'grade' => 4
        ];

        $response = $this->postJson('/api/decks/results', $gradeData);

        $response->assertStatus(401)->assertJson([
            'message' => 'Unauthenticated.'
        ]);
    }

    public function test_store_deck_results_deck_not_found(): void
    {
        $this->actingAs(self::$user);

        $gradeData = [
            'deck_id' => 1000,
            'grade' => 5
        ];

        $response = $this->postJson('/api/decks/results', $gradeData);

        $response->assertStatus(404)->assertJson([
            'error' => 'Deck not found'
        ]);
    }
}