<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tag extends Model
{
    use HasFactory;

    protected $fillable = [
      'name',
      'post_ids',
      'count'
    ];

    protected $casts = [
      'post_ids' => 'array'
    ];
}
