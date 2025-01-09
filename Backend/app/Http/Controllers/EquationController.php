<?php
namespace App\Http\Controllers;

use App\Http\Resources\EquationResource;
use App\Models\Equation;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Validator;

class EquationController extends Controller
{
    public function index()
    {
        return EquationResource::collection(Equation::all());
    }

    public function store(Request $request)
    {
       


        $validator = Validator::make($request->all(), [
            'collection_id' => 'required|exists:accounts,id',
            'base_id'       => 'required|exists:accounts,id',
            'first_price'   => 'required|numeric|min:0',
            'current_price' => 'nullable|numeric|min:0',
            'number_of_periods' => 'required|integer|min:0',

        ]);
    
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }
        $data =$request->all();


        $equation = Equation::create( 
            
            [
                'collection_id' =>  $data['collection_id'], 
                'base_id' =>$data['base_id'], 
                'first_price' =>$data['first_price'], 
                'current_price' =>$data['current_price'] ?? $data['first_price'], 
                'number_of_periods' =>$data['number_of_periods'], 
            ]
             );

        return new EquationResource($equation);
    }

    public function show(Equation $equation)
    {
        return new EquationResource($equation);
    }

    public function update(Request $request, Equation $equation)
    {
        $validatedData = $request->validate([
            'collection_id' => 'sometimes|required|exists:accounts,id',
            'base_id'       => 'sometimes|required|exists:accounts,id',
            'first_price'   => 'sometimes|required|numeric|min:0',
            'current_price' => 'sometimes|required|numeric|min:0',
            'number_of_periods' => 'sometimes|required|integer|min:0',
        ]);

        $equation->update($validatedData);

        return new EquationResource($equation);
    }

    public function destroy(Equation $equation)
    {
        $equation->delete();

        return response()->json(['message' => 'Equation deleted successfully']);
    }
}

