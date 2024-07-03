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
        Schema::create('user_decks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id');
            $table->foreignId('deck_id');
            $table->float('easiness_factor');
            $table->integer('repetition');
            $table->integer('interval');
            $table->date('date');
            $table->float('user_grade')->nullable();
            $table->float('prev_user_grade')->nullable();
            $table->boolean('is_liked');
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('deck_id')->references('id')->on('decks')->onDelete('cascade');

            $table->unique(['user_id', 'deck_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_decks');
    }
};
