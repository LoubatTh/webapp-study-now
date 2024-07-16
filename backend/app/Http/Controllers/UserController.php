<?php

namespace App\Http\Controllers;

use App\Models\Deck;
use App\Models\Organization;
use App\Models\OrganizationDeck;
use App\Models\OrganizationQuiz;
use App\Models\Quiz;
use Illuminate\Support\Facades\Hash;
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
        $ownedOrganizations = [];
        $organizations = [];
        
        foreach (Organization::where('owner_id', $user->id)->get() as $organization) {
            $response = [
                'id' => $organization['id'],
                'name' => $organization['name'],
                'description' => $organization['description'],
                'created_at' => $organization['created_at'],
                'updated_at' => $organization['updated_at'],
                'owner_id' => $organization['owner_id'],
                'tags' => $this->getOrganizationTags($organization['id']),
            ];
            
            array_push($ownedOrganizations, $response);
        }

        foreach ($user->organizations as $organization) {
            $response = [
                'id' => $organization['id'],
                'name' => $organization['name'],
                'description' => $organization['description'],
                'created_at' => $organization['created_at'],
                'updated_at' => $organization['updated_at'],
                'owner_id' => $organization['owner_id'],
                'tags' => $this->getOrganizationTags($organization['id']),
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
                'name' => 'string',
                'password' => 'string|min:8',
                'new_password' => 'string|min:8'
            ]);
        } catch (ValidationException $e) {
            return response()->json($e->errors(), 400);
        }

        $user = $request->user();
        $fields = [];

        if (isset($data['name'])) {
            $fields['name'] = $data['name'];
        }

        if (isset($data['password']) && isset($data['new_password'])) {
            if (!Hash::check($data['password'], $user->password)) {
                return response()->json([
                    'error' => 'Invalid password',
                ], 400);
            }

            $fields['password'] = Hash::make($data['new_password']);
        }

        $user->update($fields);

        return response()->json([
            'message' => 'User updated',
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

    public function getOrganizationTags(int $organizationId)
    {
        $organizationDecks = OrganizationDeck::where('organization_id', $organizationId)->get();
        $organizationQuizzes = OrganizationQuiz::where('organization_id', $organizationId)->get();
        $tags = [];

        foreach ($organizationDecks as $organizationDeck) {
            $deck = Deck::where('id', $organizationDeck['deck_id'])->first();
            array_push($tags, $deck->tag->name);
        }

        foreach ($organizationQuizzes as $organizationQuiz) {
            $quiz = Quiz::where('id', $organizationQuiz['quiz_id'])->first();
            array_push($tags, $quiz->tag->name);
        }

        return array_unique($tags);
    }
}
