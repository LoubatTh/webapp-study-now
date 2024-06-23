<?php

use App\Enums\TokenAbility;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);

Route::middleware(['auth:sanctum', 'abilities:' . TokenAbility::ISSUE_ACCESS_TOKEN->value])->group(function () {
  Route::get('refresh', [AuthController::class, 'refreshToken']);
});

Route::middleware(['auth:sanctum', 'abilities:' . TokenAbility::ACCESS_API->value])->group(function () {
  Route::post('logout', [AuthController::class, 'logout']);
});