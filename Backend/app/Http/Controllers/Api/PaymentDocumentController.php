<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Http\Requests\PaymentDocumentRequest;
use App\Http\Resources\PaymentDocumentResource;
use App\Models\PaymentDocument;
use Illuminate\Support\Facades\Storage;
use App\Models\Account;

class PaymentDocumentController extends Controller
{


    public function store(PaymentDocumentRequest $request)
    {


        $validated = $request->validated();
      DB::beginTransaction();
    
    try {

        if($request->hasFile("image")){
            $image = $request->file("image");
            $my_path=$image->store('payment_documents','uploads');
            $my_path= asset('uploads/' . $my_path); 
            $validated['image'] = $my_path;

        }


        $accountCompany = Account::find($validated['company_account_id']);
        $accountCustomer = Account::find($validated['customer_account_id']);

        if(!$accountCompany || !$accountCustomer ){
            return response()->json(
                ['message'=> 'account not found'],
                 404);
        }

        


        if($validated['type'] == 'payment'){
            $this->updateDebit($accountCompany , $validated['amount']);            
            $this->updateCredit($accountCustomer , $validated['amount']);
        }else  if ($validated['type'] == 'receipt'){
            $this->updateDebit($accountCustomer , $validated['amount']);
            $this->updateCredit($accountCompany , $validated['amount']);
        }else{
  return response()->json(
                ['message'=> 'type of document must be receipt or payment'],
                 400);
        }
        $validated['user_id'] = Auth::id();

        $paymentDocument = PaymentDocument::create($validated);
        DB::commit();

        return response()->json(new PaymentDocumentResource($paymentDocument), 201);

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
    $account->net_credit -= $amount;
    $account->current_balance -= $amount;
    $account->save();
    if ($account->parent_id){
        $parent =Account::find($account->parent_id);
        $this->updateCreditRev($parent ,$amount);
    }
}



    public function show(PaymentDocument $paymentDocument)
{
    $paymentDocument->load(['companyAccount', 'customerAccount']);
    return new PaymentDocumentResource($paymentDocument);
}


    public function getByType($type)
{
    $documents = PaymentDocument::where('type', $type)->with(['companyAccount', 'customerAccount'])->get();
    return PaymentDocumentResource::collection($documents);
}




    public function update(PaymentDocumentRequest $request, PaymentDocument $paymentDocument)
{



    DB::beginTransaction();
    
    try {

    $validated = $request->validated();
    if ($validated['type'] != 'payment' && $validated['type'] != 'receipt') {
        return response()->json(['message' => 'Type of document must be receipt or payment'], 400);
    }

    if ($request->hasFile('image')) {
        if ($paymentDocument->image && Storage::disk('uploads')->exists($paymentDocument->image)) {
            Storage::disk('uploads')->delete($paymentDocument->image);
        }


        $image = $request->file('image');
        $imagePath = $image->store('payment_documents', 'uploads');
        $validated['image'] = asset('uploads/' . $imagePath);
    }


    $accountCompany = Account::find($validated['company_account_id']);
    $accountCustomer = Account::find($validated['customer_account_id']);

    if (!$accountCompany || !$accountCustomer ) {
        return response()->json(['message' => 'Account not found'], 404);
    }

    if ($paymentDocument->type == 'payment') {


        $this->updateDebitRev($accountCompany, $paymentDocument->amount);
        $this->updateCreditRev($accountCustomer, $paymentDocument->amount);
    }else   if ($paymentDocument->type == 'receipt') {
        $this->updateDebitRev($accountCustomer, $paymentDocument->amount);
        $this->updateCreditRev($accountCompany, $paymentDocument->amount);
    }



    if($validated['type'] == 'payment'){
        $this->updateDebit($accountCompany , $validated['amount']);            
        $this->updateCredit($accountCustomer , $validated['amount']);
    }else  if ($validated['type'] == 'receipt'){
        $this->updateDebit($accountCustomer , $validated['amount']);
        $this->updateCredit($accountCompany , $validated['amount']);
    }



    $paymentDocument->update($validated);

    DB::commit();

    return response()->json(new PaymentDocumentResource($paymentDocument), 200);

              
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



    public function destroy(PaymentDocument $paymentDocument)
{
    DB::beginTransaction();
    
    try {
    $accountCompany = Account::find($paymentDocument->company_account_id);
    $accountCustomer = Account::find($paymentDocument->customer_account_id);
   
    if (!$accountCompany || !$accountCustomer ) {
        return response()->json(['message' => 'Account not found'], 404);
    }
    if ($paymentDocument->type == 'payment') {

        $this->updateDebitRev($accountCompany, $paymentDocument->amount);
        $this->updateCreditRev($accountCustomer, $paymentDocument->amount);
    }else   if ($paymentDocument->type == 'receipt') {
        $this->updateDebitRev($accountCustomer, $paymentDocument->amount);
        $this->updateCreditRev($accountCompany, $paymentDocument->amount);
    }


    if ($paymentDocument->image && Storage::disk('uploads')->exists($paymentDocument->image)) {
        Storage::disk('uploads')->delete($paymentDocument->image);
    }

    $paymentDocument->delete();
    DB::commit();

    return response()->json(['message' => 'Payment document deleted successfully.'], 200);
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
