<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateDeckRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            "name" => "string|max:255",
            "isPublic" => "boolean",
            "isOrganization" => "boolean",
            "likes" => "integer",
            "flashcards" => "array",
            "flashcards.*.question" => "string|max:255",
            "flashcards.*.answer" => "string|max:255",
        ];
    }
}
