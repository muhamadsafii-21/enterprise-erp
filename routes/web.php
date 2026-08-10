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
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/



// Ubah root URL agar langsung redirect ke login
Route::get('/', function () {
    // Jika user sudah login, langsung lempar ke dashboard
    if (Auth::check()) {
        return redirect()->route('dashboard');
    }

    // Jika belum login, langsung lempar ke halaman login
    return redirect()->route('login');
});

/*
|--------------------------------------------------------------------------
| Authenticated ERP Routes
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified'])->group(function () {

    // --- DASHBOARD ---
    Route::get('/dashboard', [DashboardController::class, 'index'])
        ->middleware(['auth', 'verified'])
        ->name('dashboard');

    //customer

    Route::resource('customers', CustomerController::class);

    // --- USER PROFILE ---
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // --- MODULE 1: PRODUCTS & INVENTORY ---
    Route::resource('products', ProductController::class);

    // --- MODULE 2: GOODS RECEIPTS (GUDANG) ---
    Route::resource('goods-receipts', GoodsReceiptController::class);

    // --- MODULE 3: PURCHASE INVOICES (KEUANGAN/SUPPLIER) ---
    Route::patch('/purchase-invoices/{id}/pay', [PurchaseInvoiceController::class, 'markAsPaid'])->name('purchase-invoices.pay');
    Route::resource('purchase-invoices', PurchaseInvoiceController::class);

    // --- MODULE 4: STOCK MOVEMENTS (MUTASI STOK) ---
    Route::get('/stock-movements', [StockMovementController::class, 'index'])->name('stock-movements.index');

    // sales order
    Route::resource('sales-orders', SalesOrderController::class);

    //purchase order
    Route::middleware(['auth', 'verified'])->group(function () {
        Route::resource('purchase-orders', PurchaseOrderController::class)->only(['index', 'create', 'store', 'show']);
    });

    //supplier
    Route::resource('suppliers', SupplierController::class);

    //purchase payment
    Route::post('/purchase-orders/{id}/payments', [PurchaseOrderController::class, 'storePayment'])->name('purchase-orders.payments.store');
    Route::post('/purchase-invoices/{id}/payments', [PurchaseInvoiceController::class, 'storePayment'])->name('purchase-invoices.payments.store');


    // Route untuk Laporan Utang Usaha
    Route::get('/reports/accounts-payable', [ReportController::class, 'accountsPayable'])->name('reports.accounts-payable');
    Route::get('/reports/profit-and-loss', [ReportController::class, 'profitAndLoss'])->name('reports.profit-and-loss');

    //sales invoices

    // --- SALES INVOICES ---

    Route::get('/sales-invoices', [SalesInvoiceController::class, 'index'])->name('sales-invoices.index');

    // Rute create sekarang mendukung opsional (bisa dari tombol umum atau dari sales order)
    Route::get('/sales-invoices/create/{salesOrder?}', [SalesInvoiceController::class, 'create'])->name('sales-invoices.create');

    Route::post('/sales-invoices', [SalesInvoiceController::class, 'store'])->name('sales-invoices.store');
    Route::get('/sales-invoices/{sales_invoice}', [SalesInvoiceController::class, 'show'])->name('sales-invoices.show');

    // Sales payment
    Route::post('/sales-invoices/{sales_invoice}/payments', [SalesInvoiceController::class, 'storePayment'])->name('sales-invoices.payments.store');


    //sales payment
    Route::post('/sales-invoices/{sales_invoice}/payments', [SalesInvoiceController::class, 'storePayment'])->name('sales-invoices.payments.store');

    // Route Delivery Orders
    Route::resource('delivery-orders', DeliveryOrderController::class)->except(['edit', 'update', 'destroy']);
});

require __DIR__ . '/auth.php';
