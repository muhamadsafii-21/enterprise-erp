<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\GoodsReceiptController;
use App\Http\Controllers\PurchaseInvoiceController;
use App\Http\Controllers\StockMovementController;
use App\Http\Controllers\SalesOrderController;
use App\Http\Controllers\PurchaseOrderController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\SalesInvoiceController;
use App\Http\Controllers\DeliveryOrderController;
use App\Http\Controllers\PurchaseReturnController;
use App\Http\Controllers\SalesReturnController;
use App\Http\Controllers\ExpenseController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\EmployeeController; // <--- JANGAN LUPA IMPORT UserController INI
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    if (Auth::check()) {
        return redirect()->route('dashboard');
    }
    return redirect()->route('login');
});

/*
|--------------------------------------------------------------------------
| Authenticated ERP Routes
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified'])->group(function () {

    // --- DASHBOARD ---
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // --- USER PROFILE ---
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::post('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');


    // --- MODUL INVENTORY & GUDANG ---
    Route::middleware(['role:super-admin|inventory'])->group(function () {
        Route::resource('products', ProductController::class);
        Route::resource('goods-receipts', GoodsReceiptController::class);
        Route::get('/stock-movements', [StockMovementController::class, 'index'])->name('stock-movements.index');
    });


    // --- MODUL SALES / PENJUALAN ---
    Route::middleware(['role:super-admin|sales'])->group(function () {
        Route::resource('customers', CustomerController::class);
        Route::patch('/customers/{customer}/notes', [CustomerController::class, 'updateNotes'])->name('customers.update-notes');

        Route::resource('sales-orders', SalesOrderController::class);
        Route::resource('delivery-orders', DeliveryOrderController::class)->except(['edit', 'update', 'destroy']);
        Route::patch('/delivery-orders/{deliveryOrder}/status', [DeliveryOrderController::class, 'updateStatus'])->name('delivery-orders.update-status');

        Route::get('/sales-invoices', [SalesInvoiceController::class, 'index'])->name('sales-invoices.index');
        Route::get('/sales-invoices/create/{salesOrder?}', [SalesInvoiceController::class, 'create'])->name('sales-invoices.create');
        Route::post('/sales-invoices', [SalesInvoiceController::class, 'store'])->name('sales-invoices.store');
        Route::get('/sales-invoices/{sales_invoice}', [SalesInvoiceController::class, 'show'])->name('sales-invoices.show');
        Route::post('/sales-invoices/{sales_invoice}/payments', [SalesInvoiceController::class, 'storePayment'])->name('sales-invoices.payments.store');

        Route::resource('sales-returns', SalesReturnController::class);
    });


    // --- MODUL PURCHASE / PEMBELIAN & FINANCE ---
    Route::middleware(['role:super-admin|finance'])->group(function () {
        Route::resource('suppliers', SupplierController::class);

        Route::resource('purchase-orders', PurchaseOrderController::class)->only(['index', 'create', 'store', 'show']);
        Route::post('/purchase-orders/{id}/payments', [PurchaseOrderController::class, 'storePayment'])->name('purchase-orders.payments.store');

        Route::patch('/purchase-invoices/{id}/pay', [PurchaseInvoiceController::class, 'markAsPaid'])->name('purchase-invoices.pay');
        Route::resource('purchase-invoices', PurchaseInvoiceController::class);
        Route::post('/purchase-invoices/{id}/payments', [PurchaseInvoiceController::class, 'storePayment'])->name('purchase-invoices.payments.store');

        Route::resource('purchase-returns', PurchaseReturnController::class)->only(['index', 'create', 'store', 'show']);
        Route::resource('expenses', ExpenseController::class);

        // --- REPORTS ---
        Route::get('/reports/stock-card', [ReportController::class, 'stockCard'])->name('reports.stock-card');
        Route::get('/reports/accounts-payable', [ReportController::class, 'accountsPayable'])->name('reports.accounts-payable');
        Route::get('/reports/profit-and-loss', [ReportController::class, 'profitAndLoss'])->name('reports.profit-and-loss');
        Route::get('/reports/profit-and-loss/pdf', [ReportController::class, 'exportPdf'])->name('reports.profit-and-loss.pdf');
    });


    // --- USER MANAGEMENT & EMPLOYEES (Khusus Super Admin) ---
    Route::middleware(['role:super-admin'])->group(function () {
        // User Management
        Route::get('/users', [UserController::class, 'index'])->name('users.index');
        Route::post('/users', [UserController::class, 'store'])->name('users.store');
        Route::patch('/users/{user}', [UserController::class, 'update'])->name('users.update');

        // Employee Management (Menggunakan EmployeeController yang baru)
        Route::get('/employees', [EmployeeController::class, 'index'])->name('employees.index');
        Route::get('/employees/create', [EmployeeController::class, 'create'])->name('employees.create');
        Route::post('/employees', [EmployeeController::class, 'store'])->name('employees.store');
        Route::get('/employees/{employee}', [EmployeeController::class, 'show'])->name('employees.show');
        Route::get('/employees/{employee}/edit', [EmployeeController::class, 'edit'])->name('employees.edit');
        Route::put('/employees/{employee}', [EmployeeController::class, 'update'])->name('employees.update');
        Route::delete('/employees/{employee}', [EmployeeController::class, 'destroy'])->name('employees.destroy');
    });
}); // <--- PENUTUP UTAMA Route::middleware(['auth', 'verified'])

require __DIR__ . '/auth.php';
