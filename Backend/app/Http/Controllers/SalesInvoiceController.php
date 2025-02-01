<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\SalesInvoice;
use App\Models\Account;
use App\Models\MainShift;
use Illuminate\Support\Facades\DB;
use App\Http\Resources\SalesInvoiceResource;

class SalesInvoiceController extends Controller
{



    public function index()
    {
        $invoices =SalesInvoice::all();
        return SalesInvoiceResource::collection($invoices);
    }

    public function show($id)
    {
        $invoice =SalesInvoice::find($id);
        return new SalesInvoiceResource($invoice);
    }

    public function getByShift($shift_id)
    {
        $invoice =SalesInvoice::where('main_shift_id',$shift_id)->get();
        return  SalesInvoiceResource::collection($invoice);
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


    public function store(Request $request)
    {
        $validated = $request->validate([
            'address' => 'nullable|string|max:255',
            'tax_no' => 'nullable|string|max:255',
            'tax_name' => 'nullable|string|max:255',
            'client_name' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:20',
            'type' => 'required|in:cash,debit',
            'date' => 'required|date',
            'liters' => 'required|numeric',
            'amount' => 'required|numeric',
            'tax_amount' => 'required|numeric',
            'tax_rate' => 'required|numeric',
            // 'number' => 'required|string|max:255',
            'account_id' => 'nullable|exists:accounts,id',
            'product_id' => 'required|exists:products,id',

            'main_shift_id' => 'required|exists:main_shifts,id',
        ]);
        DB::beginTransaction();

        try {



            // $count = SalesInvoice::count();
            $lastInvoiceNumber = SalesInvoice::max('number') ?? 1;

        $salesInvoice = SalesInvoice::create([
            'address'=> $validated['address'] ?? null,
            'tax_no'=> $validated['tax_no'] ?? null,
            'tax_name'=> $validated['tax_name'] ?? null,
            'client_name'=> $validated['client_name'] ?? null,
            'phone'=> $validated['phone'] ?? null,
            'type'=> $validated['type'],
            'date'=> $validated['date'],
            'liters'=> $validated['liters'],
            'amount'=> $validated['amount'],
            'tax_amount'=> $validated['tax_amount'],
            'tax_rate'=> $validated['tax_rate'],
            'number'=> $lastInvoiceNumber+1,
            'account_id'=>$validated['account_id'] ?? null,
            'main_shift_id'=>$validated['main_shift_id'],
            'product_id'=>$validated['product_id'],
        ]);


        $shift =  MainShift::find($request->main_shift_id);
   
        if(!$shift){
            return response()->json([
                'success' => false,
                'message' => 'لم يتم فتح وردية بعد'
            ], 404);
        }


        if($request->account_id && $request->type == 'debit'){
            $account = Account::find($request->account_id);
            if(!$account){
                return response()->json(['success' => false, 'message' => 'account not found'], 404);
            }

            $this->updateDebit($account ,$request->amount);
            $shift->total_money_client += $request->amount;
            $shift->total_shift_money += $request->amount;
            $shift->save();
        }
        DB::commit();
        return new SalesInvoiceResource($salesInvoice);

    } catch (\Exception $e) {
        DB::rollBack();
        return response()->json(['status' => false, 'message' => $e->getMessage()], 500);
    }
    }


    public function update(Request $request,$id)
    {
        $validated = $request->validate([
            'address' => 'nullable|string|max:255',
            'tax_no' => 'nullable|string|max:255',
            'tax_name' => 'nullable|string|max:255',
            'client_name' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:20',
            'type' => 'required|in:cash,debit',
            'date' => 'required|date',
            'liters' => 'required|integer',
            'amount' => 'required|numeric',
            'tax_amount' => 'required|numeric',
            'tax_rate' => 'required|numeric',
            // 'number' => 'required|string|max:255',
            'account_id' => 'nullable|exists:accounts,id',
        ]);
    DB::beginTransaction();
    try {

        $salesInvoice = SalesInvoice::find($id);
        if (!$salesInvoice) {
            return response()->json(['success' => false, 'message' => 'Sales Invoice not found'], 404);
        }
        $prevAmount = $salesInvoice->amount;


        if ($salesInvoice->account_id && $salesInvoice->type == 'debit') {


            $account = Account::find($salesInvoice->account_id);
            if($account){
                $this->updateDebitRev($account, $prevAmount); 
            }
        }

        $newAmount = $request->amount;
        $salesInvoice->amount = $newAmount;
        $salesInvoice->address = $request->address;
        $salesInvoice->tax_no = $request->tax_no;
        $salesInvoice->tax_name = $request->tax_name;
        $salesInvoice->client_name = $request->client_name;
        $salesInvoice->phone = $request->phone;
        $salesInvoice->type = $request->type;
        $salesInvoice->date = $request->date;
        $salesInvoice->tax_amount = $request->tax_amount;
        $salesInvoice->tax_rate = $request->tax_rate;
        // $salesInvoice->number = $salesInvoice->;
        $salesInvoice->account_id = $request->account_id ?? null;

        $salesInvoice->save();

        if ($request->account_id && $request->type == 'debit') {


            $account = Account::find($request->account_id);
            if($account){
                $this->updateDebit($account, $newAmount);
            }
        }


        $shift = MainShift::find($salesInvoice->main_shift_id);
        if ($shift) {
            $shift->total_money_client += ($newAmount - $prevAmount); 
            $shift->total_shift_money += ($newAmount - $prevAmount);

            $shift->save();
        }

        DB::commit();
        return response()->json(['success' => true, 'message' => 'Sales Invoice updated successfully'], 200);
    } catch (\Exception $e) {
        DB::rollBack();
        return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
    }
}

public function delete($id)
{
    DB::beginTransaction();
    try {

        $salesInvoice = SalesInvoice::find($id);
        if (!$salesInvoice) {
            return response()->json(['success' => false, 'message' => 'Sales Invoice not found'], 404);
        }





        if ($salesInvoice->account_id && $salesInvoice->type == 'debit') {

            $account = Account::find($salesInvoice->account_id);
            if($account){
                $this->updateDebitRev($account, $salesInvoice->amount); 

            }
        }

        $salesInvoice->delete();


        $shift = MainShift::find($salesInvoice->main_shift_id);
        if ($shift) {
            $shift->total_money_client -= $salesInvoice->amount; 
            $shift->total_shift_money -= $salesInvoice->amount;

            $shift->save();
        }

        DB::commit();
        return response()->json(['success' => true, 'message' => 'Sales Invoice deleted successfully'], 200);
    } catch (\Exception $e) {
        DB::rollBack();
        return response()->json(['success' => false, 'message' => $e->getMessage()], 500);
    }
}

}
