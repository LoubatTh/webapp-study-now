<?php

use App\Enums\DeckVisibility;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('decks', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->enum('visibility', [DeckVisibility::PUBLIC ->value, DeckVisibility::PRIVATE ->value, DeckVisibility::LIMITED->value])->default(DeckVisibility::PUBLIC );
            $table->integer('likes')->nullable();
            $table->foreignId('user_id');
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('decks');
    }
};
