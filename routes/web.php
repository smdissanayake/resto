<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


// 1. PUBLIC ROUTES
Route::get('/', function () {
    return Inertia::render('Welcome');
})->name('welcome');

Route::get('/login', function () {
    return Inertia::render('LoginPage');
})->name('login');

use App\Http\Controllers\AuthController;
Route::post('/login', [AuthController::class, 'login'])->name('auth.login');
Route::post('/logout', [AuthController::class, 'logout'])->name('auth.logout');

// 2. PROTECTED ROUTES
Route::middleware(['auth'])->group(function () {
    
    // --- ADMIN & MANAGER (Full Access) ---
    Route::middleware(['role:admin,manager'])->group(function () {
        
        // Dashboard
        Route::get('/dashboard', [App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');
        
        // Inventory Management
        Route::resource('products', App\Http\Controllers\ProductController::class);
        Route::get('/inventory', [App\Http\Controllers\InventoryController::class, 'index'])->name('inventory');
        Route::post('/inventory', [App\Http\Controllers\InventoryController::class, 'store'])->name('inventory.store');
        Route::put('/inventory/{id}', [App\Http\Controllers\InventoryController::class, 'update'])->name('inventory.update');
        Route::delete('/inventory/{id}', [App\Http\Controllers\InventoryController::class, 'destroy'])->name('inventory.destroy');

        // Wastage Management
        Route::post('/inventory/wastage', [App\Http\Controllers\WastageController::class, 'store'])->name('wastage.store');
        Route::get('/inventory/wastage', [App\Http\Controllers\WastageController::class, 'index'])->name('wastage.index');

        // Staff Management
        Route::resource('staff', App\Http\Controllers\StaffController::class)->only(['index', 'store', 'update', 'destroy']);

        // Reports
        Route::get('/reports/export', [App\Http\Controllers\ReportController::class, 'export'])->name('reports.export');
        Route::get('/reports', [App\Http\Controllers\ReportController::class, 'index'])->name('reports');

        // Settings (Admin Only ideally, but Manager ok for now)
        Route::get('/settings', [App\Http\Controllers\SettingController::class, 'index'])->name('settings.index');
        Route::post('/settings', [App\Http\Controllers\SettingController::class, 'update'])->name('settings.update');
    });

    // --- POS ACCESS (Admin, Manager, Cashier, Waiter) ---
    Route::middleware(['role:admin,manager,cashier,waiter'])->group(function () {
        Route::get('/pos', [App\Http\Controllers\POSController::class, 'index'])->name('pos');
        Route::post('/pos/order', [App\Http\Controllers\POSController::class, 'store'])->name('pos.store');
        Route::post('/pos/orders/{id}/cancel', [App\Http\Controllers\POSController::class, 'cancel'])->name('pos.cancel');
        
        // Table Management
        Route::get('/tables', [App\Http\Controllers\TableController::class, 'index'])->name('tables');
        Route::post('/tables', [App\Http\Controllers\TableController::class, 'store'])->name('tables.store');
        Route::put('/tables/{id}', [App\Http\Controllers\TableController::class, 'update'])->name('tables.update');
        Route::delete('/tables/{id}', [App\Http\Controllers\TableController::class, 'destroy'])->name('tables.destroy');
        Route::post('/tables/{id}/settle', [App\Http\Controllers\TableController::class, 'settle'])->name('tables.settle');
        Route::post('/tables/{id}/move', [App\Http\Controllers\TableController::class, 'moveOrder'])->name('tables.move');
    });

    // --- KITCHEN ACCESS (Admin, Manager, Kitchen) ---
    Route::middleware(['role:admin,manager,kitchen_staff'])->group(function () {
         Route::get('/kitchen', [App\Http\Controllers\KitchenController::class, 'index'])->name('kitchen');
         Route::put('/kitchen/{id}', [App\Http\Controllers\KitchenController::class, 'update'])->name('kitchen.update');
    });

});
