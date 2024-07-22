<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('test-log', function () {
    \Log::info('Test log message');
    return response()->json(['message' => 'Log has been written']);
});
