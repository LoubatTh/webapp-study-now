<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
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
        $this->actingAs($this->user);

        $this->tag = Tag::factory()->create();

        // INIT PUBLIC QUIZ
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
    }


    // User is authenticated

    public function test_creates_quiz(): void
    {
        // $user = User::factory()->create();
        // $this->actingAs($user);

        // $tag = Tag::factory()->create();

        $quizDetails = [
            "name" => 'quiz 1',
            'is_public' => true,
            'is_organization' => false
        ];

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

    public function test_deletes_quiz(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $quiz = Quiz::factory()->hasQcms(2)->create([
            "name" => 'Quiz Test',
            'is_public' => true,
            'is_organization' => false,
            'user_id' => $user->id
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




    // public function test_updates_quiz(): void
    // {

    //     $user = User::factory()->create();
    //     $this->actingAs($user);

    //     $quiztest = Quiz::factory()->hasQcms(2)->create([
    //         "name" => 'Quiz Test',
    //         'is_public' => true,
    //         'is_organization' => false,
    //         'user_id' => $user->id
    //     ]);


    //     $quizData = [
    //         'name' => 'Quiz updated',
    //         'is_public' => false,
    //         'is_organization' => true,
    //         'qcms' => [
    //             [
    //                 'question' => 'Question updated',
    //                 'answers' => [
    //                     [
    //                         'answer' => 'Answer 1 updated',
    //                         'isValid' => true
    //                     ],
    //                     [
    //                         'answer' => 'Answer 2 updated',
    //                         'isValid' => false
    //                     ],
    //                     [
    //                         'answer' => 'Answer 3 updated',
    //                         'isValid' => false
    //                     ],
    //                     [
    //                         'answer' => 'Answer 4 updated',
    //                         'isValid' => true
    //                     ]
    //                 ]
    //             ]
    //         ]
    //     ];

    //     $response = $this->put('/api/quizzes/' . $quiztest->id, $quizData);
    //     // $response->assertStatus(200);
    //     $this->assertDatabaseHas('quizzes', ['name' => 'Quiz updated']);
    // }
}
