<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\TaxRate;  

class TaxRateController extends Controller
{

  

    public function update(Request $request)
    {
        $tax  =TaxRate::find(1);
        $rules = [
            'rate' => 'required|numeric|min:0|max:100',
  
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

        $tax->rate = $data ['rate'];

        $tax->save();
        return response()->json(['message' =>'updated successfully'], 200);


    }
    public function getTax()
    {
        $tax  =TaxRate::find(1);
        return $tax;
    }
}
