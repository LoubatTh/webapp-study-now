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
        $response = [
            'id' => $this->id,
            // 'quiz_id' => $this->quiz_id,
            'organization_id' => $this->organization_id,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'quiz' => new QuizResource($this->whenLoaded('quiz')),
        ];
        
        if ($this->file_path) {
            $response['file_path'] =  env('AWS_URL') . $this->file_path;
        }

        return $response;
    }
}
