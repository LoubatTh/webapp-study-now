<?php

namespace App\Http\Resources;

use App\Models\Organization;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrganizationInvitationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $organization = Organization::find($this->organization_id);

        if(!$organization) {
            return response()->json([
                'error' => 'Organization not found'
            ], 404);
        }

        return [
            'user_id' => $this->user_id,
            'organization_id' => $this->organization_id,
            'organization' => $organization->name,
            'owner' => User::find($organization->owner_id)->name,
            'created_at' => $this->organization_id,
        ];
    }
}
