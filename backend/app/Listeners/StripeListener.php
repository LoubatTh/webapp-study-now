<?php

namespace App\Listeners;

use Laravel\Cashier\Events\WebhookReceived;

class StripeListener
{
    public function handle(WebhookReceived $event): void
    {
        $out = new \Symfony\Component\Console\Output\ConsoleOutput();
        $out->writeln("Stripe webhook trigerred (" . $event->payload['type'] . ")");
    }
}
