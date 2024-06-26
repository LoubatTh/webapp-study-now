<?php

namespace Tests\Feature;

use App\Enums\TokenAbility;
use App\Models\Deck;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Testing\Fluent\AssertableJson;
use Tests\TestCase;

class DeckTest extends TestCase
{
    private $deck;
    private $flashcards;
    private $user;
    private $token;
    private $refreshToken;

    protected function setUp(): void
    {
        parent::setUp();
        $this->deck = Deck::factory()->hasFlashcards(10)->create(
            [
                'id' => 1,
                'name' => 'Test',
                'visibility' => 'Public',
                'likes' => 2,
            ]
        );

        $this->user = User::factory()->create();
        $this->accessToken = $this->user->createToken('access_token', [TokenAbility::ACCESS_API->value], Carbon::now()->addMinutes(config('sanctum.ac_expiration')))->plainTextToken;
        $this->refreshToken = $this->user->createToken('refresh_token', [TokenAbility::ISSUE_ACCESS_TOKEN->value], Carbon::now()->addMinutes(config('sanctum.rt_expiration')))->plainTextToken;
    }

    protected function tearDown(): void
    {
        parent::tearDown();
        $this->deck->delete();
        $this->user->delete();
        $this->token = null;
        $this->refreshToken = null;
    }

    public function test_deck_get_by_id(): void
    {
        $response = $this->getJson('/api/decks/1');

        $response->assertStatus(200)->assertJson(
            fn(AssertableJson $json) =>
            $json->hasAll(['id', 'name', 'visibility', 'likes', 'flashcards'])
                ->has(
                    'flashcards',
                    fn($json) =>
                    $json->each(
                        fn($json) =>
                        $json->whereType('question', 'string')
                            ->whereType('answer', 'string')
                    )
                )
        );

        $this->assertTrue($response['name'] == 'Test');
        $this->assertTrue($response['visibility'] == 'Public');
        $this->assertTrue($response['likes'] == 2);
        $this->assertTrue(count($response['flashcards']) == 10);

        foreach ($response['flashcards'] as $flashcard) {
            $this->assertTrue($flashcard['question'] != null);
            $this->assertTrue($flashcard['answer'] != null);
        }
    }

    public function test_deck_can_be_created(): void
    {
        $this->actingAs($this->user);

        $deckData = [
            'name' => 'Test2',
            'visibility' => 'Private',
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
            'visibility' => $deckData['visibility']
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

    // public function test_user_register_validation_fails(): void
    // {
    //     // Sending register request whith missing name, already taken email and password length < 8
    //     $response = $this->postJson(
    //         '/api/register',
    //         [
    //             'email' => 'authTest@test.com',
    //             'password' => 'auth'
    //         ],
    //         [
    //             'Accept' => 'application/json',
    //             'Content-Type' => 'application/json'
    //         ],
    //     );

    //     $response->assertStatus(400)->assertJson(
    //         fn(AssertableJson $json) =>
    //         $json->hasAll(['name', 'email', 'password'])
    //     );
    // }

    // public function test_user_can_be_logged_in(): void
    // {
    //     $response = $this->postJson(
    //         '/api/login',
    //         [
    //             'email' => 'authTest@test.com',
    //             'password' => 'authTest'
    //         ],
    //         [
    //             'Accept' => 'application/json',
    //             'Content-Type' => 'application/json'
    //         ],
    //     );

    //     $response->assertStatus(200)->assertJson(
    //         fn(AssertableJson $json) =>
    //         $json->hasAll(['accessToken', 'accessTokenExpiration', 'refreshToken', 'refreshTokenExpiration'])
    //     );

    //     $token = $response['accessToken'];
    //     $deleteResponse = $this->deleteJson(
    //         '/api/user',
    //         [],
    //         [
    //             'Accept' => 'application/json',
    //             'Content-Type' => 'application/json',
    //             'Authorization' => 'Bearer ' . $token
    //         ],
    //     );

    //     $deleteResponse->assertStatus(200);
    // }

    // public function test_user_refresh_token(): void
    // {
    //     $this->actingAs($this->user);

    //     $response = $this->getJson(
    //         '/api/refresh',
    //         [
    //             'Accept' => 'application/json',
    //             'Content-Type' => 'application/json',
    //             'Authorization' => 'Bearer ' . $this->refreshToken
    //         ],
    //     );

    //     $response->assertStatus(200)->assertJson(
    //         fn(AssertableJson $json) =>
    //         $json->hasAll(['accessToken', 'accessTokenExpiration'])
    //     );
    // }

    // public function test_user_logout(): void
    // {
    //     $this->actingAs($this->user);

    //     $response = $this->postJson(
    //         '/api/logout',
    //         [],
    //         [
    //             'Accept' => 'application/json',
    //             'Content-Type' => 'application/json',
    //             'Authorization' => 'Bearer ' . $this->token
    //         ]
    //     );

    //     $response->assertStatus(200)->assertJson(
    //         fn(AssertableJson $json) =>
    //         $json->hasAll(['message'])
    //     );
    // }
}

