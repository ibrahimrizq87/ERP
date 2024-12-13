<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ShiftController extends Controller
{
    public function store(Request $request)
{

    $rules = [
        'user_id' => 'required|exists:users,id',
        'opening_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        'opening_amount' => 'required|numeric|min:0',
        'ending_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        'ending_amount' => 'nullable|numeric|min:0',
        'shift' => 'required|in:1,2',
        'status' => 'required|in:open,closed',
        'amount' => 'required|numeric|min:0',
        'total_money' => 'required|numeric|min:0',
        'total_cash' => 'required|numeric|min:0',
        'total_payed_online' => 'required|numeric|min:0',
        'total_client_deposit' => 'required|numeric|min:0',
        
        'online_payments' => 'nullable|array',
        'online_payments.*.amount' => 'required|numeric|min:0',
        'online_payments.*.client_name' => 'nullable|string|max:255',
        'online_payments.*.image' => 'nullable|string|max:255',

        'client_counters' => 'nullable|array',
        'client_counters.*.account_id' => 'required|exists:accounts,id',
        'client_counters.*.amount' => 'required|numeric|min:0',
        'client_counters.*.image' => 'nullable|string|max:255',
    ];


    $validator = Validator::make($request->all(), $rules);


    if ($validator->fails()) {
        return response()->json([
            'success' => false,
            'message' => 'Validation failed',
            'errors' => $validator->errors(),
        ], 422);
    }

$data = $validator->validated();
    $shift = new Shift();
    
    $shift->user_id = $data['user_id'];
    $shift->opening_image = $data['opening_image'];
    $shift->opening_amount= $data['opening_amount'];
    $shift->ending_image= $data['opening_amount'];
    $shift->ending_amount= $data['opening_amount'];
    $shift->shift= $data['opening_amount'];
    $shift->status= $data['opening_amount'];
    $shift->amount= $data['opening_amount'];
    $shift->total_money= $data['opening_amount'];
    $shift->total_cash= $data['opening_amount'];
    $shift->total_payed_online= $data['opening_amount'];
    $shift->total_client_deposit= $data['opening_amount'];
    
// to be complete 
    // Save related online payments
    if ($request->has('online_payments')) {
        foreach ($request->online_payments as $payment) {
            $shift->onlinePayments()->create($payment);
        }
    }

    // Save related client counters
    if ($request->has('client_counters')) {
        foreach ($request->client_counters as $counter) {
            $shift->clientCounters()->create($counter);
        }
    }

    return response()->json([
        'success' => true,
        'message' => 'Shift created successfully',
        'data' => new ShiftResource($shift->load('onlinePayments', 'clientCounters')),
    ]);
}

}
