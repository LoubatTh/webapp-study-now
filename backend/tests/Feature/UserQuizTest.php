<?php

namespace Tests\Feature;

use App\Models\Quiz;
use App\Models\User;
use App\Models\UserQuiz;
use Illuminate\Foundation\Testing\TestCase;

class UserQuizTest extends TestCase
{
    private $quiz;
    private $privateQuiz;

    private $userQuiz;
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

        $this->quiz = Quiz::factory()->create(
            [
                'id' => 1,
                'name' => 'Test',
                'is_public' => true,
                'is_organization' => false,
                'likes' => 2,
                'owner' => self::$user->id,
            ]
        );

        $this->privateQuiz = Quiz::factory()->create(
            [
                'id' => 2,
                'name' => 'TestPrivate',
                'is_public' => false,
                'is_organization' => false,
                'likes' => 20,
                'owner' => self::$userPrivate->id,
            ]
        );

        $this->userQuiz = UserQuiz::factory()->create(
            [
                'user_id' => self::$user->id,
                'quiz_id' => $this->quiz->id,
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
        $this->quiz->delete();
        $this->privateQuiz->delete();
        parent::tearDown();
    }

    public static function tearDownAfterClass(): void
    {
        self::$user->delete();
        self::$userPrivate->delete();

        parent::tearDownAfterClass();
    }

    public function test_dislike_quiz_by_id(): void
    {
        $this->actingAs(self::$user);

        $userQuizBefore = UserQuiz::where('user_id', self::$user->id)->where('quiz_id', 1)->first();
        $response = $this->putJson('/api/quizzes/1/like');

        $response->assertStatus(204);
        $userQuizAfter = UserQuiz::where('user_id', self::$user->id)->where('quiz_id', 1)->first();

        $this->assertEquals($userQuizAfter->user_id, self::$user->id);
        $this->assertEquals($userQuizAfter->quiz_id, 1);
        $this->assertEquals($userQuizAfter->easiness_factor, $userQuizBefore->easiness_factor);
        $this->assertEquals($userQuizAfter->repetition, $userQuizBefore->repetition);
        $this->assertEquals($userQuizAfter->interval, $userQuizBefore->interval);
        $this->assertEquals($userQuizAfter->date, $userQuizBefore->date);
        $this->assertEquals($userQuizAfter->user_grade, $userQuizBefore->user_grade);
        $this->assertEquals($userQuizAfter->prev_user_grade, $userQuizBefore->prev_user_grade);

        $this->assertTrue($userQuizBefore->is_liked);
        $this->assertFalse($userQuizAfter->is_liked);
    }

    public function test_like_quiz_first_time_by_id(): void
    {
        $this->actingAs(self::$user);

        $userQuizBefore = UserQuiz::where('user_id', self::$user->id)->where('quiz_id', 2)->first();
        $response = $this->putJson('/api/quizzes/2/like');

        $response->assertStatus(204);
        $userQuizAfter = UserQuiz::where('user_id', self::$user->id)->where('quiz_id', 2)->first();

        $this->assertEquals($userQuizAfter->user_id, self::$user->id);
        $this->assertEquals($userQuizAfter->quiz_id, 2);
        $this->assertEquals($userQuizAfter->easiness_factor, 2.5);
        $this->assertEquals($userQuizAfter->repetition, 0);
        $this->assertEquals($userQuizAfter->interval, 0);
        $this->assertEquals($userQuizAfter->user_grade, null);
        $this->assertEquals($userQuizAfter->prev_user_grade, null);

        $this->assertTrue(
            $userQuizAfter->date->between(now()->subSeconds(2), now()->addSeconds(2)),
            'The date is not within the expected range. Expected :' . now() . 'Real: ' . $userQuizAfter->date
        );

        $this->assertEquals($userQuizBefore, null);
        $this->assertTrue($userQuizAfter->is_liked);
    }

    public function test_like_quiz_by_id_unauthorized(): void
    {
        $response = $this->putJson('/api/quizzes/1/like');

        $response->assertStatus(401)->assertJson([
            'message' => 'Unauthenticated.'
        ]);
    }

    public function test_like_quiz_by_id_not_found(): void
    {
        $this->actingAs(self::$user);

        $response = $this->putJson('/api/quizzes/1000/like');

        $response->assertStatus(404)->assertJson([
            'message' => 'Quiz not found'
        ]);
    }

    public function test_grade_quiz_by_id(): void
    {
        $this->actingAs(self::$user);

        $grade = [
            'grade' => 3.2,
        ];

        $response = $this->putJson('/api/quizzes/2/grade', $grade, [
            'Accept' => 'application/json',
            'Content-Type' => 'application/json'
        ]);

        $response->assertStatus(204);
        $userQuiz = UserQuiz::where('user_id', self::$user->id)->where('quiz_id', 2)->first();

        $this->assertDatabaseHas('user_quizzes', [
            'user_id' => self::$user->id,
            'quiz_id' => 2,
            'easiness_factor' => 2.5 + (0.1 - (5 - 3.2) * (0.08 + (5 - 3.2) * 0.02)),
            'repetition' => 1,
            'interval' => 1,
            'user_grade' => 3.2,
            'prev_user_grade' => null,
            'is_liked' => false,
        ]);

        $this->assertTrue(
            $userQuiz->date->between(now()->subSeconds(2), now()->addSeconds(2)),
            'The date is not within the expected range'
        );
    }

    public function test_grade_quiz_repetition_by_id(): void
    {
        $this->actingAs(self::$user);

        $grade = [
            'grade' => 3.2,
        ];

        $this->putJson('/api/quizzes/2/grade', $grade, [
            'Accept' => 'application/json',
            'Content-Type' => 'application/json'
        ]);

        $grade = [
            'grade' => 5,
        ];

        $userQuizBefore = UserQuiz::where('user_id', self::$user->id)->where('quiz_id', 2)->first();
        $response = $this->putJson('/api/quizzes/2/grade', $grade, [
            'Accept' => 'application/json',
            'Content-Type' => 'application/json'
        ]);

        $response->assertStatus(204);
        $userQuiz = UserQuiz::where('user_id', self::$user->id)->where('quiz_id', 2)->first();

        $this->assertDatabaseHas('user_quizzes', [
            'user_id' => self::$user->id,
            'quiz_id' => 2,
            'easiness_factor' => $userQuizBefore->easiness_factor + 0.1,
            'repetition' => 2,
            'interval' => 6,
            'user_grade' => 5,
            'prev_user_grade' => 3.2,
            'is_liked' => false,
        ]);

        $this->assertTrue(
            $userQuiz->date->between(now()->subSeconds(2), now()->addSeconds(2)),
            'The date is not within the expected range'
        );
    }

    public function test_grade_quiz_badly_by_id(): void
    {
        $this->actingAs(self::$user);

        $grade = [
            'grade' => 3.2,
        ];

        $this->putJson('/api/quizzes/2/grade', $grade, [
            'Accept' => 'application/json',
            'Content-Type' => 'application/json'
        ]);

        $grade = [
            'grade' => 5,
        ];

        $this->putJson('/api/quizzes/2/grade', $grade, [
            'Accept' => 'application/json',
            'Content-Type' => 'application/json'
        ]);

        $grade = [
            'grade' => 1.2
        ];

        $userQuizBefore = UserQuiz::where('user_id', self::$user->id)->where('quiz_id', 2)->first();
        $response = $this->putJson('/api/quizzes/2/grade', $grade, [
            'Accept' => 'application/json',
            'Content-Type' => 'application/json'
        ]);

        $response->assertStatus(204);
        $userQuiz = UserQuiz::where('user_id', self::$user->id)->where('quiz_id', 2)->first();

        $this->assertDatabaseHas('user_quizzes', [
            'user_id' => self::$user->id,
            'quiz_id' => 2,
            'easiness_factor' => $userQuizBefore->easiness_factor + (0.1 - (5 - 1.2) * (0.08 + (5 - 1.2) * 0.02)),
            'repetition' => 0,
            'interval' => 1,
            'user_grade' => 1.2,
            'prev_user_grade' => 5,
            'is_liked' => false,
        ]);

        $this->assertTrue(
            $userQuiz->date->between(now()->subSeconds(2), now()->addSeconds(2)),
            'The date is not within the expected range'
        );
    }

    public function test_grade_quiz_by_id_unauthorized(): void
    {
        $grade = [
            'grade' => 3.2
        ];

        $response = $this->putJson('/api/quizzes/2/grade', $grade, [
            'Accept' => 'application/json',
            'Content-Type' => 'application/json'
        ]);

        $response->assertStatus(401)->assertJson([
            'message' => 'Unauthenticated.'
        ]);
    }

    public function test_grade_quiz_by_id_not_found(): void
    {
        $this->actingAs(self::$user);

        $grade = [
            'grade' => 3.2
        ];

        $response = $this->putJson('/api/quizzes/1000/grade', $grade, [
            'Accept' => 'application/json',
            'Content-Type' => 'application/json'
        ]);

        $response->assertStatus(404)->assertJson([
            'message' => 'Quiz not found'
        ]);
    }
}