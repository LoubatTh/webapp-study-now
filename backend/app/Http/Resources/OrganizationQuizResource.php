<?php

namespace App\Http\Resources;

use App\Models\Quiz;
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
        $quiz = Quiz::with("tag", "user", "qcms")->where('id', $this->quiz_id)->first();
        $quiz->setAttribute('is_liked', $this->getAttribute('is_liked'));

        $response = [
            'id' => $this->id,
            // 'quiz_id' => $this->quiz_id,
            'organization_id' => $this->organization_id,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'quiz' => new QuizResource($quiz),
        ];

        if ($this->file_path) {
            $response['file_path'] = env('AWS_URL') . $this->file_path;
        }

        return $response;
    }
}
