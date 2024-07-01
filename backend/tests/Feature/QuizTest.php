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
                            "response" => "A",
                            "isValid" => true
                        ],
                        [
                            "response" => "B",
                            "isValid" => true
                        ],
                        [
                            "response" => "C",
                            "isValid" => false
                        ],
                        [
                            "response" => "D",
                            "isValid" => false
                        ]
                    ]
                ],
                [
                    'question' => 'question 2',
                    'answers' => [
                        [
                            "response" => "1",
                            "isValid" => true
                        ],
                        [
                            "response" => "2",
                            "isValid" => true
                        ],
                        [
                            "response" => "3",
                            "isValid" => false
                        ],
                        [
                            "response" => "4",
                            "isValid" => false
                        ]
                    ]
                ]
            ]
        ];

        $response = $this->post('/quizzes', $quizData);

        $response->assertStatus(201);
        $this->assertDatabaseHas('quizzes', ['name' => 'quiz 1']);
    }
}
