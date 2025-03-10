<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

use Illuminate\Support\Facades\Validator;

use Illuminate\Support\Facades\DB;


use App\Http\Resources\ShiftResource;
use App\Models\ClientCounter;  
use App\Models\Shift;  
use App\Models\Machine;  
use App\Models\Product;  

use App\Models\Account;  
use App\Models\TaxRate;  

use App\Models\OnlinePayment;  
use App\Models\ShiftTax;  


        
  
class ShiftController extends Controller
{



    public function index()
    {
        $shifts = Shift::with(['machine','user'])->get();
    
        return ShiftResource::collection($shifts);

    }




    public function getByStatus($status)
    {
        $shifts = Shift::with(['machine','user'])->where('status' , $status)->get();
    
        return ShiftResource::collection($shifts);

    }


    public function show($id)
    {
        $shift = Shift::find($id);
        if (!$shift) {
            return response()->json([
                'message' => 'Shift not found',
            ], 404);
        }
    
        return new ShiftResource($shift->load(['machine.product', 'user', 'onlinePayments', 'clientCounters']));
    }
    


    public function deleteOnlinePayment($item_id)
{
    $onlineItem = OnlinePayment::find($item_id);
    if(!$onlineItem){
        return response()->json([
                    'message' => 'shift not found'
                ], 404);
    }

    $shift = Shift::find($onlineItem->shift_id);
    if(!$shift){
        return response()->json([
                    'message' => 'shift not found'
                ], 404);
    }

    DB::beginTransaction();
    
    try {     
        $price =  $shift->machine->product->price;
        $shift->total_payed_online -=  $onlineItem->amount * $price;
        
        $shift->save();
        $onlineItem->delete();
        DB::commit();
        return response()->json([
            'success' => true,
            'message' => 'deleted successfully',
        ]);
    } catch (\Exception $e) {
    
        DB::rollBack(); 
        return response()->json(
            [
                'status' => false,
                'message' => $e->getMessage(),
            ] , 500
        );
    }
}


public function deleteOnlineClient($item_id)
{
    $onlineItem = ClientCounter::find($item_id);
    if(!$onlineItem){
        return response()->json([
                    'message' => 'shift not found'
                ], 404);
    }

    $shift = Shift::find($onlineItem->shift_id);
    if(!$shift){
        return response()->json([
                    'message' => 'shift not found'
                ], 404);
    }

    DB::beginTransaction();
    
    try {     
        $price =  $shift->machine->product->price;
        $shift->total_payed_online -=  $onlineItem->amount * $price;
        
        $shift->save();
        $onlineItem->delete();
        DB::commit();
        return response()->json([
            'success' => true,
            'message' => 'deleted successfully',
        ]);
    } catch (\Exception $e) {
    
        DB::rollBack(); 
        return response()->json(
            [
                'status' => false,
                'message' => $e->getMessage(),
            ] , 500
        );
    }
}


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
    DB::beginTransaction();
    
    try { 
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
// $shift->clientCounters()->delete();
// $shift->onlinePayments()->delete();

    if ($request->has('online_payments')) {


        foreach ($request->online_payments as $payment) {

        
            $image_path = '';  
            if (isset($payment['image']) && $payment['image']->isValid()) {
                $image = $payment['image'];
                $image_path = $image->store('shiftOnlinePaymentImages', 'uploads'); 
                $image_path = asset('uploads/' . $image_path);
            }else {
                
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
  
    

    $shift->total_payed_online = $data['total_payed_online']; 
     $shift->total_client_deposit =$data['total_client_deposit'] ;
     $shift->amount += $data['amount'];
     $shift->save();

     DB::commit();


    return response()->json([
        'success' => true,
        'message' => 'Shift created successfully',
        'data' => new ShiftResource($shift->load('onlinePayments', 'clientCounters')),
    ]);


} catch (\Exception $e) {

    DB::rollBack(); 
    return response()->json(
        [
            'status' => false,
            'message' => $e->getMessage(),
        ] , 500
    );
}
}



public function approveShift($shift_id)
{

    $shift = Shift::find($shift_id);
    if(!$shift){
        return response()->json([
                    'message' => 'shift not found'
                ], 404);
    }

    $shift->status = 'approved';
    $shift->save();


    return response()->json([
        'success' => true,
        'message' => 'Shift updated successfully',
    ]);
}



public function closeShift(Request $request ,$shift_id)
{
   DB::beginTransaction();
    
    try { 
    $shift = Shift::find($shift_id);
    if(!$shift){
        return response()->json([
                    'message' => 'shift not found'
                ], 404);
    }

    $rules = [
    'amount' => 'required|numeric|min:0',
    'ending_amount' => 'required|numeric|min:0',
    'ending_image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',

    'total_money' => 'required|numeric|min:0',
    'total_cash' => 'required|numeric|min:0',
    'total_payed_online' => 'required|numeric|min:0',
    'total_client_deposit' => 'required|numeric|min:0',
    ];
 
    

    $validator = Validator::make($request->all(), $rules);


    if ($validator->fails()) {
        return response()->json([
            'success' => false,
            'message' => 'Validation failed',
            'errors' => $validator->errors(),
        ], 422);
    }

    $end_path = '';
    if(request()->hasFile("ending_image")){
        $image = request()->file("ending_image");
        $end_path=$image->store('shiftEndImages','uploads');
        $end_path= asset('uploads/' . $end_path); 
    }

    $data = $validator->validated();

   
    $shift->total_payed_online = $data['total_payed_online'];
    $shift->total_client_deposit = $data['total_client_deposit'];
    $shift->ending_image = $end_path;
    $shift->ending_amount = $data['ending_amount'];
    $shift->status = 'closed';
    $shift->amount = $data['amount'];
    $shift->total_money = $data['total_money'];
    $shift->total_cash = $data['total_cash'];
    $shift->save();

    $tax =Account::find(54);
    $salesAccount =Account::find(47);

    
    $tax_rate  =TaxRate::find(1);
    $precentage =$tax_rate->rate /100;
    $total = $data['total_money'] *  $precentage;
    

    $this->updateCredit($tax ,$total );
    $this->updateCredit($salesAccount , $data['total_money']);



    $shiftTax =ShiftTax::create([
        'date'=> now(),
        'shift_id'=>$shift->id,
        'tax_amount'=>$total,
        'tax_rate'=>$tax_rate->rate
    ]);
    DB::commit();

    return response()->json([
        'success' => true,
        'message' => 'Shift closed successfully',
        'data' => new ShiftResource($shift->load('onlinePayments', 'clientCounters')),
    ]);



 

} catch (\Exception $e) {

    DB::rollBack(); 
    return response()->json(
        [
            'status' => false,
            'message' => $e->getMessage(),
        ] , 500
    );
}
}




public function updateDebit($account ,  $amount)
{
    $account->net_debit +=$amount;
    $account->current_balance -=$amount;
    $account->save();
    if ($account->parent_id){
        $parent =Account::find($account->parent_id);
        $this->updateDebit($parent ,$amount);
    }

}
public function updateCredit($account ,  $amount)
{
    $account->net_credit +=$amount;
    $account->current_balance +=$amount;
    $account->save();
    if ($account->parent_id){
        $parent =Account::find($account->parent_id);
        $this->updateCredit($parent ,$amount);
    }
}


public function store(Request $request)
{

    $rules = [
        'opening_image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        'opening_amount' => 'required|numeric|min:0',
        'shift' => 'required|in:1,2',
        'machine_id'=>'required|exists:machines,id',
        'date' => 'required|date',        
    ];


    $validator = Validator::make($request->all(), $rules);


    if ($validator->fails()) {
        return response()->json([
            'success' => false,
            'message' => 'Validation failed',
            'errors' => $validator->errors(),
        ], 422);
    }

    DB::beginTransaction();

try{
$data = $validator->validated();

$open_path = '';
if(request()->hasFile("opening_image")){
    $image = request()->file("opening_image");
    $open_path=$image->store('shiftOpenImages','uploads');
    $open_path= asset('uploads/' . $open_path); 
}

    $shift = new Shift();

    $shift->user_id = auth()->id();
    $shift->opening_image = $open_path;
    $shift->opening_amount= $data['opening_amount'];
    $shift->ending_image= null;
    $shift->ending_amount= 0;

    $shift->shift= $data['shift'];
    $shift->date= $data['date'];

    $shift->machine_id= $data['machine_id'];
    $shift->status= 'open';
    $shift->amount= 0;
    $shift->total_money= 0;
    $shift->total_cash= 0;
    $shift->total_payed_online= 0;
    $shift->total_client_deposit= 0;
    $shift->save();
    DB::commit();

    return response()->json([
        'success' => true,
        'message' => 'Shift created successfully',
        'data' => new ShiftResource($shift->load('onlinePayments', 'clientCounters','machine')),
    ]);






 

} catch (\Exception $e) {

    DB::rollBack(); 
    return response()->json(
        [
            'status' => false,
            'message' => $e->getMessage(),
        ] , 500
    );
}
}


public function destroy($id)
{
    DB::beginTransaction();

    try{ 
    $shift = Shift::find($id);
    if (!$shift) {
        return response()->json([
            'message' => 'Shift not found',
        ], 404);
    }

    $shift->delete();
    DB::commit();

    return response()->json([
        'success' => true,
        'message' => 'Shift deleted successfully',
    ]);


} catch (\Exception $e) {

    DB::rollBack(); 
    return response()->json(
        [
            'status' => false,
            'message' => $e->getMessage(),
        ] , 500
    );
}}



}
