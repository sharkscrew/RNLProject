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
        if (! Schema::hasColumn('tbl_users', 'age')) {
            Schema::table('tbl_users', function (Blueprint $table) {
                $table->integer('age')->after('birth_date');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasColumn('tbl_users', 'age')) {
            Schema::table('tbl_users', function (Blueprint $table) {
                $table->dropColumn('age');
            });
        }
    }
};
