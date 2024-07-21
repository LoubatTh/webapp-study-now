<?php

namespace App\Http\Controllers;

use Illuminate\Routing\Controller;
use Illuminate\Support\Exceptions\MathException;

class StatsController extends Controller
{
    /**
     * Algorithm: https://en.wikipedia.org/wiki/SuperMemo#Algorithms
     */
    public function sm2(int $grade, int $maxGrade = 5, int $repetition = 0, float $easiness = 2.5, int $interval = 1)
    {
        throw_if($grade > $maxGrade, new MathException("grade should be smaller or equals to max_grade"));
        $percentGrade = $grade / $maxGrade * 100;

        if ($percentGrade >= 60) {
            switch ($repetition) {
                case 0:
                    $interval = 1;
                    break;
                case 1:
                    $interval = 6;
                    break;
                default:
                    round($interval * $easiness);
                    break;
            }

            $repetition++;
        } else {
            $repetition = 0;
            $interval = 1;
        }

        $easiness += 0.1 - ((100 - $percentGrade) / 20) * (0.08 + ((100 - $percentGrade) / 20) * 0.02);
        if ($easiness < 1.3) {
            $easiness = 1.3;
        }

        if ($easiness > 3.9) {
            $easiness = 3.9;
        }

        return [$repetition, $easiness, $interval];
    }
}