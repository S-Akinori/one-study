<?php

namespace App\Http\Controllers;

use App\Models\Tag;
use Illuminate\Http\Request;

class TagController extends Controller
{
    public function index()
    {
      // get only tag name and post ids
      $tags = Tag::get()->sortByDesc('count')->take(100);
      return $tags;
    }

    public function store(Request $request) {
      foreach($request->tags as $key => $value) {
        $tag = Tag::where('name', $value)->first();
        if(!$tag) { // if does not exist, create new one
          Tag::create([
            'name' => $value,
            'post_ids' => [$request->post_id],
            'count' => 1
          ]);
        } else { // update the post_ids
          if(in_array($request->post_id, $tag->post_ids)) {
            array_push($tag->post_ids, $request->post_id);
          }
          $tag->count = $tag->count++;
          $tag->save();
        }
      }
      return true;
    }

    public function update(Request $request, $id) {

    }
}
