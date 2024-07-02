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

        $qcms = $quizData["qcms"];

        foreach ($qcms as $qcm) {
            $this->assertDatabaseHas('qcms', [
                'question' => $qcm['question'], 
                'answers' => $qcm['answers']
            ]);
        }
    }
}
