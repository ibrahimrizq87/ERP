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
use App\Http\Controllers\MainShiftController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\SalesInvoiceController;



Route::get('reports/expense-invoice-reports', [ReportsController::class , 'getExpenseInvoicesReports'])->middleware('auth:sanctum');
Route::get('reports/purchase-invoice-reports', [ReportsController::class , 'getPurchaseInvoicesReports'])->middleware('auth:sanctum');
Route::get('reports/shifts-reports', [ReportsController::class , 'getShiftsReports'])->middleware('auth:sanctum');
Route::get('reports/sales-invoice-reports', [ReportsController::class , 'getSalesInvoicesReports'])->middleware('auth:sanctum');
Route::get('reports/product-reports', [ReportsController::class , 'getProductsReports'])->middleware('auth:sanctum');

Route::delete('main-shifts/{id}', [MainShiftController::class , 'deletShift'])->middleware('auth:sanctum');



Route::put('main-shifts/update/{shift_id}', [MainShiftController::class , 'update'])->middleware('auth:sanctum');
Route::get('sales-invoices/by-shift/{shift_id}', [SalesInvoiceController::class , 'getByShift'])->middleware('auth:sanctum');
Route::put('sales-invoices/{id}', [SalesInvoiceController::class , 'update'])->middleware('auth:sanctum');
Route::delete('sales-invoices/{id}', [SalesInvoiceController::class , 'delete'])->middleware('auth:sanctum');
Route::post('sales-invoices', [SalesInvoiceController::class , 'store'])->middleware('auth:sanctum');
Route::get('sales-invoices', [SalesInvoiceController::class , 'index'])->middleware('auth:sanctum');
Route::get('sales-invoices/{id}', [SalesInvoiceController::class , 'show'])->middleware('auth:sanctum');




Route::post('settings', [SettingController::class , 'update']);
Route::get('settings', [SettingController::class , 'getAllSettings']);
Route::get('main-shifts/get-shift-by-id/{shift_id}', [MainShiftController::class , 'getShiftById'])->middleware('auth:sanctum');

Route::get('main-shifts/get-shifts-by-status/{status}', [MainShiftController::class , 'getAllShiftsByStatus'])->middleware('auth:sanctum');
Route::get('main-shifts/get-my-shifts', [MainShiftController::class , 'getMyAllOldShifts'])->middleware('auth:sanctum');
Route::get('main-shifts/close-shift/{shift_id}', [MainShiftController::class , 'closeShift'])->middleware('auth:sanctum');
Route::get('main-shifts/approve-shift/{shift_id}', [MainShiftController::class , 'ApproveShift'])->middleware('auth:sanctum');



Route::get('machines/get-machines-by-product/{product_id}', [MachineController::class , 'getMachineByProduct'])->middleware('auth:sanctum');

Route::post('main-shifts', [MainShiftController::class , 'store'])->middleware('auth:sanctum');
Route::get('main-shifts/get_my_shift', [MainShiftController::class , 'getMyShift'])->middleware('auth:sanctum');

Route::delete('shifts/delete-online-client/{item_id}', [ShiftController::class , 'deleteOnlineClient']);

Route::delete('shifts/delete-online-payment/{item_id}', [ShiftController::class , 'deleteOnlinePayment']);
Route::get('equation_history/get-last-base-calculation', [EquationHistoryController::class, 'getLastBaseCalculation']);

// Route::get('equation_history/get-last-base-calculation', [AccountController::class , 'getLastBaseCalculation']);
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
