<?php

namespace App\Http\Controllers;
use Carbon\Carbon;

use Illuminate\Http\Request;
use App\Models\Product;  
use App\Models\MainShift;  
use App\Models\ShiftMachine;  

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Http\Resources\MainShiftResource;
use App\Http\Resources\ShiftMachineResource;

class MainShiftController extends Controller
{



    public function getMyShift(){

        
        $shift =  MainShift::where('worker_id', Auth::id() )
        ->where('status' , 'open')->first();
   
        if(!$shift){
            return response()->json([
                'success' => false,
                'message' => 'لم يتم فتح وردية بعد'
            ], 404);
        }
    
       return new MainShiftResource($shift);
        }

    public function store(Request $request){

    $rules = [
 

        'shift' => 'required|in:1,2',
    ];


    $validator = Validator::make($request->all(), $rules);


    if ($validator->fails()) {
        return response()->json([
            'success' => false,
            'message' => 'Validation failed',
            'errors' => $validator->errors(),
        ], 422);
    }
    $shift = new MainShift();
    $shift->worker_id = Auth::id();
    $shift->status = 'open';
    $shift->shift = $request->shift;
    $shift->total_shift_money = 0;
    $shift->total_money_cash = 0;
    $shift->total_money_client = 0;
    $shift->total_money_online = 0;


    $shift->date =  Carbon::now();
    $shift->save();

   return response()->json([
            'success' => true,
            'message' => 'تمت الاضافة بنجاح'
        ], 201);


    }


    public function update(Request $request , $shift_id)
{

    $shift = MainShift::find($shift_id);
    if(!$shift){
        return response()->json([
                    'message' => 'shift not found'
                ], 404);
    }

    $rules = [
 

        'machines' => 'nullable|array',
        'update_machines' => 'nullable|array',
        'online_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',//image
        'total_online' => 'required|numeric|min:0',//text input
        'total_cash' => 'required|numeric|min:0',//totalmoney-(totalclient+totalonline)
        'total_money' => 'required|numeric|min:0',//total الاجمالى بالريال
        'total_client' => 'required|numeric|min:0',// invoice

        'machines.*.product_id' => 'required|numeric|exists:products,id',//product
        'machines.*.machien_id' => 'required|numeric|exists:machines,id',//machine
        'machines.*.close_image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',//image
        'machines.*.close_amount' => 'required|numeric|min:0',
        'machines.*.total_liters' => 'required|numeric|min:0',
        'machines.*.total_money' => 'required|numeric|min:0',

        'update_machines.*.id' => 'required|numeric|exists:shift_machines,id',
        'update_machines.*.product_id' => 'required|numeric|exists:products,id',
        'update_machines.*.machien_id' => 'required|numeric|exists:machines,id',
        'update_machines.*.close_image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        'update_machines.*.close_amount' => 'required|numeric|min:0',
        'update_machines.*.total_liters' => 'required|numeric|min:0',
        'update_machines.*.total_money' => 'required|numeric|min:0',
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

// $machine = Machine::find($shift->machine_id);
// if (!$machine){
//     return response()->json([
//         'message' => 'machine not found'
//     ], 404);
// }

// $product = Product::find($machine->product_id);
// if (!$product){
//     return response()->json([
//         'message' => 'product not found'
//     ], 404);
// }


$total_shift_money = $request->total_money;
$total_money_cash = $request->total_cash;
$total_money_client = $request->total_client;
$total_money_online = $request->total_online;

    if ($request->has('machines')) {


        foreach ($request->machines as $machine) {

        
            $image_path = '';  
            if (isset($machine['close_image']) && $machine['close_image']->isValid()) {
                $image = $machine['close_image'];
                $image_path = $image->store('shiftCloseingImages', 'uploads'); 
                $image_path = asset('uploads/' . $image_path);
            }


            

             $_machine= new ShiftMachine();

            $_machine->shift_id = $shift->id;
            $_machine->product_id =  $payment['product_id'];
            $_machine->machien_id = $payment['machien_id'];
            $_machine->close_amount = $payment['close_amount'];
            $_machine->close_image = $image_path;
            $_machine->total_money = $payment['total_money'];
            $_machine->total_liters =$payment['total_liters'];
            $_machine->save();
        }
    }


    if ($request->has('update_machines')) {


        foreach ($request->update_machines as $machine) {

        
            $image_path = $machine->close_image;  
            if (isset($machine['close_image']) && $machine['close_image']->isValid()) {
                $image = $machine['close_image'];
                $image_path = $image->store('shiftCloseingImages', 'uploads'); 
                $image_path = asset('uploads/' . $image_path);
            }

            $_machine=ShiftMachine::find($machine['id']);


            if(!$_machine){
                return response()->json(
                    [
                        'status' => false,
                        'message' => 'يوجد خطأ فى المعلومات المدخلة',
                    ] , 404
                );
            }
            $_machine->shift_id = $shift->id;
            $_machine->product_id =  $payment['product_id'];
            $_machine->machien_id = $payment['machien_id'];
            $_machine->close_amount = $payment['close_amount'];
            $_machine->close_image = $image_path;
            $_machine->total_money = $payment['total_money'];
            $_machine->total_liters =$payment['total_liters'];
            $_machine->save();
        }
    }




    $shift->total_shift_money = $total_shift_money; 
    $shift->total_money_cash = $total_money_cash; 
    $shift->total_money_client = $total_money_client; 
    $shift->total_money_online = $total_money_online; 
     
     $shift->save();

     DB::commit();


    return response()->json([
        'success' => true,
        'message' => 'Shift created successfully',
        'data' => new MainShiftResource($shift),
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

    
}
