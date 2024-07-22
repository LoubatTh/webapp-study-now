<?php

namespace App\Http\Resources;

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
        return [
            'id' => $this->id,
            // 'deck_id' => $this->deck_id,
            'organization_id' => $this->organization_id,
            'file_path' => env('AWS_URL') . $this->file_path,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'deck' => new DeckResource($this->whenLoaded('deck')),
        ];
    }
}
