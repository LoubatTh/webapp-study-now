<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('quizzes', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string('name');
            $table->boolean('is_public');
            $table->integer('likes');
            $table->boolean('is_organization');
            $table->string('type');
            $table->foreignId('tag_id');
            $table->foreignId('owner')->constrained('users', 'id')->onDelete('cascade');

            $table->foreign('tag_id')->references('id')->on('tags');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quizzes');
    }
};