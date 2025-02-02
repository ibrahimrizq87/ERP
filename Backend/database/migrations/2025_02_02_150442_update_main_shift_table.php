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
         Schema::table('main_shifts', function (Blueprint $table) {
            $table->dropColumn('online_image'); 
            $table->decimal('total_tax', 15, 6); 

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('main_shifts', function (Blueprint $table) {
            $table->string('online_image')->nullable(); 
            $table->dropColumn('total_tax'); 

        });
    }
};
