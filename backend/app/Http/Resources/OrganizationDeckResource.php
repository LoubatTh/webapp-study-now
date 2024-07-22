<?php

namespace App\Http\Resources;

use App\Models\Deck;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrganizationDeckResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $deck = Deck::with("tag", "user", "flashcards")->where('id', $this->deck_id)->first();
        $deck->setAttribute('is_liked', $this->getAttribute('is_liked'));

        $response = [
            'id' => $this->id,
            // 'deck_id' => $this->deck_id,
            'organization_id' => $this->organization_id,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'deck' => new DeckResource($deck),
        ];

        if ($this->file_path) {
            $response['file_path'] = env('AWS_URL') . $this->file_path;
        }

        return $response;
    }
}
