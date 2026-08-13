<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
   public function up() {
    Schema::table('employees', function (Blueprint $table) {
        // Hapus department_id (jika sebelumnya pakai integer) dan ganti ke string
        $table->dropColumn('department_id');
        $table->string('department')->after('job_title'); 
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('employees', function (Blueprint $table) {
            //
        });
    }
};