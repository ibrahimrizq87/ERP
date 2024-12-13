<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');
use App\Http\Controllers\Api\AuthController;

Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

Route::post('/users/add-user', [AuthController::class, 'addUser'])->middleware('auth:sanctum');
Route::put('/users/update-user/{id}', [AuthController::class, 'updateUser'])->middleware('auth:sanctum');
Route::delete('/users/delete-user/{id}', [AuthController::class, 'deleteUser'])->middleware('auth:sanctum');
Route::get('/users/get-user/{id}', [AuthController::class, 'getUser'])->middleware('auth:sanctum');

Route::get('/users/get-users', [AuthController::class, 'getAllUsers'])->middleware('auth:sanctum');
Route::get('/users/get-users/{role}', [AuthController::class, 'getAllUsersByRole'])->middleware('auth:sanctum');

