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
            $table->foreignId('machine_id') 
            ->constrained('machines')
            ->onDelete('cascade');  
                $table->date('date'); 

  });
}
    

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('shifts', function (Blueprint $table) {
            $table->dropForeign(['machine_id']);
            $table->dropColumn(['machine_id' ,'date']);
        });
    }
};
