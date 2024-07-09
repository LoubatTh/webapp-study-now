<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

use App\Http\Resources\TagResource;
use App\Http\Resources\QcmResource;

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
            "type" => $this->type,
            "name" => $this->name,
            "is_public" => $this->is_public,
            "is_organization" => $this->is_organization,
            "likes" => $this->likes,
            "tag" => $this->tag->name,
            "owner" => $this->user->name,
            "qcms" => QcmResource::collection($this->qcms),
        ];
    }
}
