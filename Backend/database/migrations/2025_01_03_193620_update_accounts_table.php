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
        Schema::table('accounts', function (Blueprint $table) {
            $table->enum('type' , ['main' ,
             '1', // النقدية و ما فى حكمها  
             '2', // مخزون
             '3', // الذمم المدينة التجارية
             '4', // مصروفات مدفوعة مقدما
             '5', // ارصدة مدينة التجارية
             '6', // اصراف ذات علاقة مدينة
             '7', // ممتلكات و ألات و معدات صافى
             '8', // مشروعات تحت التنفيذ
             '9', // ذمم دائنة تجارية 
             '10', // اطراف ذات علاقة دائنة
             '11', // ارصدة دائنة اخرى
             '13', // المصروفات المستحقة
             '14', // قروض طويلة الاجل 
             '15', // رأس المال
             '16', // جارى الشركاء
             '17', // ارباح العام
             '18', // صافى الايرادات التشغيلية
             '19', // تكلفة الايرادات
             '20', // التكاليف التشغيلية
             '21', // مصاريف بيع و توزيع 
             '22', // مخصص اهلاك الاصول الثابته
             '23', // مصاريف ادارية و عمومية
             '24', // ايرادات اخرى
             '25', // الزكاة التقديرية
             '26', // صافى الايرادات التشخيلية
             'none'
             
             ])->change();

        });
    }




    public function down(): void
    {
        Schema::table('accounts', function (Blueprint $table) {
            // $table->dropColumn('type')->change();
            $table->enum('type' , ['main' , 'branch'])->change();

        });
    }
};
