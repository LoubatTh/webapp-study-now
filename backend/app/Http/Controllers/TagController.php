<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTagRequest;
use App\Http\Requests\UpdateTagRequest;
use App\Http\Resources\TagCollection;
use App\Models\Tag;

class TagController
{
    /**
     * Display a listing of the resource.
     */
    public function getAllTags()
    {
        try {
            return response()->json(new TagCollection(Tag::all()), 200);
        } catch (\Exception $e) {
            return response()->json(["error" => $e->getMessage()], 400);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function createTag(StoreTagRequest $request)
    {
        try {
            Tag::create([
                "name" => $request->name,
            ]);

            return response()->json(["message" => "Tag created successfully"], 201);
        } catch (\Exception $e) {
            return response()->json(["error" => $e->getMessage()], 400);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function updateTagById(UpdateTagRequest $request, int $id)
    {
        try {
            $tag = Tag::find($id);
            if (!$tag) {
                return response()->json(["message" => "Tag not found"], 404);
            }

            $tag->update([
                "name" => $request->has("name") ? $request->name : $tag->name,
            ]);

            return response()->noContent();
        } catch (\Exception $e) {
            return response()->json(["error" => $e->getMessage()], 400);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function deleteTagById(int $id)
    {
        try {
            $tag = Tag::find($id);
            if (!$tag) {
                return response()->json(["message" => "Tag not found"], 404);
            }

            $tag->delete();
            return response()->noContent();
        } catch (\Exception $e) {
            return response()->json(["error" => $e->getMessage()], 400);
        }
    }
}
