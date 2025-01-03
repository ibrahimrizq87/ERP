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
        $accountCompanyParent = Account::find($accountCompany->parent_id);
        $accountCustomerParent = Account::find($accountCustomer->parent_id);

        if(!$accountCompany || !$accountCustomer || !$accountCompanyParent|| !$accountCustomerParent){
            return response()->json(
                ['message'=> 'account not found'],
                 404);
        }

        


        if($validated['type'] == 'payment'){
            $accountCompany->net_debit += $validated['amount'];
            $accountCompanyParent->net_debit += $validated['amount'];

            $accountCustomer->net_credit += $validated['amount'];
            $accountCustomerParent->net_credit += $validated['amount'];

        }else  if ($validated['type'] == 'receipt'){
            $accountCompany->net_credit += $validated['amount'];
            $accountCompanyParent->net_credit += $validated['amount'];

            $accountCustomer->net_debit += $validated['amount'];
            $accountCustomerParent->net_debit += $validated['amount'];

        }else{
  return response()->json(
                ['message'=> 'type of document must be receipt or payment'],
                 400);
        }
        $accountCompany->save();
        $accountCustomer->save();
        $accountCompanyParent->save();
        $accountCustomerParent->save();

        $accountCompany->current_balance =  $accountCompany->net_credit - $accountCompany->net_debit;
        $accountCustomer->current_balance = $accountCompany->net_credit - $accountCompany->net_debit;

        $accountCompanyParent->current_balance =  $accountCompanyParent->net_credit - $accountCompanyParent->net_debit;
        $accountCustomerParent->current_balance = $accountCustomerParent->net_credit - $accountCustomerParent->net_debit;

        $accountCompany->save();
        $accountCustomer->save();
        $accountCompanyParent->save();
        $accountCustomerParent->save();

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
    $accountCompanyParent = Account::find($accountCompany->parent_id);
    $accountCustomerParent = Account::find($accountCustomer->parent_id);


    if (!$accountCompany || !$accountCustomer || !$accountCompanyParent || !$accountCustomerParent) {
        return response()->json(['message' => 'Account not found'], 404);
    }

    if ($paymentDocument->type == 'payment') {
        $accountCompany->net_debit -= $paymentDocument->amount;
        $accountCompanyParent->net_debit -= $paymentDocument->amount;

        $accountCustomer->net_credit -= $paymentDocument->amount;
        $accountCustomerParent->net_credit -= $paymentDocument->amount;
    }else   if ($paymentDocument->type == 'receipt') {
        $accountCompany->net_credit -= $paymentDocument->amount;
        $accountCompanyParent->net_credit -= $paymentDocument->amount;

        $accountCustomer->net_debit -= $paymentDocument->amount;
        $accountCustomerParent->net_debit -= $paymentDocument->amount;
    }

    $accountCompany->save();
    $accountCustomer->save();
    $accountCompanyParent->save();
    $accountCustomerParent->save();



    if ($validated['type'] == 'payment') {

 
        $accountCompany->net_debit += $validated['amount'];
        $accountCompany->current_balance -= $validated['amount'];

        $accountCompanyParent->net_debit += $validated['amount'];
        $accountCompanyParent->current_balance -= $validated['amount'];

        $accountCustomer->net_credit += $validated['amount'];
        $accountCustomer->current_balance += $validated['amount'];
        $accountCustomerParent->net_credit += $validated['amount'];
        $accountCustomerParent->current_balance += $validated['amount'];

    } elseif ($validated['type'] == 'receipt') {



        $accountCompany->net_credit += $validated['amount'];
        $accountCompany->current_balance += $validated['amount'];

        $accountCompanyParent->net_credit += $validated['amount'];
        $accountCompanyParent->current_balance += $validated['amount'];

        $accountCustomer->net_debit += $validated['amount'];
        $accountCustomer->current_balance -= $validated['amount'];

        $accountCustomerParent->net_debit += $validated['amount'];
        $accountCustomerParent->current_balance -= $validated['amount'];

        
    }


    $accountCompany->save();
    $accountCustomer->save();
    $accountCompanyParent->save();
    $accountCustomerParent->save();

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
    $accountCompanyParent = Account::find($accountCompany->parent_id);
    $accountCustomerParent = Account::find($accountCustomer->parent_id);

    if (!$accountCompany || !$accountCustomer || !$accountCompanyParent || !$accountCustomerParent) {
        return response()->json(['message' => 'Account not found'], 404);
    }

    if ($paymentDocument->type == 'payment') {
        $accountCompany->net_debit -= $paymentDocument->amount;
        $accountCompanyParent->net_debit -= $paymentDocument->amount;

        $accountCustomer->net_credit -= $paymentDocument->amount;
        $accountCustomerParent->net_credit -= $paymentDocument->amount;
    } elseif ($paymentDocument->type == 'receipt') {
        $accountCompany->net_credit -= $paymentDocument->amount;
        $accountCompanyParent->net_credit -= $paymentDocument->amount;

        $accountCustomer->net_debit -= $paymentDocument->amount;
        $accountCustomerParent->net_debit -= $paymentDocument->amount;
    }

    $accountCompany->save();
    $accountCustomer->save();
    $accountCompanyParent->save();
    $accountCustomerParent->save();

    $accountCompany->current_balance = $accountCompany->net_credit - $accountCompany->net_debit;
    $accountCustomer->current_balance = $accountCustomer->net_credit - $accountCustomer->net_debit;
    $accountCompanyParent->current_balance = $accountCompanyParent->net_credit - $accountCompanyParent->net_debit;
    $accountCustomerParent->current_balance = $accountCustomerParent->net_credit - $accountCustomerParent->net_debit;

    $accountCompany->save();
    $accountCustomer->save();
    $accountCompanyParent->save();
    $accountCustomerParent->save();

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
