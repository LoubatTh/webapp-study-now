<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserDeckResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'deck_id' => $this->deck_id,
            'next_repetition' => $this->next_repetition,
            'is_liked' => $this->is_liked,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'deck' => new DeckResource($this->whenLoaded('deck')),
            'results' => UserDeckResultsResource::collection($this->whenLoaded('results')),
        ];
    }
}
