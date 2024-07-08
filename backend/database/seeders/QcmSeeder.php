<?php

namespace Database\Seeders;

use App\Models\Qcm;
use Illuminate\Database\Seeder;

class QcmSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Quizz Maths

        $questions = [
            [
                "question" => "Quelle est la valeur de sin(30°) ?",
                "answers" => [
                    ["answer" => "1/2", "isValid" => true],
                    ["answer" => "√3/2", "isValid" => false],
                    ["answer" => "0", "isValid" => false],
                    ["answer" => "1", "isValid" => false]
                ]
            ],
            [
                "question" => "Quelle est la valeur de cos(60°) ?",
                "answers" => [
                    ["answer" => "√3/2", "isValid" => false],
                    ["answer" => "0", "isValid" => false],
                    ["answer" => "1", "isValid" => false],
                    ["answer" => "1/2", "isValid" => true]
                ]
            ],
            [
                "question" => "Quelle est la valeur de tan(45°) ?",
                "answers" => [
                    ["answer" => "1", "isValid" => true],
                    ["answer" => "√3", "isValid" => false],
                    ["answer" => "0", "isValid" => false],
                    ["answer" => "1/√3", "isValid" => false]
                ]
            ],
            [
                "question" => "Quelle est la valeur de cot(45°) ?",
                "answers" => [
                    ["answer" => "1", "isValid" => true],
                    ["answer" => "√3", "isValid" => false],
                    ["answer" => "0", "isValid" => false],
                    ["answer" => "1/√3", "isValid" => false]
                ]
            ],
            [
                "question" => "Quelle est la valeur de sin(90°) ?",
                "answers" => [
                    ["answer" => "0", "isValid" => false],
                    ["answer" => "√2/2", "isValid" => false],
                    ["answer" => "1", "isValid" => true],
                    ["answer" => "1/2", "isValid" => false]
                ]
            ],
            [
                "question" => "Quelle est la valeur de cos(0°) ?",
                "answers" => [
                    ["answer" => "0", "isValid" => false],
                    ["answer" => "√2/2", "isValid" => false],
                    ["answer" => "1", "isValid" => true],
                    ["answer" => "1/2", "isValid" => false]
                ]
            ],
            [
                "question" => "Quelle est la valeur de tan(0°) ?",
                "answers" => [
                    ["answer" => "1", "isValid" => false],
                    ["answer" => "0", "isValid" => true],
                    ["answer" => "√3", "isValid" => false],
                    ["answer" => "1/√3", "isValid" => false]
                ]
            ],
            [
                "question" => "Quelle est la valeur de cot(0°) ?",
                "answers" => [
                    ["answer" => "0", "isValid" => false],
                    ["answer" => "1", "isValid" => false],
                    ["answer" => "Non définie", "isValid" => true],
                    ["answer" => "∞", "isValid" => false]
                ]
            ],
            [
                "question" => "Quelle est la valeur de sec(60°) ?",
                "answers" => [
                    ["answer" => "2/√3", "isValid" => true],
                    ["answer" => "1/2", "isValid" => false],
                    ["answer" => "2", "isValid" => false],
                    ["answer" => "√3", "isValid" => false]
                ]
            ],
            [
                "question" => "Quelle est la valeur de csc(30°) ?",
                "answers" => [
                    ["answer" => "1/2", "isValid" => false],
                    ["answer" => "√3", "isValid" => false],
                    ["answer" => "2", "isValid" => true],
                    ["answer" => "2/√3", "isValid" => false]
                ]
            ]
        ];

        // Quizz Histoire

        foreach ($questions as $question) {
            Qcm::factory()->create([
                "quiz_id" => 3,
                "question" => $question["question"],
                "answers" => $question["answers"]
            ]);
        }

        $questions = [
            [
                "question" => "En quelle année la Révolution française a-t-elle commencé ?",
                "answers" => [
                    ["answer" => "1776", "isValid" => false],
                    ["answer" => "1789", "isValid" => true],
                    ["answer" => "1804", "isValid" => false],
                    ["answer" => "1799", "isValid" => false]
                ]
            ],
            [
                "question" => "Qui était le premier président des États-Unis ?",
                "answers" => [
                    ["answer" => "Thomas Jefferson", "isValid" => false],
                    ["answer" => "John Adams", "isValid" => false],
                    ["answer" => "James Madison", "isValid" => false],
                    ["answer" => "George Washington", "isValid" => true]
                ]
            ],
            [
                "question" => "Quelle civilisation a construit les pyramides de Gizeh ?",
                "answers" => [
                    ["answer" => "Les Égyptiens", "isValid" => true],
                    ["answer" => "Les Romains", "isValid" => false],
                    ["answer" => "Les Mayas", "isValid" => false],
                    ["answer" => "Les Grecs", "isValid" => false]
                ]
            ],
            [
                "question" => "Quel événement a déclenché la Seconde Guerre mondiale ?",
                "answers" => [
                    ["answer" => "L'attaque de Pearl Harbor", "isValid" => false],
                    ["answer" => "La bataille de Stalingrad", "isValid" => false],
                    ["answer" => "Le bombardement de Hiroshima", "isValid" => false],
                    ["answer" => "L'invasion de la Pologne par l'Allemagne", "isValid" => true]
                ]
            ]
        ];

        foreach ($questions as $question) {
            Qcm::factory()->create([
                "quiz_id" => 4,
                "question" => $question["question"],
                "answers" => $question["answers"]
            ]);
        }

        // Quizz Littérature

        $questions = [
            [
                "question" => "Qui a écrit 'Les Misérables' ?",
                "answers" => [
                    ["answer" => "Victor Hugo", "isValid" => true],
                    ["answer" => "Émile Zola", "isValid" => false],
                    ["answer" => "Gustave Flaubert", "isValid" => false],
                    ["answer" => "Honoré de Balzac", "isValid" => false]
                ]
            ],
            [
                "question" => "Quel est le titre du premier roman de J.K. Rowling ?",
                "answers" => [
                    ["answer" => "Harry Potter et la Chambre des secrets", "isValid" => false],
                    ["answer" => "Harry Potter à l'école des sorciers", "isValid" => true],
                    ["answer" => "Harry Potter et le Prisonnier d'Azkaban", "isValid" => false],
                    ["answer" => "Harry Potter et la Coupe de feu", "isValid" => false]
                ]
            ],
            [
                "question" => "Dans quel roman trouve-t-on le personnage de Jay Gatsby ?",
                "answers" => [
                    ["answer" => "Gatsby le Magnifique", "isValid" => true],
                    ["answer" => "À l'est d'Éden", "isValid" => false],
                    ["answer" => "Les Raisins de la colère", "isValid" => false],
                    ["answer" => "Sur la route", "isValid" => false]
                ]
            ],
            [
                "question" => "Qui a écrit '1984' ?",
                "answers" => [
                    ["answer" => "Aldous Huxley", "isValid" => false],
                    ["answer" => "Ray Bradbury", "isValid" => false],
                    ["answer" => "George Orwell", "isValid" => true],
                    ["answer" => "Philip K. Dick", "isValid" => false]
                ]
            ]
        ];

        foreach ($questions as $question) {
            Qcm::factory()->create([
                "quiz_id" => 5,
                "question" => $question["question"],
                "answers" => $question["answers"]
            ]);
        }

        $questions = [
            [
                "question" => "Quelle est la capitale de l'Australie ?",
                "answers" => [
                    ["answer" => "Sydney", "isValid" => false],
                    ["answer" => "Melbourne", "isValid" => false],
                    ["answer" => "Canberra", "isValid" => true],
                    ["answer" => "Brisbane", "isValid" => false]
                ]
            ],
            [
                "question" => "Quelle est la plus longue rivière du monde ?",
                "answers" => [
                    ["answer" => "L'Amazone", "isValid" => false],
                    ["answer" => "Le Yangtsé", "isValid" => false],
                    ["answer" => "Le Nil", "isValid" => true],
                    ["answer" => "Le Mississippi", "isValid" => false]
                ]
            ],
            [
                "question" => "Quel est le plus grand désert du monde ?",
                "answers" => [
                    ["answer" => "Le désert de Gobi", "isValid" => false],
                    ["answer" => "Le désert du Sahara", "isValid" => true],
                    ["answer" => "Le désert de Kalahari", "isValid" => false],
                    ["answer" => "Le désert d'Atacama", "isValid" => false]
                ]
            ],
            [
                "question" => "Quelle est la montagne la plus haute du monde ?",
                "answers" => [
                    ["answer" => "Le Mont Everest", "isValid" => true],
                    ["answer" => "Le K2", "isValid" => false],
                    ["answer" => "Le Kangchenjunga", "isValid" => false],
                    ["answer" => "Le Lhotse", "isValid" => false]
                ]
            ]
        ];

        foreach ($questions as $question) {
            Qcm::factory()->create([
                "quiz_id" => 6,
                "question" => $question["question"],
                "answers" => $question["answers"]
            ]);
        }
    }
}