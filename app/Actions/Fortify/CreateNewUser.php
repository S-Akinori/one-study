<?php

namespace App\Actions\Fortify;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array  $input
     * @return \App\Models\User
     */
    public function create(array $input)
    {
        if($input['provider'] == 'email') {
          Validator::make($input, [
              'name' => ['string', 'max:255'],
              'email' => [
                  'required',
                  'string',
                  'email',
                  'max:255',
                  Rule::unique(User::class),
              ],
              'password' => $this->passwordRules(),
          ])->validate();
        } else if($input['provider'] == 'facebook' || $input['provider'] == 'twitter') {
          Validator::make($input, [
            'name' => ['string', 'max:255'],
            'email' => [
                'string',
                'email',
                'max:255',
                Rule::unique(User::class),
            ],
          ])->validate();
        }

        $name = '';
        if($input['name']) {
          $name = $input['name'];
        } else if($input['nickname']) {
          $name = $input['nickname'];
        }

        $username = $input['nickname'];

        if(!$name || $username) {
          $default_name = 'user_';
          for($i = 0 ; $i < 6 ; $i++) {
            $default_name .= rand(0,9);
          }
          if(!$name) {
            $name = $default_name;
          }
          if(!$username) {
            $username = $default_name;
          }
        }
  
        return User::create([
          'name' => $name,
          'username' => $input['nickname'] ? $input['nickname'] : $name,
          'email' => $input['email'],
          'password' => $input['password'] ? Hash::make($input['password']) : null,
        ]);
    }
}
