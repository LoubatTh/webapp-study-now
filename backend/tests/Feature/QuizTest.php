<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\TestCase;
use App\Models\User;
use App\Models\Quiz;
use App\Models\Tag;


class QuizTest extends TestCase
{

    private $user;
    private $quizData;
    private $tag;
    // SET_UP

    protected function setUp(): void
    {

        parent::setUp();

        // INIT USER
        $this->user = User::factory()->create();
        // INIT TAG
        $this->tag = Tag::factory()->create();

        // INIT PUBLIC QUIZ
        $this->quizData = [
            "name" => 'quiz 1',
            'is_public' => true,
            'tag_id' => $this->tag->id,
            'user_id' => $this->user->id,
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


        // INIT PRIVATE QUIZ
        $this->privateQuizData = [
            "name" => 'quiz 1',
            'is_public' => false,
            'tag_id' => $this->tag->id,
            'user_id' => $this->user->id,
            'qcms' => [
                [
                    'question' => 'question 1',
                    'answers' => [
                        [
                            "answer" => "AB",
                            "isValid" => true
                        ],
                        [
                            "answer" => "BC",
                            "isValid" => true
                        ],
                        [
                            "answer" => "CD",
                            "isValid" => false
                        ],
                        [
                            "answer" => "DE",
                            "isValid" => false
                        ]
                    ]
                ]
            ]
        ];
    }


    // AUTHENTICATED USER

    public function test_create_quiz(): void
    {
        $this->actingAs($this->user);
        $response = $this->post('/api/quizzes', $this->quizData);

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

    public function test_get_my_quizzes(): void
    {
        $this->actingAs($this->user);
        $response = $this->get('/api/quizzes?myQuizzes');


        $response->assertStatus(200);
        $this->assertNotNull($response->json());
    }

    public function test_update_quiz(): void
    {
        $this->actingAs($this->user);

        $quiz = Quiz::factory()->hasQcms(2)->create([
            "name" => 'Quiz Test',
            'is_public' => true,
            'user_id' => $this->user->id
        ]);


        $quizData = [
            'name' => 'Quiz updated',
            'is_public' => false,
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

        $response->assertStatus(200);
        $this->assertDatabaseHas('quizzes', ['name' => 'Quiz updated']);
    }

    public function test_delete_quiz(): void
    {
        $this->actingAs($this->user);

        $quiz = Quiz::factory()->hasQcms(2)->create([
            "name" => 'Quiz Test',
            'is_public' => true,
            'user_id' => $this->user->id
        ]);


        $response = $this->delete('/api/quizzes/' . $quiz->id);

        $response->assertStatus(204);
        $this->assertDatabaseMissing('quizzes', [
            'name' => 'Quiz Test',
            'id' => $quiz->id,
        ]);

    }




    // UNAUTHENTICATED USER

    public function test_create_quiz_unauthenticated(): void
    {

        $response = $this->post('/api/quizzes', $this->quizData, [
            'Accept' => 'application/json',
            'Content-Type' => 'application/json'
        ]);

        $response->assertJson(["message" => "Unauthenticated."]);
        $response->assertUnauthorized();
        $response->assertStatus(401);
    }

    public function test_get_my_quizzes_unauthenticated(): void
    {

        $response = $this->get('/api/quizzes?myQuizzes');

        $response->assertJson(["message" => "Unauthorized"]);
        $response->assertUnauthorized();
        $response->assertStatus(401);
    }

    public function test_update_quiz_unauthenticated(): void
    {

        $quiz = Quiz::factory()->hasQcms(2)->create([
            "name" => 'Quiz Test',
            'is_public' => true,
            'user_id' => $this->user->id
        ]);


        $quizData = [
            'name' => 'Quiz updated',
            'is_public' => false,
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

        $response = $this->put('/api/quizzes/' . $quiz->id, $quizData, [
            'Accept' => 'application/json',
            'Content-Type' => 'application/json'
        ]);

        $response->assertStatus(401);
        $response->assertUnauthorized();
        $response->assertJson([
            'message' => 'Unauthenticated.'
        ]);
    }


}