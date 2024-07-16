<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\TestCase;
use Illuminate\Testing\Fluent\AssertableJson;
use App\Models\User;
use App\Models\Quiz;
use App\Models\Tag;


class QuizTest extends TestCase
{   

    private $user;
    private $tag;
    private $quizData;
    private $updatedQuizData;

    protected function setUp(): void
    {

        parent::setUp();

        // INIT USER
        $this->user = User::factory()->create();
        // INIT TAG
        $this->tag = Tag::factory()->create();


        // PUBLIC QUIZ
        $this->quizData = [
            "name" => 'quiz 1',
            'is_public' => true,
            'is_organization' => false,
            'tag_id' => $this->tag->id,
            'user_id' => $this->user->id,
            'qcms' => [
                [
                    'question' => 'question 1',
                    'answers' => [
                        ["answer" => "A", "isValid" => true],
                        ["answer" => "B", "isValid" => true],
                        ["answer" => "C", "isValid" => false],
                        ["answer" => "D", "isValid" => false]
                    ]
                ],
                [
                    'question' => 'question 2',
                    'answers' => [
                        ["answer" => "1", "isValid" => true],
                        ["answer" => "2", "isValid" => true],
                        ["answer" => "3", "isValid" => false],
                        ["answer" => "4", "isValid" => false]
                    ]
                ]
            ]
        ];

        // UPDATED QUIZ DATA
        $this->updatedQuizData = [
            'name' => 'Quiz updated',
            'is_public' => false,
            'is_organization' => true,
            'qcms' => [
                [
                    'question' => 'Question updated',
                    'answers' => [
                        ['answer' => 'Answer 1 updated', 'isValid' => true],
                        ['answer' => 'Answer 2 updated', 'isValid' => false],
                        ['answer' => 'Answer 3 updated', 'isValid' => false],
                        ['answer' => 'Answer 4 updated', 'isValid' => true]
                    ]
                ]
            ]
        ];
    }


    // CREATE QUIZ

    public function test_create_quiz(): void
    {
        $this->actingAs($this->user);
        $response = $this->postJson('/api/quizzes', $this->quizData);

        $response->assertStatus(201);
        $this->assertDatabaseHas('quizzes', ['name' => 'quiz 1']);


        $quizId = $response->json('id');
        $qcms = $this->quizData["qcms"];

        foreach ($qcms as $qcm) {

            $dbQcm = \App\Models\Qcm::where('question', $qcm['question'])->where('quiz_id', $quizId)->first();
            $this->assertNotNull($dbQcm);
            $this->assertEquals($qcm['question'], $dbQcm->question);
            $this->assertEquals($qcm['answers'], $dbQcm->answers);
        }
    }

    public function test_create_quiz_unauthorized(): void
    {

        $response = $this->postJson('/api/quizzes', $this->quizData);

        $response->assertJson(["message" => "Unauthenticated."]);
        $response->assertUnauthorized();
        $response->assertStatus(401);
    }


    // UPDATE QUIZ

    public function test_update_quiz(): void
    {
        $this->actingAs($this->user);

        $quiz = Quiz::factory()->hasQcms(2)->create([
            "name" => 'Quiz Test',
            'is_public' => true,
            'is_organization' => false,
            'user_id' => $this->user->id
        ]);

        $response = $this->putJson('/api/quizzes/' . $quiz->id, $this->updatedQuizData);

        $response->assertStatus(200);
        $this->assertDatabaseHas('quizzes', ['name' => 'Quiz updated']);
    }

    public function test_update_quiz_unauthorized(): void
    {

        $quiz = Quiz::factory()->hasQcms(2)->create([
            "name" => 'Quiz Test',
            'is_public' => true,
            'is_organization' => false,
            'user_id' => $this->user->id
        ]);

        $response = $this->putJson('/api/quizzes/' . $quiz->id, $this->updatedQuizData);

        $response->assertStatus(401);
        $response->assertUnauthorized();
        $response->assertJson([
            'message' => 'Unauthenticated.'
        ]);
    }

    public function test_update_quiz_forbidden(): void
    {

        $user = User::factory()->create();
        $this->actingAs($user);

        $quiz = Quiz::factory()->hasQcms(2)->create([
            "name" => 'Quiz Test',
            'is_public' => true,
            'is_organization' => false,
            'user_id' => $this->user->id
        ]);

        $response = $this->putJson('/api/quizzes/' . $quiz->id, $this->updatedQuizData);

        $response->assertStatus(403);
        $response->assertJson([
            'message' => 'Forbidden'
        ]);
    }


    // DELETE QUIZ


    public function test_delete_quiz(): void
    {
        $this->actingAs($this->user);

        $quiz = Quiz::factory()->hasQcms(2)->create([
            "name" => 'Quiz DELTED IT WILL BE',
            'is_public' => true,
            'is_organization' => false,
            'user_id' => $this->user->id
        ]);
        
        
        $response = $this->deleteJson('/api/quizzes/' . $quiz->id);
    
        $response->assertStatus(204);
        $this->assertDatabaseMissing('quizzes', [
            'name' => 'Quiz Test',
            'id' => $quiz->id,
        ]);
        
    }

    public function test_delete_quiz_unauthorized(): void
    {

        $quiz = Quiz::factory()->hasQcms(2)->create([
            "name" => 'Quiz DELETE UNAUTH',
            'is_public' => true,
            'is_organization' => false,
            'user_id' => $this->user->id
        ]);
        
        
        $response = $this->deleteJson('/api/quizzes/' . $quiz->id);
    
        $response->assertStatus(401);
        $response->assertUnauthorized();
        $response->assertJson([
            'message' => 'Unauthenticated.'
        ]);
        
    }

    public function test_delete_quiz_forbidden(): void
    {

        $user = User::factory()->create();
        $this->actingAs($user);

        $quiz = Quiz::factory()->hasQcms(2)->create([
            "name" => 'Quiz Test',
            'is_public' => true,
            'is_organization' => false,
            'user_id' => $this->user->id
        ]);

        $response = $this->deleteJson('/api/quizzes/' . $quiz->id);

        $response->assertStatus(403);
        $response->assertJson([
            'message' => 'Forbidden'
        ]);
    }


    // GET QUIZ

    public function test_get_public_quiz_by_id(): void
    {

        $this->actingAs($this->user);

        $quiz = Quiz::factory()->hasQcms(2)->create([
            "name" => 'Quiz Test',
            'is_public' => true,
            'is_organization' => false,
            'user_id' => $this->user->id
        ]);

        $response = $this->getJson('/api/quizzes/' . $quiz->id);
        $response->assertStatus(200);
        $this->assertNotNull($response->json());
    }

    public function test_get_private_quiz_by_id(): void
    {

        $this->actingAs($this->user);

        $quiz = Quiz::factory()->hasQcms(2)->create([
            "name" => 'Quiz Test',
            'is_public' => false,
            'is_organization' => false,
            'user_id' => $this->user->id
        ]);

        $response = $this->getJson('/api/quizzes/' . $quiz->id);
        $response->assertStatus(200);
        $this->assertNotNull($response->json());
    }

    public function test_get_private_quiz_by_id_forbidden(): void
    {   
        $user = User::factory()->create();
        $this->actingAs($user);

        $quiz = Quiz::factory()->hasQcms(2)->create([
            "name" => 'Quiz Test',
            'is_public' => false,
            'is_organization' => false,
            'user_id' => $this->user->id
        ]);

        $response = $this->getJson('/api/quizzes/' . $quiz->id);
        $response->assertStatus(403)->assertJson(['message' => 'Forbidden']);
    }

    public function test_get_public_quiz_by_id_unauthenticated(): void
    {

        $quiz = Quiz::factory()->hasQcms(2)->create([
            "name" => 'Quiz Test',
            'is_public' => true,
            'is_organization' => false,
            'user_id' => $this->user->id
        ]);

        $response = $this->getJson('/api/quizzes/' . $quiz->id);
        $response->assertStatus(200);
        $this->assertNotNull($response->json());
    }

    public function test_get_private_quiz_by_id_unauthenticated(): void
    {

        $quiz = Quiz::factory()->hasQcms(2)->create([
            "name" => 'Quiz Test',
            'is_public' => false,
            'is_organization' => false,
            'user_id' => $this->user->id
        ]);

        $response = $this->getJson('/api/quizzes/' . $quiz->id);
        $response->assertStatus(401)->assertJson(["message" => "Unauthorized"]);
    }


    public function test_get_my_quizzes(): void
    {
        $this->actingAs($this->user);
        $response = $this->getJson('/api/quizzes?myQuizzes');


        $response->assertStatus(200);
        $this->assertNotNull($response->json());
    }

    public function test_get_my_quizzes_unauthorized(): void
    {

        $response = $this->getJson('/api/quizzes?myQuizzes');
        
        $response->assertJson(["message" => "Unauthorized"]);
        $response->assertUnauthorized();
        $response->assertStatus(401);
    }
    
    public function test_get_all_public_quizzes(): void
    {
        $response = $this->getJson('/api/quizzes');
        $response->assertStatus(200);
        $this->assertNotNull($response->json());

        $quizzes = $response->json();

        foreach ($quizzes["quizzes"] as $quiz) {
            $this->assertEquals($quiz['is_public'], true);
        }

    }

}
