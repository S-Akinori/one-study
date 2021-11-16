<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
      $posts = Post::ofFilter($request)->get();
      $posts_with_user = [];
      foreach($posts as $post) {
        $posts_with_user[] = ['post' => $post, 'user' => $post->user];
      }
      return $posts_with_user;
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $request->validate([
          'title' => 'required|string|max:50',
          'content' => 'required|string',
          'file' => 'file|max:2000000|mimes:jpg,png,gif',
          'category' => 'required|string',
        ]);
        $path = $request->file('file')->store('public/files');
        $path = str_replace('public', '/storage', $path);
        $fileURL = url('') . $path;
        $tags = json_decode($request->tags) ? json_decode($request->tags, true) : $request->tags;
        $post = Post::create([
          'user_id' => Auth::user()->id,
          'title' => $request->title,
          'content' => $request->content,
          'fileURL' => $fileURL,
          'tags' => $tags,
          'category' => $request->category,
        ]);

        $user = User::find($post->user_id);
        $user->postTotal++;
        $user->save();

        return $post;
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
        $post = Post::find($id);
        return ['post' => $post, 'user' => $post->user, 'comments' => $post->comments];
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $post = Post::find($id);
        foreach($request->all() as $key => $value) {
          $post->$key = $value;
        }
        $post->save();

        return $post;
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
