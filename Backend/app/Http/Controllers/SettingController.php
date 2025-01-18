<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Setting;  

class SettingController extends Controller
{

    public function update(Request $request){
        $rules = [
 
            'settings' => 'nullable|array',
            'settings.*.id' => 'required|numeric|exists:settings,id',
            'settings.*.value' => 'nullable|string',
            'settings.*.image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',


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
            
            
            
            if ($request->has('settings')) {


                foreach ($request->settings as $setting) {
                $setting_old =Setting::find($setting['id']);

                if($setting_old){

                    if (isset($setting['image']) && $setting['image']->isValid()) {
                        $image = $setting['image'];
                        $image_path = $image->store('logo', 'uploads'); 
                        $image_path = asset('uploads/' . $image_path);
                        $setting_old->value = $image_path;
                    }else{
                        $setting_old->value = $setting['value'];
                    }
                    $setting_old->save();
                }
                }
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
