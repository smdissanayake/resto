<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('LoginPage');
})->name('login');

Route::get('/pos', function () {
    return Inertia::render('POSInterface');
})->name('pos');

Route::get('/dashboard', function () {
    return Inertia::render('AnalyticsDashboard');
})->name('dashboard');

Route::get('/inventory', function () {
    return Inertia::render('InventoryManagement');
})->name('inventory');

Route::get('/tables', function () {
    return Inertia::render('TableManagement');
})->name('tables');

Route::get('/kitchen', function () {
    return Inertia::render('KitchenDisplay');
})->name('kitchen');

Route::get('/staff', function () {
    return Inertia::render('StaffShiftManagement');
})->name('staff');
