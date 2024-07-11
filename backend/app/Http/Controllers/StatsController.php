<?php

namespace App\Http\Controllers;

use Illuminate\Routing\Controller;

class StatsController extends Controller
{
    public function updateStatsUser(float $userGrade, int $repetition, float $easiness, int $interval)
    {
        if ($userGrade >= 3) {
            if ($repetition == 0) {
                $interval = 1;
            } else if ($repetition == 1) {
                $interval = 6;
            } else {
                round($interval * $easiness);
            }

            $repetition++;
        } else {
            $repetition = 0;
            $interval = 1;
        }

        $easiness = $easiness + (0.1 - (5 - $userGrade) * (0.08 + (5 - $userGrade) * 0.02));
        if ($easiness < 1.3) {
            $easiness = 1.3;
        }

        if ($easiness > 3.9) {
            $easiness = 3.9;
        }

        return [$repetition, $easiness, $interval];
    }
}