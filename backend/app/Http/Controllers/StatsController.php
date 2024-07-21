<?php

namespace App\Http\Controllers;

use Illuminate\Routing\Controller;

class StatsController extends Controller
{
    /**
     * Algorithm: https://en.wikipedia.org/wiki/SuperMemo#Algorithms
     */
    public function sm2(int $grade, int $repetition = 0, float $easiness = 2.5, int $interval = 1)
    {
        if ($grade >= 3) {
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

        $easiness += 0.1 - (5 - $grade) * (0.08 + (5 - $grade) * 0.02);
        if ($easiness < 1.3) {
            $easiness = 1.3;
        }

        if ($easiness > 3.9) {
            $easiness = 3.9;
        }

        return [$repetition, $easiness, $interval];
    }
}