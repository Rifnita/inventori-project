<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\IncomingItemController;
use App\Http\Controllers\OutgoingItemController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\LaporanController;
use App\Http\Controllers\UserController;

// Public routes
Route::get('/', function () {
    return response()->json([
        'message' => 'Selamat datang di API Inventori',
        'version' => '1.0.0',
        'status' => 'active'
    ]);
});

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);
    Route::post('/change-password', [AuthController::class, 'changePassword']);
    
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index']);
    

    // Products (Barang)
    Route::apiResource('products', ProductController::class);
    Route::get('/products-categories', [ProductController::class, 'categories']);

    // Users (Staff Management)
    Route::apiResource('users', UserController::class);

    // Incoming Items (Barang Masuk)
    Route::apiResource('incoming-items', IncomingItemController::class);

    // Outgoing Items (Barang Keluar)
    Route::apiResource('outgoing-items', OutgoingItemController::class);

    // Reports (Laporan)
    Route::prefix('reports')->group(function () {
        Route::get('/stock', [LaporanController::class, 'stock']);
        Route::get('/incoming', [LaporanController::class, 'incoming']);
        Route::get('/outgoing', [LaporanController::class, 'outgoing']);
        Route::get('/summary', [LaporanController::class, 'summary']);
    });
});
