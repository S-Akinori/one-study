<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var string[]
     */
    protected $fillable = [
        'name',
        'username',
        'photoURL',
        'downloadedVideos',
        'followings',
        'followers',
        'postTotal',
        'email',
        'password',
        'downloadedFiles'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array
     */
    protected $hidden = [
        'email',
        'email_verified_at',
        'two_factor_recovery_codes',
        'two_factor_secret',
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'downloadedFiles' => 'array'
    ];

    public static function socialFindOrCreate($providerUser, $provider) {
      $account = IdentityProvider::whereProviderName($provider)
                  ->whereProviderUserId($providerUser->getId())
                  ->first();

      if($account) {
        return $account->user;
      }
      $existingUser = User::whereEmail($providerUser->getEmail())->first();

      if($existingUser) {
        $user = DB::transaction(function () use ($existingUser, $providerUser, $provider) {
          $existingUser->identityProviders()->create([
            'provider_user_id' => $providerUser->getId(),
            'provider_name' => $provider
          ]);

          return $existingUser;
        });
      } else {
        $user = DB::transaction(function () use ($providerUser, $provider) {
          $providerUserName = $providerUser->getName() ? $providerUser->getName() : $providerUser->getNickName();
          $user = User::create([
            'name' => $providerUserName,
            'email' => $providerUser->getEmail(),
          ]);
          $user->IdentityProviders->create([
            'provider_user_id' => $providerUser->getId(),
            'provider_name' => $provider,
          ]);
          return $user;
        });
      }
      return $user;
    }
    
    public function posts() {
      return $this->hasMany(Post::class);
    }

    public function identityProviders() {
      return $this->hasMany(IdentityProvider::class);
    }
}
