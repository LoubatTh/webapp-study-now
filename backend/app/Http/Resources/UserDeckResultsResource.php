<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserDeckResultsResource extends JsonResource
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
            'grade' => $this->grade,
            // 'user_deck_id' => $this->user_deck_id,
            // 'easiness_factor' => $this->easiness_factor,
            // 'interval' => $this->interval,
            // 'repetition' => $this->repetition,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
