<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreOrganizationRequest;
use App\Http\Requests\UpdateOrganizationRequest;
use App\Models\Organization;
use Illuminate\Http\Request;

class OrganizationController
{
    /**
     * Store a newly created resource in organization.
     */
    public function store(StoreOrganizationRequest $request)
    {
        Organization::create([
            'name' => $request->name,
            'owner_id' => $request->user()['id'],
        ]);

        return response()->json([
            'message' => 'Organization created'
        ], 201);
    }

    /**
     * Display the specified organization.
     */
    public function show(Request $request, int $id)
    {
        $organization = Organization::find($id);

        return response()->json($organization);
    }

    /**
     * Update the specified organization in storage.
     */
    public function update(UpdateOrganizationRequest $request, int $id)
    {
        Organization::find($id)->update($request->all());

        return response()->json([
            'message' => 'Organization updated',
        ]);
    }

    /**
     * Remove the specified organization from storage.
     */
    public function destroy(Request $request, int $id)
    {
        Organization::find($id)->delete();

        return response()->noContent();
    }
}
