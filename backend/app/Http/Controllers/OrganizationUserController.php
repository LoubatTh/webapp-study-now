<?php

namespace App\Http\Controllers;

use App\Models\Organization;
use App\Models\User;
use Illuminate\Http\Request;

class OrganizationUserController
{
    /**
     * Display the users of the speciefied organization
     */
    public function show(Request $request, int $id)
    {
        try {
            $organization = Organization::find($id);

            $owner = User::find($organization['owner_id']);
            $members = [];
            foreach ($organization->users as $member) {
                $response = [
                    'id' => $member['id'],
                    'name' => $member['name'],
                ];

                array_push($members, $response);
            }

            return response()->json([
                'owner' => [
                    'id' => $owner['id'],
                    'name' => $owner['name'],
                ],
                'members' => $members
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Add a user to the specified organization
     */
    public function store(Request $request, int $id)
    {
        $organization = Organization::find($id);
        $member = User::where('email', $request['email'])->first();

        if (!$member) {
            return response()->json([
                'error' => 'User not found'
            ], 404);
        }

        if ($organization->users()->where('user_id', $member['id'])->exists()) {
            return response()->json([
                'message' => 'User already in organization'
            ], 400);
        }

        $organization->users()->attach($member['id']);

        return response()->json([
            'message' => 'User added to the organization'
        ], 201);
    }

    /**
     * Remove a user from the specified organization
     */
    public function destroy(Request $request, int $id, int $userId)
    {
        $organization = Organization::find($id);

        if (!User::find($userId)) {
            return response()->json([
                'error' => 'User not found'
            ], 404);
        }

        $organization->users()->detach($userId);

        return response()->noContent();
    }
}
