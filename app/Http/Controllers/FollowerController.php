<?php

namespace App\Http\Controllers;

use App\Models\Follower;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FollowerController extends Controller
{
    //
    public function indexOfFollowings($id) {
      $followers = Follower::where('following_id', $id)->get('followed_id');
      $follower_ids = [];
      foreach($followers as $key => $value) {
        $follower_ids[] = $value->followed_id;
      }
      $followers = User::whereIn('id', $follower_ids)->get();
      return $followers;
    }
    public function indexOfFollowers($id) {
      $followers = Follower::where('followed_id', $id)->get('following_id');
      $follower_ids = [];
      foreach($followers as $key => $value) {
        $follower_ids[] = $value->following_id;
      }
      $followers = User::whereIn('id', $follower_ids)->get();
      return $followers;
    }

    public function show($following_id, $followed_id) {
      $follower = Follower::where('following_id', $following_id)->where('followed_id', $followed_id)->get();
      return $follower;
    }

    public function follow(Request $request, $id) {
      $follower = Follower::where('following_id', Auth::user()->id)->where('followed_id', $id)->first();
      // if not following the user, follow them
      if(!$follower) {
        $follower = Follower::create([
          'following_id' => Auth::user()->id,
          'followed_id' => $id
        ]);
        return ['follower' => $follower, 'status' => 'created'];
      } else { // if not, unfollow the user
        $follower->delete();
        return ['follower' => $follower, 'status' => 'deleted'];
      }
    }
}