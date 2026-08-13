<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    protected $fillable = [
    'user_id', 'nip', 'full_name', 'phone_number', 'gender', 
    'birth_date', 'job_title', 'department', 'join_date', 'status', 'profile_photo'
];

public function user() {
    return $this->belongsTo(User::class);
}
}