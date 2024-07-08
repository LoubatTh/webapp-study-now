<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\TestCase;
use App\Models\User;
use App\Models\Quiz;


class QuizTest extends TestCase
{   

    public function test_creates_quiz(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $quizData = [
            "name" => 'quiz 1',
            'isPublic' => true,
            'isOrganization' => false,
            'owner' => $user->id,
            'qcms' => [
                [
                    'question' => 'question 1',
                    'answers' => [
                        [
                            "answer" => "A",
                            "isValid" => true
                        ],
                        [
                            "answer" => "B",
                            "isValid" => true
                        ],
                        [
                            "answer" => "C",
                            "isValid" => false
                        ],
                        [
                            "answer" => "D",
                            "isValid" => false
                        ]
                    ]
                ],
                [
                    'question' => 'question 2',
                    'answers' => [
                        [
                            "answer" => "1",
                            "isValid" => true
                        ],
                        [
                            "answer" => "2",
                            "isValid" => true
                        ],
                        [
                            "answer" => "3",
                            "isValid" => false
                        ],
                        [
                            "answer" => "4",
                            "isValid" => false
                        ]
                    ]
                ]
            ]
        ];

        $quizDetails = [
            "name" => 'quiz 1',
            'isPublic' => true,
            'isOrganization' => false
        ];

        $response = $this->post('/api/quizzes', $quizData);

        $response->assertStatus(201)->assertJson($quizDetails);
        $this->assertDatabaseHas('quizzes', ['name' => 'quiz 1']);


        $quizId = $response->json('id');
        $qcms = $quizData["qcms"];

        foreach ($qcms as $qcm) {

            $dbQcm = \App\Models\Qcm::where('question', $qcm['question'])->where('quiz_id', $quizId)->first();
            $this->assertNotNull($dbQcm);
            $this->assertEquals($qcm['question'], $dbQcm->question);
            $this->assertEquals($qcm['answers'], $dbQcm->answers);
        }
    }

    public function test_updates_quiz(): void
    {

        $user = User::factory()->create();
        $this->actingAs($user);

        $quiz = Quiz::factory()->hasQcms(2)->create([
            "name" => 'Quiz Test',
            'isPublic' => true,
            'isOrganization' => false,
            'owner' => $user->id
        ]);


        $quizData = [
            'name' => 'Quiz updated',
            'isPublic' => false,
            'isOrganization' => true,
            'qcms' => [
                [
                    'question' => 'Question updated',
                    'answers' => [
                        [
                            'answer' => 'Answer 1 updated',
                            'isValid' => true
                        ],
                        [
                            'answer' => 'Answer 2 updated',
                            'isValid' => false
                        ],
                        [
                            'answer' => 'Answer 3 updated',
                            'isValid' => false
                        ],
                        [
                            'answer' => 'Answer 4 updated',
                            'isValid' => true
                        ]
                    ]
                ]
            ]
        ];

        $response = $this->put('/api/quizzes/' . $quiz->id, $quizData);
        $response->assertStatus(200)->assertJson($quizData);
        $this->assertDatabaseHas('quizzes', ['name' => 'Quiz updated']);
    }

    public function test_deletes_quiz(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $quiz = Quiz::factory()->hasQcms(2)->create([
            "name" => 'Quiz Test',
            'isPublic' => true,
            'isOrganization' => false,
            'owner' => $user->id
        ]);

        $response = $this->delete('/api/quizzes/' . $quiz->id);
        $response->assertStatus(204);
    }

    public function test_gets_my_quizzes(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        // $quiz = Quiz::factory()->hasQcms(2)->create([
        //     "name" => 'Quiz Test',
        //     'isPublic' => true,
        //     'isOrganization' => false,
        //     'owner' => $user->id
        // ]);

        $response = $this->get('/api/quizzes', [
            'Accept' => 'application/json',
            'Content-Type' => 'application/json'
        ]);
        $response->assertStatus(200);
        
        $this->assertNotNull($response->json());
    }
}
