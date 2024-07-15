<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrganizationQuizResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $appUrl = env('APP_DEBUG') ? 'backend' : env('APP_URL');
         
        return [
                'id' => $this->id,
                // 'deck_id' => $this->deck_id,
                // 'organization_id' => $this->organization_id,
                'file_path' => url("http://$appUrl/storage/$this->file_path"),
                'created_at' => $this->created_at,
                'updated_at' => $this->updated_at,
                'quiz' => new QuizResource($this->whenLoaded('quiz')),
        ];

    }
}
