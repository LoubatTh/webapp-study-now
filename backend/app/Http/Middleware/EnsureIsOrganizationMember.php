<?php

namespace App\Http\Middleware;

use App\Models\Organization;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureIsOrganizationMember
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        $organization = Organization::find($request->route('id'));

        if ($organization['owner_id'] !== $user['id'] && !$organization->users()->find($user['id'])) {
            return response()->json([
                'error' => 'Forbidden: Not an organization member'
            ]);
        }

        return $next($request);
    }
}
