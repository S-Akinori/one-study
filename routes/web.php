<?php

use Illuminate\Support\Facades\Route;
use Laravel\Socialite\Facades\Socialite;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Route::get('/login/{provider}', function($provider) {
//   return Socialite::driver($provider)->redirect();
// });

// Route::get('/login/{provider}/callback', function($provider) {
//   $user = Socialite::driver($provider)->user();
//   return $user;
// });

Route::get('/reset-password/{token}', function () { 
  return view('app');
})->name('password.reset');


Route::get('/{any}', function() {
  return view('app');
})->where('any', '.*');