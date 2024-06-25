<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class QuizController extends Controller
{
    //


    public function store(Request $request): JsonResponse
    {
        $user =  $request->user();

        $data = $resquest->validate([
            'name' => 'required|string',
            'qcms' => 'required|array',
            'qcms.*.question' => 'required|string',
            'qcms.*.answers' => 'required|array|size:4',
            'qcms.*.answers.*.response' => 'required|string',
            'qcms.*.answers.*.isValid' => 'required|boolean',
        ]);

        $quiz = Quiz::create([
            'name' => $data['name'],
            'user' => $user
        ]);

    }
}
