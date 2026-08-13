<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolePermissionSeeder extends Seeder
{
    public function run()
    {
        // 1. Buat Roles
        $admin = Role::create(['name' => 'super-admin']);
        $sales = Role::create(['name' => 'sales']);
        $inventory = Role::create(['name' => 'inventory']);
        $finance = Role::create(['name' => 'finance']);

        // 2. Buat Permission (Opsional tapi sangat disarankan)
        Permission::create(['name' => 'view-sales']);
        Permission::create(['name' => 'create-sales']);

        // 3. Berikan permission ke role
        $sales->givePermissionTo(['view-sales', 'create-sales']);

        // Admin dapat semua
        $admin->givePermissionTo(Permission::all());
    }
}
