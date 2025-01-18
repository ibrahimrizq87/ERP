<?php

namespace App\Http\Controllers;
use Carbon\Carbon;

use Illuminate\Http\Request;
use App\Models\Product;  
use App\Models\Account;  

use App\Models\MainShift;  
use App\Models\ShiftMachine;  

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Http\Resources\MainShiftResource;
use App\Http\Resources\ShiftMachineResource;
use Illuminate\Support\Facades\DB;
class MainShiftController extends Controller
{


    public function getAllShiftsByStatus($shift_id , $status){
        $shifts =  MainShift::where('status' , $status)->get();
       return MainShiftResource::collection($shifts);
    }

    // public function getAllClosedShifts($shift_id){
    //     $shifts =  MainShift::where('status' , 'closed')->get();
    //    return  MainShiftResource::collection($shifts);
    // }

    // public function getAllOpenShifts($shift_id){
    //     $shifts =  MainShift::where('status' , 'open')->get();
    //    return  MainShiftResource::collection($shifts);
    // }




    public function getMyAllOldShifts(){
        $shifts =  MainShift::where('worker_id', Auth::id())->get();
       return  MainShiftResource::collection($shifts);
    }



    public function closeShift($shift_id){
        $shift =  MainShift::find($shift_id);
   
        if(!$shift){
            return response()->json([
                'success' => false,
                'message' => 'لم يتم فتح وردية بعد'
            ], 404);
        }

    $shift->status = 'closed';
    $shift->save();
    return response()->json([
        'success' => true,
        'message' => "done successfully"
    ], 200);

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

    

    public function ApproveShift($shift_id){
        $shift =  MainShift::find($shift_id);
   
        if(!$shift){
            return response()->json([
                'success' => false,
                'message' => 'لم يتم فتح وردية بعد'
            ], 404);
        }

        DB::beginTransaction();
    
        try { 

            $shiftMachines = ShiftMachine::where('smain_hift_id' , $shift->id)->get();
            foreach ($shiftMachines as $machine) {
                $product = Product::find($machine->product_id);
                if( $product){
                    $product->amount -= $machine->total_liters_amount;
                    $product->start_amount = $machine->close_amount;
                    $product->save();
                }
            }
                $total_money = $shift->total_shift_money;
                $tax =Account::find(54);
                $salesAccount =Account::find(47);

                
                $tax_rate  =TaxRate::find(1);
                $precentage =$tax_rate->rate /100;
                $total = $total_money *  $precentage;
                

                $this->updateCredit($tax ,$total);
                $this->updateCredit($salesAccount , $total_money);

                $shift->status = 'approved';
                $shift->save();

         DB::commit();

        return response()->json([
            'success' => true,
            'message' => 'saved successfully'
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
        'machines.*.machine_id' => 'required|numeric|exists:machines,id',//machine
        'machines.*.close_image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',//image
        'machines.*.close_amount' => 'required|numeric|min:0',
        'machines.*.total_liters' => 'required|numeric|min:0',
        'machines.*.total_money' => 'required|numeric|min:0',

        'update_machines.*.id' => 'required|numeric|exists:shift_machines,id',
        'update_machines.*.product_id' => 'required|numeric|exists:products,id',
        'update_machines.*.machine_id' => 'required|numeric|exists:machines,id',
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

            $_machine->main_shift_id = $shift->id;
            $_machine->open_amount = 0;
            $_machine->product_id =  $machine['product_id'];
            $_machine->machine_id = $machine['machine_id'];
            $_machine->close_amount = $machine['close_amount'];
            $_machine->close_image = $image_path;
            $_machine->total_money = $machine['total_money'];
       
            $_machine->total_liters_amount =$machine['total_liters'];
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
            $_machine->main_shift_id = $shift->id;
            $_machine->product_id =  $machine['product_id'];
            $_machine->machine_id = $machine['machine_id'];
            $_machine->close_amount = $machine['close_amount'];
            $_machine->close_image = $image_path;
            $_machine->total_money = $machine['total_money'];
            $_machine->total_liters_amount =$machine['total_liters'];
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
