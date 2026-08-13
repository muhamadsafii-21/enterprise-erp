<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::create('employees', function (Blueprint $table) {
        $table->id();
        $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Relasi ke tabel users
        $table->string('nip')->unique();
        $table->string('full_name');
        $table->string('phone_number')->nullable();
        $table->enum('gender', ['L', 'P']);
        $table->date('birth_date');
        $table->string('job_title');
        $table->unsignedBigInteger('department_id');
        $table->date('join_date');
        $table->enum('status', ['probation', 'active', 'resign'])->default('active');
        $table->string('profile_photo')->nullable();
        $table->timestamps();
    });
}
};