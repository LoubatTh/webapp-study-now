<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreOrganizationDeckRequest;
use App\Http\Requests\UpdateOrganizationDeckRequest;
use App\Http\Resources\OrganizationDeckResource;
use App\Models\Deck;
use App\Models\UserDeck;
use App\Models\OrganizationDeck;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Illuminate\Support\Facades\Log;

class OrganizationDeckController
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request, int $id)
    {
        $organizationDecks = OrganizationDeck::with('deck.flashcards', 'deck.tag', 'deck.user')->where('organization_id', $id)->get();

        $user = $request->user();

        foreach ($organizationDecks as $organizationDeck) {
            $userDeck = UserDeck::where(["user_id" => $user->id, "deck_id" => $organizationDeck->deck_id])->first();
            $organizationDeck->setAttribute("is_liked", $userDeck ? $userDeck->is_liked : false);
        }

        return response()->json(OrganizationDeckResource::collection($organizationDecks));
    }

    /**
     * Add an existing deck to the organization.
     */
    public function store(StoreOrganizationDeckRequest $request, int $id)
    {
        try {
            $data = json_decode($request->all()['data'], true);
            $deck = Deck::find($data['deck_id']);

            if (!$deck) {
                return response()->json([
                    'error' => 'Deck not found'
                ], 404);
            }

            if (OrganizationDeck::where('deck_id', $data['deck_id'])->where('organization_id', $id)->first()) {
                return response()->json([
                    'message' => 'Deck already in organization'
                ]);
            }

            if (!$deck['is_public'] && ($deck['user_id'] !== $request->user()['id'])) {
                return response()->json([
                    'error' => 'Only owned or public decks can be added to the organization',
                ], 403);
            }

            $file = $request->file('file');
            $filePath = null;

            if ($file) {
                if ($file->extension() !== 'pdf') {
                    return response()->json([
                        'error' => 'Only pdf files supported'
                    ], 400);
                }
                $filePath = Storage::disk('s3')->putFile('organizations/decks', $file);
            }

            OrganizationDeck::create([
                'organization_id' => $id,
                'deck_id' => $data['deck_id'],
                'file_path' => $filePath,
            ]);

            if ($filePath) {
                return response()->json([
                    'message' => 'Deck added to the organization',
                    'url' => env('AWS_URL') . $filePath,
                ], 201);
            }

            return response()->json([
                'message' => 'Deck added to the organization',
            ], 201);
        } catch (HttpException $e) {
            return response()->json([
                'error' => $e->getMessage(),
            ], $e->getStatusCode() ? 500 : $e->getStatusCode());
        }
    }

    /**
     * Display the specified organizationDeck.
     */
    public function show(Request $request, int $id, int $deckId)
    {
        $organizationDeck = OrganizationDeck::with('deck.flashcards', 'deck.tag', 'deck.user')
            ->where('organization_id', $id)
            ->where('deck_id', $deckId)
            ->first();

        if (!$organizationDeck) {
            return response()->json([
                'error' => 'Not found'
            ], 404);
        }

        $user = $request->user();

        $userDeck = UserDeck::where(["user_id" => $user->id, "deck_id" => $deckId])->first();
        $organizationDeck->setAttribute("is_liked", $userDeck ? $userDeck->is_liked : false);

        return response()->json(new OrganizationDeckResource($organizationDeck));
    }

    /**
     * Update the specified organizationDeck.
     */
    public function update(UpdateOrganizationDeckRequest $request, int $id, int $deckId)
    {
        $organizationDeck = OrganizationDeck::where('organization_id', $id)->where('deck_id', $deckId)->first();
        $file = $request->file('file');

        if ($file->extension() !== 'pdf') {
            return response()->json([
                'error' => 'Only pdf files supported'
            ], 400);
        }

        if (!$organizationDeck) {
            return response()->json([
                'error' => 'Not found',
            ], 404);
        }

        if ($organizationDeck['file_path']) {
            Storage::disk('s3')->delete($organizationDeck['file_path']);
        }

        $filePath = Storage::disk('s3')->putFile('organizations/decks', $file, 'public');
        $organizationDeck->update([
            'file_path' => $filePath,
        ]);

        return response()->json([
            'message' => 'File updated',
            'file_path' => $this->urlBuilder($organizationDeck['file_path']),
        ]);
    }

    /**
     * Remove the specified organizationDeck from storage.
     */
    public function destroy(Request $request, int $id, int $deckId)
    {
        $organizationDeck = OrganizationDeck::where('organization_id', $id)->where('deck_id', $deckId)->first();

        Storage::disk('s3')->delete($organizationDeck['file_path']);
        $organizationDeck->delete();

        return response()->noContent();
    }

    public function urlBuilder(string $filename)
    {
        $appUrl = env('APP_DEBUG') ? 'backend' : env('APP_URL');

        return url("http://$appUrl/storage/$filename");
    }
}
