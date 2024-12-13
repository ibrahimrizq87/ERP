<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Resources\MachineResource;
use Illuminate\Support\Facades\Validator;
use App\Models\Machine;  

class MachineController extends Controller
{
  
    


    public function index()
    {
        $machines = Machine::with('product')->get();
        return MachineResource::collection($machines);
    }



        public function store(Request $request)
        {
            $rules = [
                'machine_number' => 'required|string|max:255',
                'product_id' => 'required|exists:products,id',
            ];
    
            $validator = Validator::make($request->all(), $rules);
    
            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors(),
                ], 422);
            }
    
            $machine = Machine::create($request->only(['machine_number', 'product_id']));
            return response()->json(new MachineResource($machine), 201);
        }
    
        public function show(Machine $machine)
        {
            $machine->load('product'); 
            return response()->json(new MachineResource($machine));
        }
    
        public function update(Request $request, Machine $machine)
        {
            $rules = [
                'machine_number' => 'required|string|max:255',
                'product_id' => 'required|exists:products,id',
            ];
    
            $validator = Validator::make($request->all(), $rules);
    
            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors(),
                ], 422);
            }
    
            $machine->update($request->only(['machine_number', 'product_id']));
            return response()->json(new MachineResource($machine));
        }
    
    



    public function destroy(Machine $machine)
    {
        $machine->delete();
        return response()->json(['message'=> 'deleted successfully'], 204);
    }

}
