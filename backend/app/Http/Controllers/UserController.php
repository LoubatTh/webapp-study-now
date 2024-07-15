<?php

namespace App\Http\Controllers;

use App\Models\Organization;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Validation\ValidationException;

class UserController extends Controller
{
    /**
     * Display the current user.
     */
    public function show(Request $request)
    {
        $user = $request->user();
        $subscribedToProduct = $user->subscribed();

        $response = [
            'id' => $user['id'],
            'name' => $user['name'],
            'email' => $user['email'],
            'role' => $user['role'],
            'email_verified_at' => $user['email_verified_at'],
            'created_at' => $user['created_at'],
            'updated_at' => $user['updated_at'],
            'is_subscribed' => $subscribedToProduct,
        ];

        return response()->json($response);
    }

    /**
     * Display the current user organizations.
     */
    public function showOrganizations(Request $request)
    {
        $user = $request->user();
        $ownedOrganizations = Organization::where('owner_id', $user->id)->get();
        $organizations = [];

        foreach ($user->organizations as $organization) {
            $response = [
                'id' => $organization['id'],
                'name' => $organization['name'],
                'created_at' => $organization['created_at'],
                'updated_at' => $organization['updated_at'],
                'owner_id' => $organization['owner_id'],
            ];

            array_push($organizations, $response);
        }

        return response()->json([
            'owned_organizations' => $ownedOrganizations,
            'organizations' => $organizations,
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        try {
            $data = $request->validate([
                'name' => 'required|string',
            ]);
        } catch (ValidationException $e) {
            return response()->json($e->errors(), 400);
        }

        $user = $request->user();
        $user->update($data);

        return response()->json([
            'message' => 'User updated'
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request)
    {
        $user = $request->user();
        $user->delete();

        return response()->json([
            'message' => 'User deleted'
        ]);
    }
}
