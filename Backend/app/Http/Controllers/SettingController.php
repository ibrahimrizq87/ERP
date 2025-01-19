<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Setting;  
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class SettingController extends Controller
{


    
    public function getAllSettings(Request $request){
    $settings = Setting::all();
    $data =[];

    foreach ($settings as $setting) {
        $data[$setting['key']] =$setting['value']; 
        
        }


    return response()->json(
        [
            'data' => $data 
        ]
    );
    }
    public function update(Request $request){



        $rules = [
            'phone' => 'required|string',
            'address' => 'required|string',
            'tax_number' => 'required|string',
            'tax_name' => 'required|string',
            'invoice_message' => 'required|string',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',


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
            
            $phone =Setting::find(1);
            $logo =Setting::find(2);
            $address =Setting::find(3);
            $tax_number =Setting::find(4);
            $tax_name =Setting::find(5);
            $invoice_message =Setting::find(6);
          if($phone){
            $phone->value = $request->phone;
            $phone->save();

          }
          if($logo){
            $my_path = $logo->value;
            if(request()->hasFile("logo")){

                
                $image = request()->file("logo");
                $my_path = $image->store('logo', 'uploads'); 
                $my_path= asset('uploads/' . $my_path); 
            }
            $logo->value = $my_path;
            $logo->save();
          }
          if($address){
           

            $address->value = $request->address;
            $address->save();
          }
          if($tax_number){
            $tax_number->value = $request->tax_number;
            $tax_number->save();
          }
          if($tax_name){
            $tax_name->value = $request->tax_name;
            $tax_name->save();
          }
          if($invoice_message){
            $invoice_message->value = $request->invoice_message;
            $invoice_message->save();
          }
           
            
            
            DB::commit();


            return response()->json([
                'success' => true,
                'message' => 'Settings updated successfully',
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
