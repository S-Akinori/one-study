<?php

namespace App\Models;

use GuzzleHttp\Psr7\Request;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'title', 'content', 'fileURL', 'downloadedTotal', 'tags', 'category'];

    protected $casts = [
      'tags' => 'array'
    ];

    public function user() {
      return $this->belongsTo(User::class);
    }

    public function comments() {
      return $this->hasMany(Comment::class);
    }

    public function scopeOfFilter($query, $request) {
      if($request->ids) {
        return $this->scopeOfIds($query, $request->ids);
      } else if($request->user_id) {
        return $this->scopeOfUserId($query, $request->user_id);
      } else if($request->new) {
        return $this->scopeOfNew($query)->ofCategory($request->category)->ofTags($request->tags)->ofKeyword($request->keyword);
      } else if($request->downloadedTotal) {
        return $this->scopeOfDownloadedTotal($query)->ofCategory($request->category)->ofTags($request->tags)->ofKeyword($request->keyword);
      } else if($request->category || $request->tags) {
        return $this->scopeOfCategory($query, $request->category)->ofTags($request->tags)->ofKeyword($request->keyword);
      } else {
        return $query->ofKeyword($request->keyword);
      }
    }

    public function scopeOfIds($query, $ids) {
      $ids = explode(',', $ids);
      return $query->whereIn('id', $ids);
    }

    public function scopeOfUserId($query, $user_id) {
      return $query->where('user_id', $user_id);
    }
    public function scopeOfNew($query) {
      return $query->latest();
    }
    public function scopeOfDownloadedTotal($query) {
      return $query->orderBy('downloadedTotal', 'desc');
    }
    public function scopeOfKeyword($query, $keyword) {
      return $query->where('title', 'like', "%{$keyword}%");
    }
    public function scopeOfCategory($query, $category) {
      if($category) {
        return $query->where('category', $category);
      } else {
        return $query;
      }
    }
    public function scopeOfTags($query, $tags) {
      if($tags) {
        $tags = explode(',', $tags);
        return $query->whereJsonContains('tags', $tags);
      } else {
        return $query;
      }
    }
}