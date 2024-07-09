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
            "type" => $this->type,
            "name" => $this->name,
            "is_public" => $this->is_public,
            "is_organization" => $this->is_organization,
            "likes" => $this->likes,
            "tag" => $this->whenLoaded('tag', function () {
                return $this->tag->name;
            }),
            "owner" => $this->user->name,
            "flashcards" => FlashcardResource::collection($this->whenLoaded("flashcards"))
        ];
    }
}
