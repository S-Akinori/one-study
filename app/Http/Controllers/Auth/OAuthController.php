<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\IdentityProvider;
use App\Models\User;
use Carbon\Carbon;
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
      $provider_user = Socialite::driver($provider)->user();
      $identity_provider = IdentityProvider::where('provider_user_id', $provider_user->getId())->get();
      if($identity_provider) { //login
        Auth::loginUsingId($identity_provider->user_id);
      } else { //create identity provider
        $user = User::where('email', $provider_user->getEmail())->get();
        
        if(!$user) {
          $user = User::create([
            'name' => ($provider_user->getName()) ? $provider_user->getName() : $provider_user->getNickname(),
            'username' => $provider_user->getNickname(),
            'email' => $provider_user->getEmail(),
            'photoURL' => $provider_user->getAvatar(),
          ]);
          $user->email_verified_at = Carbon::now();
          $user->save();
        }

        IdentityProvider::create([
          'user_id' => $user->id,
          'provider_name' => $provider,
          'provider_user_id' => $provider_user->getId(),
        ]);
      }
      return true;
    }
}
