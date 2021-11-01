<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Follower extends Model
{
    use HasFactory;

    protected $fillable = [
      'following_id',
      'followed_id'
    ];

    public $timestamps = false;

    public function scopeOfFilter($query, $request) {
      if($request->following_id && $request->followed_id) {
        return $this->scopeOfFollowingId($query, $request->following_id)->ofFollowedId($request->followed_id);
      } else if($request->following_id) {
        return $this->scopeOfFollowingId($query, $request->following_id);
      } else if($request->following_id) {
        return $this->scopeOfFollowedId($query, $request->followed_id);
      } else {
        return $query;
      }
    }
    
    public function scopeOfFollowingId($query, $following_id){
      return $query->where('following_id', $following_id);
    }
    public function scopeOfFollowedId($query, $followed_id){
      return $query->where('followed_id', $followed_id);
    }
}
