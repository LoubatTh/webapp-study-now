<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class QuizController extends Controller
{
    //


    public function store(Request $request): JsonResponse
    {
        $qcm = Qcm::create([
            'name' => $request->name,
        ]);

    }
}
