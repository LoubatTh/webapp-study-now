<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreOrganizationDeckRequest;
use App\Http\Requests\UpdateOrganizationDeckRequest;
use App\Http\Resources\OrganizationDeckResource;
use App\Models\Deck;
use App\Models\Organization;
use App\Models\OrganizationDeck;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpKernel\Exception\HttpException;

class OrganizationDeckController
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request, int $id)
    {
        $decks = OrganizationDeck::with('deck')->where('organization_id', $id)->get();

        return response()->json(OrganizationDeckResource::collection($decks));
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

            if (!$deck['isPublic'] && $deck['user_id'] !== $request->user()['id']) {
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
                $filePath = Storage::putFile('organizations/decks', $file, 'public');
            }

            OrganizationDeck::create([
                'organization_id' => $id,
                'deck_id' => $data['deck_id'],
                'file_path' => $filePath,
            ]);

            return response()->json([
                'message' => 'Deck added to the organization',
                'file_url' => $this->urlBuilder($filePath),
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
        $organizationDeck = OrganizationDeck::with('deck.flashcards')
            ->where('organization_id', $id)
            ->where('deck_id', $deckId)
            ->first();

        if (!$organizationDeck) {
            return response()->json([
                'error' => 'Not found'
            ], 404);
        }

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

        Storage::delete($organizationDeck['file_path']);
        $filePath = Storage::putFile('organizations/decks', $file, 'public');
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

        Storage::delete($organizationDeck['file_path']);
        $organizationDeck->delete();

        return response()->noContent();
    }

    public function urlBuilder(string $filename)
    {
        $appUrl = env('APP_DEBUG') ? 'backend' : env('APP_URL');

        return url("http://$appUrl/storage/$filename");
    }
}