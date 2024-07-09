<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class QuizResource extends JsonResource
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
            "likes" => $this->likes,
            "tag" => $this->tag,
            "type" => $this->type,
            "user" => $this->owner->name,
            "qcms" => $this->qcms

        ];
    }
}
