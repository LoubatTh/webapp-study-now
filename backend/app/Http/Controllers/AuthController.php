<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Carbon;
use \App\Enums\TokenAbility;
use App\Models\User;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        try {
            $data = $request->validate([
                'name' => 'required|string|unique:users',
                'email' => 'required|string|email|unique:users',
                'password' => 'required|min:8'
            ]);
        } catch (ValidationException $e) {
            return response()->json($e->errors(), 400);
        }

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
        ]);

        $accessTokenExpirationDate = Carbon::now()->addMinutes(config('sanctum.ac_expiration'));
        $accessToken = $user->createToken('access_token', [TokenAbility::ACCESS_API->value], $accessTokenExpirationDate);
        $refreshTokenExpirationDate = Carbon::now()->addMinutes(config('sanctum.rt_expiration'));
        $refreshToken = $user->createToken('refresh_token', [TokenAbility::ISSUE_ACCESS_TOKEN->value], $refreshTokenExpirationDate);

        return response()->json([
            'access_token' => $accessToken->plainTextToken,
            'access_token_expiration' => $accessTokenExpirationDate,
            'refresh_token' => $refreshToken->plainTextToken,
            'refresh_token_expiration' => $refreshTokenExpirationDate,
        ], 201);
    }

    public function login(Request $request)
    {
        try {
            $data = $request->validate([
                'email' => 'required|string|email',
                'password' => 'required|min:8'
            ]);
        } catch (ValidationException $e) {
            return response()->json($e->errors(), 400);
        }

        $user = User::where('email', $data['email'])->first();
        if (!$user || !Hash::check($data['password'], $user->password)) {
            return response()->json([
                'error' => 'Invalid credentials'
            ], 401);
        }

        $accessTokenExpirationDate = Carbon::now()->addMinutes(config('sanctum.ac_expiration'));
        $accessToken = $user->createToken('access_token', [TokenAbility::ACCESS_API->value], $accessTokenExpirationDate);
        $refreshTokenExpirationDate = Carbon::now()->addMinutes(config('sanctum.rt_expiration'));
        $refreshToken = $user->createToken('refresh_token', [TokenAbility::ISSUE_ACCESS_TOKEN->value], $refreshTokenExpirationDate);

        return response()->json([
            'access_token' => $accessToken->plainTextToken,
            'access_token_expiration' => $accessTokenExpirationDate,
            'refresh_token' => $refreshToken->plainTextToken,
            'refresh_token_expiration' => $refreshTokenExpirationDate,
        ]);
    }

    public function logout(Request $request)
    {
        auth()->user()->tokens()->delete();

        return response()->json([
            'message' => 'Logged out'
        ]);
    }

    public function refreshToken(Request $request)
    {
        $accessTokenExpirationDate = Carbon::now()->addMinutes(config('sanctum.ac_expiration'));
        $accessToken = $request->user()->createToken('access_token', [TokenAbility::ACCESS_API->value], $accessTokenExpirationDate);

        return response()->json([
            'access_token' => $accessToken->plainTextToken,
            'access_token_expiration' => $accessTokenExpirationDate,
        ]);
    }
}
