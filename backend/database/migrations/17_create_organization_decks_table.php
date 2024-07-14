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
        Schema::create('organization_decks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('deck_id');
            $table->foreignId('organization_id');
            $table->string('file_path')->nullable();
            $table->timestamps();

            $table->foreign('deck_id')->references('id')->on('decks')->onDelete('cascade');
            $table->foreign('organization_id')->references('id')->on('organizations')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('organization_decks');
    }
};
