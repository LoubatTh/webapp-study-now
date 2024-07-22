<?php

namespace App\Http\Controllers;

use App\Http\Requests\OrganizationInviteRequest;
use App\Http\Resources\OrganizationInvitationResource;
use App\Models\Organization;
use App\Models\OrganizationInvitation;
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
                'members' => $members,
                'members_count' => count($members),
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

        if (OrganizationInvitation::where('user_id', $member['id'])->where('organization_id', $id)->first()) {
            return response()->json([
                'error' => 'User already invited to the organization',
            ], 400);
        }

        OrganizationInvitation::create([
            'user_id' => $member['id'],
            'organization_id' => $organization->id,
        ]);

        return response()->json([
            'message' => 'Invitation created'
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

    public function invite(OrganizationInviteRequest $request, int $id)
    {
        $invite = OrganizationInvitation::find($id);
        $user = $request->user();

        if (!$invite) {
            return response()->json([
                'error' => 'Invitation not found'
            ], 404);
        }

        if ($user['id'] !== $invite['user_id']) {
            return response()->json([
                'error' => 'Not allowed to accept/refuse this invitation'
            ], 403);
        }

        if (!$request['accept']) {
            $invite->delete();
            return response()->json([
                'message' => 'Invitation refused'
            ]);
        }

        Organization::find($invite['organization_id'])->users()->attach($user['id']);
        $invite->delete();

        return response()->json([
            'message' => 'Invitation accepted'
        ]);
    }

    public function showInvite(Request $request)
    {
        $invitations = OrganizationInvitation::where('user_id', $request->user()['id'])->get();

        return response()->json(OrganizationInvitationResource::collection($invitations));
    }
}
