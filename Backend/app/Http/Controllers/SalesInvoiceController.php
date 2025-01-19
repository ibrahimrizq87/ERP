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
        $invoice =SalesInvoice::where('shift_id',$shift_id);
        return new SalesInvoiceResource($invoice);
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
            'liters' => 'required|integer',
            'amount' => 'required|numeric',
            'tax_amount' => 'required|numeric',
            'tax_rate' => 'required|numeric',
            'number' => 'required|string|max:255',
            'account_id' => 'nullable|exists:accounts,id',
            'product_id' => 'required|exists:products,id',

            'main_shift_id' => 'required|exists:main_shifts,id',
        ]);
        DB::beginTransaction();

        try {
    
        $salesInvoice = SalesInvoice::create($validated);


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
            'number' => 'required|string|max:255',
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
        $salesInvoice->number = $request->number;
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
            $this->updateDebitRev($account, $salesInvoice->amount); 
        }

        $salesInvoice->delete();


        $shift = MainShift::find($salesInvoice->main_shift_id);
        if ($shift) {
            $shift->total_money_client -= $salesInvoice->amount; 
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
