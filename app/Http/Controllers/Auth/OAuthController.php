<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
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
      try {
        $providerUser = Socialite::driver($provider)->user();
      } catch (\Exception $e) {
        abort(500, $e->getMessage());
      }
      $authUser = User::socialFindOrCreate($providerUser, $provider);
      Auth::login($authUser, true);

      return $authUser;
    }
}
