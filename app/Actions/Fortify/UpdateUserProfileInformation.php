<?php

namespace App\Actions\Fortify;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Laravel\Fortify\Contracts\UpdatesUserProfileInformation;

class UpdateUserProfileInformation implements UpdatesUserProfileInformation
{
    /**
     * Validate and update the given user's profile information.
     *
     * @param  mixed  $user
     * @param  array  $input
     * @return void
     */
    public function update($user, array $input)
    {
        if(!isset($input['name'])) $input['name'] = $user->name;
        if(!isset($input['username'])) $input['username'] = $user->username;
        if(!isset($input['email'])) $input['email'] = $user->email;
        Validator::make($input, [
            'name' => ['required', 'string', 'max:255'],
            'username' => ['required', 'string', 'max:255', 'regex:/^[0-9a-zA-Z\\-\\_]+$/'],
            'avatar' => ['file', 'max:2000000', 'mimes:jpg,png,gif'],
            'email' => [
                'string',
                'email',
                'max:255',
                Rule::unique('users')->ignore($user->id),
            ],
        ])->validateWithBag('updateProfileInformation');

        if(isset($input['avatar'])) {
          $path = $input['avatar']->store('public/user');
          $path = str_replace('public', '/storage', $path);
          $fileURL = url('') . $path;
          $input['avatar'] = $fileURL;
        } else {
          $input['avatar'] = $user->photoURL;
        }
        if ($input['email'] !== $user->email &&
            $user instanceof MustVerifyEmail) {
            $this->updateVerifiedUser($user, $input);
        } else {
            $user->forceFill([
                'name' => $input['name'],
                'username' => $input['username'],
                'photoURL' => $input['avatar'],
                'email' => $input['email'],
            ])->save();
        }
    }

    /**
     * Update the given verified user's profile information.
     *
     * @param  mixed  $user
     * @param  array  $input
     * @return void
     */
    protected function updateVerifiedUser($user, array $input)
    {
        $user->forceFill([
            'name' => $input['name'],
            'username' => $input['username'],
            'photoURL' => $input['avatar'],
            'email' => $input['email'],
            'email_verified_at' => null,
        ])->save();

        $user->sendEmailVerificationNotification();
    }
}
