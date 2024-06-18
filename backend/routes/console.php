<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote')->hourly();

// Clear tokens that are a week old (to avoid deleting refresh-tokens)
Schedule::command('sanctum:prune-expired --hours=168')->daily();
