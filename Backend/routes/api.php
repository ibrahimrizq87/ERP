<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MachineController;
use App\Http\Controllers\Api\ShiftController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\Api\AccountController;
use App\Http\Controllers\Api\PaymentDocumentController;
use App\Http\Controllers\TaxRateController;
use App\Http\Controllers\PurchaseInvoiceController;
use App\Http\Controllers\ExpenseInvoiceController;
use App\Http\Controllers\ReportsController;
use App\Http\Controllers\EquationController;
use App\Http\Controllers\EquationHistoryController;



Route::get('equation_history/get-last-base-calculation', [AccountController::class , 'getLastBaseCalculation']);
Route::get('accounts/get-accounts-by-type/{type}', [AccountController::class , 'getAccountsByType']);

Route::apiResource('expense_invoices', ExpenseInvoiceController::class)->middleware('auth:sanctum');
Route::apiResource('purchase_invoices', PurchaseInvoiceController::class)->middleware('auth:sanctum');

Route::apiResource('equations', EquationController::class);
Route::apiResource('equation_history', EquationHistoryController::class);

Route::get('accounts/get-reports', [AccountController::class , 'yearReports']);

Route::post('tax_rate/update', [TaxRateController::class , 'update']);
Route::get('tax_rate/get', [TaxRateController::class , 'getTax']);

Route::get('accounts/customer-accounts', [AccountController::class , 'getCustomerAccounts']);
Route::get('accounts/company-accounts', [AccountController::class , 'getCompanyAccount']);
Route::get('accounts/expenses-accounts', [AccountController::class , 'getExpencesAccounts']);


Route::get('shifts/by-status/{status}', [ShiftController::class , 'getByStatus']);

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

Route::apiResource('shifts', ShiftController::class)->middleware('auth:sanctum');
Route::put('shifts/closeShift/{shift_id}', [ShiftController::class , 'closeShift']);
Route::apiResource('machines', MachineController::class);
Route::get('accounts/main', [AccountController::class , 'mainAccount']);
Route::apiResource('accounts', AccountController::class);
Route::get('accounts/by-parent/{parent_id}', [AccountController::class , 'getAccountsByParent']);





Route::get('accounts/get-parent/{id}', [AccountController::class , 'getAccountById']);






Route::get('/payment-by-account/{accountId}', [ReportsController::class, 'getByAccountId']);
Route::get('/purchase-invoices/{id}/by-account', [ReportsController::class, 'getAllPurchaseInvoicesByAccout']);
Route::get('/purchase-invoices/by-date', [ReportsController::class, 'getAllPurchaseInvoicesByDate']);
Route::get('/expense-invoices/by-date', [ReportsController::class, 'getAllExpenceInvoicesByDate']);
Route::get('/expense-invoices/this-year', [ReportsController::class, 'getAllExpenseInvoicesThisYear']);
Route::get('/purchase-invoices/this-year', [ReportsController::class, 'getAllPurchaseInvoicesThisYear']);
Route::get('/shift-taxes/by-date-and-year', [ReportsController::class, 'getAllShiftTaxesByDateAndYear']);
