<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class StripeController extends Controller
{
    /**
     * Create checkout session to subscribe a user.
     */
    public function subcriptionCheckout(Request $request)
    {
        $checkoutSession = $request->user()
            ->newSubscription('default', 'price_1PVCT5LDBaFPKLdsUk1W8WUK')
            ->trialDays(1)
            ->allowPromotionCodes()
            ->checkout([
                'success_url' => 'http://localhost:3000',
                'cancel_url' => 'http://localhost:3000',
            ]);

        return response()->json([
            'url' => $checkoutSession->url,
        ]);
    }

    /**
     * Cancel user subscription.
     */
    public function cancel(Request $request)
    {
        $user = $request->user();

        if ($user->subscription('default')->onGracePeriod()) {
            return response()->json([
                'message' => 'Already in grace period',
                'ends_at' => $user->subscription()['ends_at']
            ]);
        }

        if (!$user->subscribed()) {
            return response()->json([
                'message' => 'No active subscription'
            ]);
        }

        $user->subscription()->cancel();
        return response()->json([
            'message' => 'Subscription canceled',
            'ends_at' => $user->subscription()['ends_at']
        ]);
    }

    /**
     * Resume user subscription.
     */
    public function resume(Request $request)
    {
        $user = $request->user();

        if (!$user->subscription('default')->onGracePeriod()) {
            return response()->json([
                'message' => 'User not in grace period'
            ]);
        }

        $user->subscription('default')->resume();
        return response()->json([
            'message' => 'Subscription resumed'
        ]);
    }
}
