<?php

use App\Http\Controllers\FollowerController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware(['auth:sanctum', 'verified'])->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware(['auth:sanctum', 'verified'])->apiResource('/users', UserController::class);
Route::apiResource('/posts', PostController::class);

Route::post('/follow/{id}', [FollowerController::class, 'follow']);
Route::get('/followings/{id}', [FollowerController::class, 'indexOfFollowings']);
Route::get('/followers/{id}', [FollowerController::class, 'indexOfFollowers']);
Route::get('/followings/{following_id}/followers/{follower_id}', [FollowerController::class, 'show']);