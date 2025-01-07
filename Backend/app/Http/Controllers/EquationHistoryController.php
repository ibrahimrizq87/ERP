<?php

namespace App\Http\Controllers;

use App\Http\Resources\EquationHistoryResource;
use App\Models\EquationHistory;
use Illuminate\Http\Request;
use App\Models\Equation;
use App\Models\Account;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
class EquationHistoryController extends Controller
{
    public function index()
    {
        return EquationHistoryResource::collection(EquationHistory::all());
    }

    public function store(Request $request)
    {

        
    


        $validator = Validator::make($request->all(), [
            'equation_id'    => 'required|exists:equations,id',
            // 'last_price'     => 'required|numeric|min:0',
            // 'current_price'  => 'required|numeric|min:0',
            // 'amount'         => 'required|numeric|min:0',
            'year'           => 'nullable|integer|min:2000|max:' . \Carbon\Carbon::now()->year,
            // 'period_number'  => 'required|integer|min:1',

        ]);
    
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }
        $data =$request->all();

        DB::beginTransaction();
    
        try {   
        $equation = Equation::find($data['equation_id']);
        if(!$equation){
            return response()->json(
                [
                    'message' => 'equation not found',
                ] , 404
            );
        }
        $base =Account::find($equation->base_id);
        $collection =Account::find($equation->collection_id);


        if(!$base || !$collection){
            return response()->json(
                [
                    'message' => 'الحسابات غير موجودة',
                ] , 404
            );
        }
        $oldHestory = EquationHistory::where('year', $data['year'] ?? \Carbon\Carbon::now()->year)
        ->where('equation_id', $data['equation_id'])
        ->first();


        if($oldHestory){
            return response()->json(
                [
                    'message' => 'هذا الاصل قد تم خصم مبلغ الاستهلاك له من قبل فى هذه السنه',
                ] , 404
            );
        }


        $lastOne = EquationHistory::where('equation_id', $data['equation_id'])
        ->orderBy('year', 'desc') 
        ->first();

        $amount = 0;
        $last_price = 0;
        $current_price = 0;
        $year = 0;
        $period_number = 0;
     
        if ($lastOne ){
            $prec = (1/ $equation->number_of_periods);
            $amount = $lastOne->current_price * $prec ;
            $last_price = $lastOne->current_price ;
            $current_price = $lastOne->current_price - $amount;
            $equation->current_price = $lastOne->current_price - $amount;
            $year = $data['year'] ?? $lastOne->year +1 ;
            $period_number =$lastOne->period_number +1 ;
        }else{
            $prec = (1/ $equation->number_of_periods);
            $amount = $equation->current_price * $prec ;
            $last_price = $equation->current_price ;
            $current_price = $equation->current_price - $amount;
            $equation->current_price = $equation->current_price - $amount;
            $year = $data['year']??  \Carbon\Carbon::now()->year;
            $period_number =1 ;
        }

        $this->updateDebit($base ,$amount );
        $this->updateCredit($collection ,$amount);





        
        $equationHistory = EquationHistory::create([
            'equation_id' => $data['equation_id'],
            'last_price' => $last_price,
            'current_price' => $current_price,
            'amount' => $amount,
            'year' => $year ,
            'period_number' => $period_number,
        ]);


        DB::commit();

        return new EquationHistoryResource($equationHistory);

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

public function updateDebitRev($account ,  $amount)
{
    $account->net_debit -=$amount;
    $account->current_balance +=$amount;
    $account->save();
    if ($account->parent_id){
        $parent =Account::find($account->parent_id);
        $this->updateDebitRev($parent ,$amount);
    }

}
public function updateCreditRev($account ,  $amount)
{
    $account->net_credit -=$amount;
    $account->current_balance -=$amount;
    $account->save();
    if ($account->parent_id){
        $parent =Account::find($account->parent_id);
        $this->updateCreditRev($parent ,$amount);
    }
}



    public function show(EquationHistory $equationHistory)
    {
        return new EquationHistoryResource($equationHistory);
    }

    public function update(Request $request, $id)
    {
        $validatedData = $request->validate([
            'last_price'     => 'required|numeric|min:0',
            'current_price'  => 'required|numeric|min:0',
            'amount'         => 'required|numeric|min:0',
            'year'           => 'required|integer|min:2000|max:' . \Carbon\Carbon::now()->year,
            'period_number'  => 'required|integer|min:1',
        ]);
    
        DB::beginTransaction();
    
        try {

            $equationHistory = EquationHistory::find($id);
    
            if (!$equationHistory) {
                return response()->json(['message' => 'Equation history not found.'], 404);
            }
    

            $equation = Equation::find($equationHistory->equation_id);
    
            if (!$equation) {
                return response()->json(['message' => 'Equation not found.'], 404);
            }
    

            $base = Account::find($equation->base_id);
            $collection = Account::find($equation->collection_id);
    
            if (!$base || !$collection) {
                return response()->json(['message' => 'not found'], 404);
            }
    

            $this->updateDebitRev($base, $equationHistory->amount);
            $this->updateCreditRev($collection, $equationHistory->amount);
    

            $equationHistory->update($validatedData);
    

            $this->updateDebit($base, $validatedData['amount']);
            $this->updateCredit($collection, $validatedData['amount']);
    
            DB::commit();
    
            return new EquationHistoryResource($equationHistory);
    
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Update failed: ' . $e->getMessage(), ['exception' => $e]);
            return response()->json(['status' => false, 'message' => $e->getMessage()], 500);
        }
    }
    

    public function destroy($id)
    {
        DB::beginTransaction();
    
        try {

            $equationHistory = EquationHistory::find($id);
    
            if (!$equationHistory) {
                return response()->json(['message' => 'Equation history not found.'], 404);
            }
    

            $equation = Equation::find($equationHistory->equation_id);
    
            if (!$equation) {
                return response()->json(['message' => 'Equation not found.'], 404);
            }
    

            $base = Account::find($equation->base_id);
            $collection = Account::find($equation->collection_id);
    
            if (!$base || !$collection) {
                return response()->json(['message' => 'Accounts not found.'], 404);
            }
    

            $this->updateDebitRev($base, $equationHistory->amount);
            $this->updateCreditRev($collection, $equationHistory->amount);
    

            $equationHistory->delete();
    
            DB::commit();
    
            return response()->json(['message' => 'Equation history deleted successfully.'], 200);
    
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Delete failed: ' . $e->getMessage(), ['exception' => $e]);
            return response()->json(['status' => false, 'message' => $e->getMessage()], 500);
        }
    }
    
}
