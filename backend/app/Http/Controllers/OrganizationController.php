<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreOrganizationRequest;
use App\Http\Requests\UpdateOrganizationRequest;
use App\Models\Organization;
use App\Models\User;
use Illuminate\Http\Request;

class OrganizationController
{
    /**
     * Store a newly created resource in organization.
     */
    public function store(StoreOrganizationRequest $request)
    {
        try {
            $user = $request->user();
            Organization::create([
                'name' => $request->name,
                'owner_id' => $user['id'],
            ]);

            return response()->json([
                'message' => 'Organization created'
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the specified organization.
     */
    public function show(Request $request, int $id)
    {
        try {
            $user = $request->user();
            $organization = Organization::find($id);

            if (!$organization) {
                return response()->json([
                    'error' => 'Organization not found'
                ], 404);
            }

            if (!$this->isMember($organization, $user)) {
                return response()->json([
                    'error' => 'Forbidden: Not an organization member'
                ], 403);
            }

            return response()->json($organization);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update the specified organization in storage.
     */
    public function update(UpdateOrganizationRequest $request, int $id)
    {
        try {
            $user = $request->user();
            $organization = Organization::find($id);

            if (!$organization) {
                return response()->json([
                    'error' => 'Organization not found'
                ], 404);
            }

            if (!$this->isOwner($organization, $user)) {
                return response()->json([
                    'error' => 'Forbidden: Not the organization owner'
                ], 403);
            }

            $organization->update($request->all());

            return response()->json([
                'message' => 'Organization updated',
                'organization' => $organization
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Remove the specified organization from storage.
     */
    public function destroy(Request $request, int $id)
    {
        try {
            $user = $request->user();
            $organization = Organization::find($id);

            if (!$organization) {
                return response()->json([
                    'error' => 'Organization not found'
                ], 404);
            }

            if (!$this->isOwner($organization, $user)) {
                return response()->json([
                    'error' => 'Forbidden: Not the organization owner'
                ], 403);
            }

            $organization->delete();

            return response()->noContent();
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Display the users of the speciefied organization
     */
    public function showUsers(Request $request, int $id)
    {
        try {
            $user = $request->user();
            $organization = Organization::find($id);

            if (!$organization) {
                return response()->json([
                    'error' => 'Organization not found'
                ], 404);
            }

            if (!$this->isMember($organization, $user)) {
                return response()->json([
                    'error' => 'Forbidden: Not an organization member'
                ], 403);
            }

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
    public function storeUsers(Request $request, int $id)
    {
        try {
            $user = $request->user();
            $organization = Organization::find($id);

            if (!$organization) {
                return response()->json([
                    'error' => 'Organization not found'
                ], 404);
            }

            if (!$this->isOwner($organization, $user)) {
                return response()->json([
                    'error' => 'Forbidden: Not the organization owner'
                ], 403);
            }

            $member = User::where('email', $request['email'])->first();
            if (!$member) {
                return response()->json([
                    'error' => 'User not found'
                ], 404);
            }

            if ($organization->users()->where('user_id', $member['id'])->exists()) {
                return response()->json([
                    'message' => 'User already in organization'
                ]);
            }

            $organization->users()->attach($member['id']);

            return response()->json([
                'message' => 'User added to the organization'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
            ], 500);
        }

    }

    /**
     * Remove a user from the specified organization
     */
    public function destroyUsers(Request $request, int $id)
    {
        try {
            $user = $request->user();
            $organization = Organization::find($id);

            if (!$organization) {
                return response()->json([
                    'error' => 'Organization not found'
                ], 404);
            }

            if (!$this->isOwner($organization, $user)) {
                return response()->json([
                    'error' => 'Forbidden: Not the organization owner'
                ], 403);
            }

            $member = User::find($request['id']);
            if (!$member) {
                return response()->json([
                    'error' => 'User not found'
                ], 404);
            }

            $organization->users()->detach($request['id']);

            return response()->noContent();
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Check if the user is a member of the organization
     */
    private function isMember(Organization $organization, User $user): bool
    {
        if ($organization['owner_id'] === $user['id']) {
            return true;
        }

        foreach ($organization->users as $member) {
            if ($member['id'] === $user['id']) {
                return true;
            }
        }

        return false;
    }

    /**
     * Check if the user is the owner of the organization
     */
    private function isOwner(Organization $organization, User $user): bool
    {
        if ($organization['owner_id'] === $user['id']) {
            return true;
        }

        return false;
    }
}
