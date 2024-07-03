<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DeckResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "id" => $this->id,
            "name" => $this->name,
            "is_public" => $this->is_public,
            "is_organization" => $this->is_organization,
            "likes" => $this->likes,
            "type" => $this->type,
            "flashcards" => FlashcardResource::collection($this->whenLoaded("flashcards"))
        ];
    }
}
