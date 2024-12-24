<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MachineController;
use App\Http\Controllers\Api\ShiftController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\Api\AccountController;
use App\Http\Controllers\Api\PaymentDocumentController;



Route::get('accounts/customer-accounts', [AccountController::class , 'getCustomerAccounts']);
Route::get('accounts/company-accounts', [AccountController::class , 'getCompanyAccount']);

Route::get('shifts/approve/{shift_id}', [ShiftController::class , 'approveShift']);

Route::get('payment-documents/by-type/{type}', [PaymentDocumentController::class , 'getByType']);

Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::post('/users/add-user', [AuthController::class, 'addUser'])->middleware('auth:sanctum');
Route::put('/users/update-user/{id}', [AuthController::class, 'updateUser'])->middleware('auth:sanctum');
Route::delete('/users/delete-user/{id}', [AuthController::class, 'deleteUser'])->middleware('auth:sanctum');
Route::get('/users/get-user/{id}', [AuthController::class, 'getUser'])->middleware('auth:sanctum');

Route::get('/users/get-users', [AuthController::class, 'getAllUsers'])->middleware('auth:sanctum');
Route::get('/users/get-users/{role}', [AuthController::class, 'getAllUsersByRole'])->middleware('auth:sanctum');
Route::apiResource('products', ProductController::class);
Route::apiResource('payment_documents', PaymentDocumentController::class)->middleware('auth:sanctum');

Route::apiResource('shifts', ShiftController::class);
Route::put('shifts/closeShift/{shift_id}', [ShiftController::class , 'closeShift']);
Route::apiResource('machines', MachineController::class);
Route::get('accounts/main', [AccountController::class , 'mainAccount']);
Route::apiResource('accounts', AccountController::class);
Route::get('accounts/by-parent/{parent_id}', [AccountController::class , 'getAccountsByParent']);





Route::get('accounts/get-parent/{id}', [AccountController::class , 'getAccountById']);

