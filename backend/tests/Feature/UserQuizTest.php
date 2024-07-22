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
                'likes' => 2,
                'user_id' => self::$user->id,
            ]
        );

        $this->privateQuiz = Quiz::factory()->create(
            [
                'id' => 2,
                'name' => 'TestPrivate',
                'is_public' => false,
                'likes' => 20,
                'user_id' => self::$userPrivate->id,
            ]
        );

        $this->userQuiz = UserQuiz::factory()->create(
            [
                'user_id' => self::$user->id,
                'quiz_id' => $this->quiz->id,
                'next_repetition' => 10,
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

        $likeData = [
            "isLiked" => false,
        ];

        $userQuizBefore = UserQuiz::where('user_id', self::$user->id)->where('quiz_id', 1)->first();
        $response = $this->putJson('/api/quizzes/1/like', $likeData, [
            'Accept' => 'application/json',
            'Content-Type' => 'application/json'
        ]);

        $response->assertStatus(204);
        $userQuizAfter = UserQuiz::where('user_id', self::$user->id)->where('quiz_id', 1)->first();

        $this->assertEquals($userQuizAfter->user_id, self::$user->id);
        $this->assertEquals($userQuizAfter->quiz_id, 1);
        $this->assertEquals($userQuizAfter->next_repetition, $userQuizBefore->next_repetition);

        $this->assertTrue($userQuizBefore->is_liked);
        $this->assertFalse($userQuizAfter->is_liked);
    }

    public function test_like_quiz_first_time_by_id(): void
    {
        $this->actingAs(self::$user);

        $likeData = [
            "isLiked" => true,
        ];

        $userQuizBefore = UserQuiz::where('user_id', self::$user->id)->where('quiz_id', 2)->first();
        $response = $this->putJson('/api/quizzes/2/like', $likeData, [
            'Accept' => 'application/json',
            'Content-Type' => 'application/json'
        ]);

        $response->assertStatus(204);
        $userQuizAfter = UserQuiz::where('user_id', self::$user->id)->where('quiz_id', 2)->first();

        $this->assertEquals($userQuizAfter->user_id, self::$user->id);
        $this->assertEquals($userQuizAfter->quiz_id, 2);
        $this->assertEquals($userQuizAfter->next_repetition, 0);

        $this->assertEquals($userQuizBefore, null);
        $this->assertTrue($userQuizAfter->is_liked);
    }

    public function test_like_quiz_by_id_unauthorized(): void
    {
        $likeData = [
            "isLiked" => true,
        ];

        $response = $this->putJson('/api/quizzes/1/like', $likeData, [
            'Accept' => 'application/json',
            'Content-Type' => 'application/json'
        ]);

        $response->assertStatus(401)->assertJson([
            'message' => 'Unauthenticated.'
        ]);
    }

    public function test_like_quiz_by_id_not_found(): void
    {
        $this->actingAs(self::$user);

        $likeData = [
            "isLiked" => true,
        ];

        $response = $this->putJson('/api/quizzes/1000/like', $likeData, [
            'Accept' => 'application/json',
            'Content-Type' => 'application/json'
        ]);

        $response->assertStatus(404)->assertJson([
            'message' => 'Quiz not found'
        ]);
    }

    public function test_store_quiz_results(): void
    {
        $this->actingAs(self::$user);

        $gradeData = [
            'quiz_id' => 2,
            'grade' => 3,
            'max_grade' => $this->privateQuiz->qcms()->count()
        ];


        $response = $this->postJson('/api/quizzes/results', $gradeData);

        $response->assertStatus(201);
        $userQuiz = UserQuiz::where('user_id', self::$user->id)->where('quiz_id', 2)->first();

        $this->assertDatabaseHas('user_quizzes', [
            'user_id' => self::$user->id,
            'quiz_id' => 2,
            'is_liked' => false,
        ]);

        $this->assertDatabaseHas('user_quiz_results', [
            'user_quiz_id' => $userQuiz->id,
            'grade' => 3,
            'max_grade' => $this->privateQuiz->qcms()->count()
        ]);
    }

    public function test_store_quiz_results_repetition(): void
    {
        $this->actingAs(self::$user);

        $gradeData = [
            'quiz_id' => 2,
            'grade' => 1,
            'max_grade' => $this->privateQuiz->qcms()->count()
        ];

        $this->postJson('/api/quizzes/results', $gradeData);

        $grade = [
            'quiz_id' => 2,
            'grade' => 5,
            'max_grade' => $this->privateQuiz->qcms()->count()
        ];

        $response = $this->postJson('/api/quizzes/results', $grade);

      
        $response->assertStatus(201);
        $userQuiz = UserQuiz::where('user_id', self::$user->id)->where('quiz_id', 2)->first();

        $this->assertDatabaseHas('user_quizzes', [
            'user_id' => self::$user->id,
            'quiz_id' => 2,
            'is_liked' => false,
        ]);

        $this->assertDatabaseHas('user_quiz_results', [
            'user_quiz_id' => $userQuiz->id,
            'grade' => 1,
            'max_grade' => $this->privateQuiz->qcms()->count()
        ]);

        $this->assertDatabaseHas('user_quiz_results', [
            'user_quiz_id' => $userQuiz->id,
            'grade' => 5,
            'max_grade' => $this->privateQuiz->qcms()->count()
        ]);
    }

    // public function test_grade_quiz_badly_by_id(): void
    // {
    //     $this->actingAs(self::$user);

    //     $grade = [
    //         'grade' => 3.2,
    //     ];

    //     $this->putJson('/api/quizzes/2/grade', $grade, [
    //         'Accept' => 'application/json',
    //         'Content-Type' => 'application/json'
    //     ]);

    //     $grade = [
    //         'grade' => 5,
    //     ];

    //     $this->putJson('/api/quizzes/2/grade', $grade, [
    //         'Accept' => 'application/json',
    //         'Content-Type' => 'application/json'
    //     ]);

    //     $grade = [
    //         'grade' => 1.2
    //     ];

    //     $userQuizBefore = UserQuiz::where('user_id', self::$user->id)->where('quiz_id', 2)->first();
    //     $response = $this->putJson('/api/quizzes/2/grade', $grade, [
    //         'Accept' => 'application/json',
    //         'Content-Type' => 'application/json'
    //     ]);

    //     $response->assertStatus(204);
    //     $userQuiz = UserQuiz::where('user_id', self::$user->id)->where('quiz_id', 2)->first();

    //     $this->assertDatabaseHas('user_quizzes', [
    //         'user_id' => self::$user->id,
    //         'quiz_id' => 2,
    //         'next_repetition' => 0,
    //         'is_liked' => false,
    //     ]);

    //     $this->assertTrue(
    //         $userQuiz->date->between(now()->subSeconds(2), now()->addSeconds(2)),
    //         'The date is not within the expected range'
    //     );
    // }

    public function test_store_quiz_results_unauthorized(): void
    {
        $gradeData = [
            'quiz_id' => 2,
            'grade' => 2,
            'max_grade' => $this->privateQuiz->qcms()->count()
        ];

        $response = $this->postJson('/api/quizzes/results', $gradeData);

        $response->assertStatus(401)->assertJson([
            'message' => 'Unauthenticated.'
        ]);
    }

    public function test_store_quiz_results_quiz_not_found(): void
    {
        $this->actingAs(self::$user);

        $gradeData = [
            'quiz_id' => 1000,
            'grade' => 2,
            'max_grade' => $this->privateQuiz->qcms()->count()
        ];

        $response = $this->postJson('/api/quizzes/results', $gradeData);

        $response->assertStatus(404)->assertJson([
            'error' => 'Quiz not found'
        ]);
    }
}