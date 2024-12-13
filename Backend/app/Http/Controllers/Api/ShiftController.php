<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ShiftController extends Controller
{
    public function update(Request $request , $shift_id)
{

    $shift = Shift::find($shift_id);
    if(!$shift){
        return response()->json([
                    'message' => 'shift not found'
                ], 404);
    }

    $rules = [
 
       'amount' => 'required|numeric|min:0',

        'total_payed_online' => 'required|numeric|min:0',
        'total_client_deposit' => 'required|numeric|min:0',

        'online_payments' => 'nullable|array',
        'online_payments.*.amount' => 'required|numeric|min:0',
        'online_payments.*.client_name' => 'nullable|string|max:255',
        'online_payments.*.image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',

        'client_counters' => 'nullable|array',
        'client_counters.*.account_id' => 'required|exists:accounts,id',
        'client_counters.*.amount' => 'required|numeric|min:0',
        'client_counters.*.image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
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

$machine = Machine::find($shift->machine_id);
if (!$machine){
    return response()->json([
        'message' => 'machine not found'
    ], 404);
}

$product = Product::find($machine->product_id);
if (!$product){
    return response()->json([
        'message' => 'product not found'
    ], 404);
}


$totalOnline = $shift->total_payed_online;
$totalCustomer = $shift->total_client_deposit;
   
    if ($request->has('online_payments')) {
        foreach ($request->online_payments as $payment) {

        
            $image_path = '';  
            if (isset($payment['image']) && $payment['image']->isValid()) {
                $image = $payment['image'];
                $image_path = $image->store('shiftOnlinePaymentImages', 'uploads'); 
                $image_path = asset('uploads/' . $image_path);
            }

             $_payment = new OnlinePayment();

            $_payment->shift_id = $shift->id;
            $_payment->amount = $payment['amount'];
            $_payment->client_name = $payment['client_name'];
            $_payment->image = $image_path;

            $_payment->save();

            $totalOnline += $payment['amount'];

        }
    }

    if ($request->has('client_counters')) {
        foreach ($request->client_counters as $counter) {
               
            $image_path = '';  
            if (isset($counter['image']) && $counter['image']->isValid()) {
                $image = $counter['image'];
                $image_path = $image->store('shiftOnlinePaymentImages', 'uploads'); 
                $image_path = asset('uploads/' . $image_path);
            }

             $payment = new ClientCounter();

            $payment->shift_id = $shift->id;
            $payment->account_id = $counter['account_id'];
            $payment->amount = $counter['amount'];
            $payment->image = $image_path;
            $payment->save();
            $totalCustomer += $counter['amount'];
        }
    }
  
    

    $shift->total_payed_online = $totalOnline; 
     $shift->total_client_deposit =$totalCustomer ;
     $shift->amount += $data['amount'];
     $shift->save();
    return response()->json([
        'success' => true,
        'message' => 'Shift created successfully',
        'data' => new ShiftResource($shift->load('onlinePayments', 'clientCounters')),
    ]);
}



public function closeShift($shift_id)
{

    $shift = Shift::find($shift_id);
    if(!$shift){
        return response()->json([
                    'message' => 'shift not found'
                ], 404);
    }

    $rules = [
 
       'amount' => 'required|numeric|min:0',

        'total_payed_online' => 'required|numeric|min:0',
        'total_client_deposit' => 'required|numeric|min:0',

        'online_payments' => 'nullable|array',
        'online_payments.*.amount' => 'required|numeric|min:0',
        'online_payments.*.client_name' => 'nullable|string|max:255',
        'online_payments.*.image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',

        'client_counters' => 'nullable|array',
        'client_counters.*.account_id' => 'required|exists:accounts,id',
        'client_counters.*.amount' => 'required|numeric|min:0',
        'client_counters.*.image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
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

$machine = Machine::find($shift->machine_id);
if (!$machine){
    return response()->json([
        'message' => 'machine not found'
    ], 404);
}

$product = Product::find($machine->product_id);
if (!$product){
    return response()->json([
        'message' => 'product not found'
    ], 404);
}


$totalOnline = $shift->total_payed_online;
$totalCustomer = $shift->total_client_deposit;
   
    if ($request->has('online_payments')) {
        foreach ($request->online_payments as $payment) {

        
            $image_path = '';  
            if (isset($payment['image']) && $payment['image']->isValid()) {
                $image = $payment['image'];
                $image_path = $image->store('shiftOnlinePaymentImages', 'uploads'); 
                $image_path = asset('uploads/' . $image_path);
            }

             $_payment = new OnlinePayment();

            $_payment->shift_id = $shift->id;
            $_payment->amount = $payment['amount'];
            $_payment->client_name = $payment['client_name'];
            $_payment->image = $image_path;

            $_payment->save();

            $totalOnline += $payment['amount'];

        }
    }

    if ($request->has('client_counters')) {
        foreach ($request->client_counters as $counter) {
               
            $image_path = '';  
            if (isset($counter['image']) && $counter['image']->isValid()) {
                $image = $counter['image'];
                $image_path = $image->store('shiftOnlinePaymentImages', 'uploads'); 
                $image_path = asset('uploads/' . $image_path);
            }

             $payment = new ClientCounter();

            $payment->shift_id = $shift->id;
            $payment->account_id = $counter['account_id'];
            $payment->amount = $counter['amount'];
            $payment->image = $image_path;
            $payment->save();
            $totalCustomer += $counter['amount'];
        }
    }
  
    

    $shift->total_payed_online = $totalOnline; 
     $shift->total_client_deposit =$totalCustomer ;
     $shift->amount += $data['amount'];
     $shift->save();
    return response()->json([
        'success' => true,
        'message' => 'Shift created successfully',
        'data' => new ShiftResource($shift->load('onlinePayments', 'clientCounters')),
    ]);
}



public function store(Request $request)
{

    $rules = [
        'user_id' => 'required|exists:users,id',
        'opening_image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        'opening_amount' => 'required|numeric|min:0',
        // 'ending_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        // 'ending_amount' => 'nullable|numeric|min:0',
        'shift' => 'required|in:1,2',
        'machine_id'=>'required|exists:machines,id',
        // 'status' => 'required|in:open,closed',
        // 'amount' => 'required|numeric|min:0',
        // 'total_money' => 'required|numeric|min:0',
        // 'total_cash' => 'required|numeric|min:0',
        // 'total_payed_online' => 'required|numeric|min:0',
        // 'total_client_deposit' => 'required|numeric|min:0',
        'date' => 'required|date',        
        // 'online_payments' => 'nullable|array',
        // 'online_payments.*.amount' => 'required|numeric|min:0',
        // 'online_payments.*.client_name' => 'nullable|string|max:255',
        // 'online_payments.*.image' => 'nullable|string|max:255',

        // 'client_counters' => 'nullable|array',
        // 'client_counters.*.account_id' => 'required|exists:accounts,id',
        // 'client_counters.*.amount' => 'required|numeric|min:0',
        // 'client_counters.*.image' => 'nullable|string|max:255',
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

// $machine = Machine::find($data['machine_id']);
// $product = Product::find($machine->product_id);
// if (!$product){
//     return response()->json([
//         'message' => 'product not found'
//     ], 404);
// }


$open_path = '';
if(request()->hasFile("opening_image")){
    $image = request()->file("opening_image");
    $open_path=$image->store('shiftOpenImages','uploads');
    $open_path= asset('uploads/' . $open_path); 
}
// $close_path = '';
// if(request()->hasFile("ending_image")){
//     $image = request()->file("ending_image");
//     $close_path=$image->store('shiftCloseImages','uploads');
//     $close_path= asset('uploads/' . $close_path); 
// }





// $totalAmount = $data['opening_amount'] - $data['ending_amount'];
// $totalCash = 0;
// $totalOnline = 0;
// $totalCustomer = 0;
    $shift = new Shift();

    $shift->user_id = $data['user_id'];
    $shift->opening_image = $open_path;
    $shift->opening_amount= $data['opening_amount'];
    $shift->ending_image= null;
    $shift->ending_amount= 0;

    $shift->shift= $data['shift'];
    $shift->date= $data['date'];

    $shift->status= 'open';
    $shift->amount= 0;
    $shift->total_money= 0;
    $shift->total_cash= 0;
    $shift->total_payed_online= 0;
    $shift->total_client_deposit= 0;
    $shift->save();

    return response()->json([
        'success' => true,
        'message' => 'Shift created successfully',
        'data' => new ShiftResource($shift->load('onlinePayments', 'clientCounters')),
    ]);
}





}
