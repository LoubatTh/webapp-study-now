<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('user_deck_results', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_deck_id');
            $table->integer('grade');
            $table->float('easiness_factor');
            $table->integer('interval');
            $table->integer('repetition');
            $table->timestamps();

            $table->foreign('user_deck_id')->references('id')->on('user_decks')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_deck_results');
    }
};
