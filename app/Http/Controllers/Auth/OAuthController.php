<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\IdentityProvider;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;

class OAuthController extends Controller
{
    //
    public function getProviderOAuthURL(string $provider) {
      $redirectUrl = Socialite::driver($provider)->redirect()->getTargetUrl();
      return response()->json([
        'redirect_url' => $redirectUrl,
      ]);
    }

    public function handleProviderCallback(string $provider) {
      $user = Socialite::driver($provider)->user();
      return [
        'id' => $user->getId(),
        'name' => $user->getName(),
        'email' => $user->getEmail(),
        'nickname' => $user->getNickname(),
        'avatar' => $user->getAvatar(),
      ];
    }
}
