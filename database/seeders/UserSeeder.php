<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Admin User (Full Access)
        User::updateOrCreate(['email' => 'admin@resto.com'], [
            'name' => 'System Admin',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'pin' => '9999'
        ]);

        // Manager (Manage Menu, Reports)
        User::updateOrCreate(['email' => 'manager@resto.com'], [
            'name' => 'Restaurant Manager',
            'password' => Hash::make('password'),
            'role' => 'manager',
            'pin' => '8888'
        ]);

        // Cashier (POS Access)
        User::updateOrCreate(['email' => 'cashier@resto.com'], [
            'name' => 'Main Cashier',
            'password' => Hash::make('password'),
            'role' => 'cashier',
            'pin' => '1234'
        ]);

        // Chef (Kitchen Display Access)
        User::updateOrCreate(['email' => 'chef@resto.com'], [
            'name' => 'Head Chef',
            'password' => Hash::make('password'),
            'role' => 'kitchen_staff',
            'pin' => '5678'
        ]);

        // Waiter (Mobile Access)
        User::updateOrCreate(['email' => 'waiter@resto.com'], [
            'name' => 'Waiter John',
            'password' => Hash::make('password'),
            'role' => 'waiter',
            'pin' => '0000'
        ]);
    }
}
