<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

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
            "likes" => $this->likes,
            "tag" => $this->whenLoaded("tag", function () {
                return $this->tag->name;
            }),
            "owner" => $this->whenLoaded("user", function () {
                return $this->user->name;
            }),
            "owner_avatar" => $this->whenLoaded("user", function () {
                return env('AWS_URL') . $this->user->avatar;
            }),
            "is_liked" => $this->getAttribute("is_liked"),
            "qcms_count" => $this->whenCounted('qcms'),
            "qcms" => QcmResource::collection($this->whenLoaded('qcms')),
        ];
    }
}