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
                'easiness_factor' => 3,
                'repetition' => 10,
                'interval' => 18,
                'date' => now(),
                'user_grade' => 5,
                'prev_user_grade' => 5,
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

        $userDeckBefore = UserDeck::where('user_id', self::$user->id)->where('deck_id', 1)->first();
        $response = $this->putJson('/api/decks/1/like');

        $response->assertStatus(204);
        $userDeckAfter = UserDeck::where('user_id', self::$user->id)->where('deck_id', 1)->first();

        $this->assertEquals($userDeckAfter->user_id, self::$user->id);
        $this->assertEquals($userDeckAfter->deck_id, 1);
        $this->assertEquals($userDeckAfter->easiness_factor, $userDeckBefore->easiness_factor);
        $this->assertEquals($userDeckAfter->repetition, $userDeckBefore->repetition);
        $this->assertEquals($userDeckAfter->interval, $userDeckBefore->interval);
        $this->assertEquals($userDeckAfter->date, $userDeckBefore->date);
        $this->assertEquals($userDeckAfter->user_grade, $userDeckBefore->user_grade);
        $this->assertEquals($userDeckAfter->prev_user_grade, $userDeckBefore->prev_user_grade);

        $this->assertTrue($userDeckBefore->is_liked);
        $this->assertFalse($userDeckAfter->is_liked);
    }

    public function test_like_deck_first_time_by_id(): void
    {
        $this->actingAs(self::$user);

        $response = $this->putJson('/api/decks/2/like');

        $response->assertStatus(204);
        $userDeckAfter = UserDeck::where('user_id', self::$user->id)->where('deck_id', 2)->first();

        $this->assertEquals($userDeckAfter->user_id, self::$user->id);
        $this->assertEquals($userDeckAfter->deck_id, 2);
        $this->assertEquals($userDeckAfter->easiness_factor, 2.5);
        $this->assertEquals($userDeckAfter->repetition, 0);
        $this->assertEquals($userDeckAfter->interval, 0);
        $this->assertEquals($userDeckAfter->user_grade, null);
        $this->assertEquals($userDeckAfter->prev_user_grade, null);

        $this->assertTrue(
            $userDeckAfter->date->between(now()->subSeconds(2), now()->addSeconds(2)),
            'The date is not within the expected range. Expected :' . now() . 'Real: ' . $userDeckAfter->date
        );

        $this->assertTrue($userDeckAfter->is_liked);
    }

    public function test_like_deck_by_id_unauthorized(): void
    {
        $response = $this->putJson('/api/decks/1/like');

        $response->assertStatus(401)->assertJson([
            'message' => 'Unauthenticated.'
        ]);
    }

    public function test_like_deck_by_id_not_found(): void
    {
        $this->actingAs(self::$user);

        $response = $this->putJson('/api/decks/1000/like');

        $response->assertStatus(404)->assertJson([
            'message' => 'Deck not found'
        ]);
    }

    public function test_grade_deck_by_id(): void
    {
        $this->actingAs(self::$user);

        $grade = [
            'grade' => 3.2,
        ];

        $response = $this->putJson('/api/decks/2/grade', $grade, [
            'Accept' => 'application/json',
            'Content-Type' => 'application/json'
        ]);

        $response->assertStatus(204);
        $userDeck = UserDeck::where('user_id', self::$user->id)->where('deck_id', 2)->first();

        $this->assertDatabaseHas('user_decks', [
            'user_id' => self::$user->id,
            'deck_id' => 2,
            'easiness_factor' => 2.5 + (0.1 - (5 - 3.2) * (0.08 + (5 - 3.2) * 0.02)),
            'repetition' => 1,
            'interval' => 1,
            'user_grade' => 3.2,
            'prev_user_grade' => null,
            'is_liked' => false,
        ]);

        $this->assertTrue(
            $userDeck->date->between(now()->subSeconds(2), now()->addSeconds(2)),
            'The date is not within the expected range'
        );
    }

    public function test_grade_deck_repetition_by_id(): void
    {
        $this->actingAs(self::$user);

        $grade = [
            'grade' => 3.2,
        ];

        $this->putJson('/api/decks/2/grade', $grade, [
            'Accept' => 'application/json',
            'Content-Type' => 'application/json'
        ]);

        $grade = [
            'grade' => 5,
        ];

        $userDeckBefore = UserDeck::where('user_id', self::$user->id)->where('deck_id', 2)->first();
        $response = $this->putJson('/api/decks/2/grade', $grade, [
            'Accept' => 'application/json',
            'Content-Type' => 'application/json'
        ]);

        $response->assertStatus(204);
        $userDeck = UserDeck::where('user_id', self::$user->id)->where('deck_id', 2)->first();

        $this->assertDatabaseHas('user_decks', [
            'user_id' => self::$user->id,
            'deck_id' => 2,
            'easiness_factor' => $userDeckBefore->easiness_factor + 0.1,
            'repetition' => 2,
            'interval' => 6,
            'user_grade' => 5,
            'prev_user_grade' => 3.2,
            'is_liked' => false,
        ]);

        $this->assertTrue(
            $userDeck->date->between(now()->subSeconds(2), now()->addSeconds(2)),
            'The date is not within the expected range'
        );
    }

    public function test_grade_deck_badly_by_id(): void
    {
        $this->actingAs(self::$user);

        $grade = [
            'grade' => 3.2,
        ];

        $this->putJson('/api/decks/2/grade', $grade, [
            'Accept' => 'application/json',
            'Content-Type' => 'application/json'
        ]);

        $grade = [
            'grade' => 5,
        ];

        $this->putJson('/api/decks/2/grade', $grade, [
            'Accept' => 'application/json',
            'Content-Type' => 'application/json'
        ]);

        $grade = [
            'grade' => 1.2
        ];

        $userDeckBefore = UserDeck::where('user_id', self::$user->id)->where('deck_id', 2)->first();
        $response = $this->putJson('/api/decks/2/grade', $grade, [
            'Accept' => 'application/json',
            'Content-Type' => 'application/json'
        ]);

        $response->assertStatus(204);
        $userDeck = UserDeck::where('user_id', self::$user->id)->where('deck_id', 2)->first();

        $this->assertDatabaseHas('user_decks', [
            'user_id' => self::$user->id,
            'deck_id' => 2,
            'easiness_factor' => $userDeckBefore->easiness_factor + (0.1 - (5 - 1.2) * (0.08 + (5 - 1.2) * 0.02)),
            'repetition' => 0,
            'interval' => 1,
            'user_grade' => 1.2,
            'prev_user_grade' => 5,
            'is_liked' => false,
        ]);

        $this->assertTrue(
            $userDeck->date->between(now()->subSeconds(2), now()->addSeconds(2)),
            'The date is not within the expected range'
        );
    }

    public function test_grade_deck_by_id_unauthorized(): void
    {
        $grade = [
            'grade' => 3.2
        ];

        $response = $this->putJson('/api/decks/2/grade', $grade, [
            'Accept' => 'application/json',
            'Content-Type' => 'application/json'
        ]);

        $response->assertStatus(401)->assertJson([
            'message' => 'Unauthenticated.'
        ]);
    }

    public function test_grade_deck_by_id_not_found(): void
    {
        $this->actingAs(self::$user);

        $grade = [
            'grade' => 3.2
        ];

        $response = $this->putJson('/api/decks/1000/grade', $grade, [
            'Accept' => 'application/json',
            'Content-Type' => 'application/json'
        ]);

        $response->assertStatus(404)->assertJson([
            'message' => 'Deck not found'
        ]);
    }
}