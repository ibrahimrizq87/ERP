<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('shifts', function (Blueprint $table) {
            $table->string('opening_image')->change();
            $table->string('ending_image')->nullable()->change();

  });
}
    

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('shifts', function (Blueprint $table) {
            $table->string('opening_image',10,2)->change();
            $table->string('ending_image',10,2)->nullable()->change();
        });
    }
};
