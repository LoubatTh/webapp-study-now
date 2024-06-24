<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Qcm;
use Illuminate\Http\JsonResponse;

class QcmController extends Controller
{
    //


    public function store(Request $request): JsonResponse
    {

        $qcm = Qcm::create([
            'question' => $request->question,
            'answers' => $request->answers
        ]);

        return response()->json($qcm, 201);
    }

}