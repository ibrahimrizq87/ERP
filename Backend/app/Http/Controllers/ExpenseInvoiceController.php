<?php

namespace App\Http\Controllers;

use App\Models\ExpenseInvoice;
use Illuminate\Http\Request;
use App\Models\Account;
use Illuminate\Support\Facades\DB;
use App\Http\Resources\ExpenseInvoiceResource;
use Illuminate\Support\Facades\Storage;

class ExpenseInvoiceController extends Controller
{
    public function index()
    {
        $invoices = ExpenseInvoice::with(['account', 'expense'])->get();
        return ExpenseInvoiceResource::collection($invoices);
    }

    public function store(Request $request)
    {
        DB::beginTransaction();

        try {
            $validated = $request->validate([
                'date' => 'required|date',
                'total_cash' => 'required|numeric',
                'account_id' => 'required|exists:accounts,id',
                'expense_id' => 'required|exists:accounts,id',
                'payment_type' => 'required|in:cash,online',
                'note' => 'nullable|string',
                'online_payment_image' => 'nullable|image',
                'tax_amount' => 'required|numeric',
                'tax_rate' => 'required|numeric',
                'invoice_image' => 'nullable|image',
            ]);

            $online_payment_path = '';
            if ($request->hasFile("online_payment_image")) {
                $image = $request->file("online_payment_image");
                $online_payment_path = $image->store('online_payment_images', 'uploads');
                $online_payment_path = asset('uploads/' . $online_payment_path);
            }

            $invoice_image_path = '';
            if ($request->hasFile("invoice_image")) {
                $image = $request->file("invoice_image");
                $invoice_image_path = $image->store('invoice_images', 'uploads');
                $invoice_image_path = asset('uploads/' . $invoice_image_path);
            }

         


            $account = Account::find($validated['account_id']);
            $expense = Account::find($validated['expense_id']);
            $tax =Account::find(54);
    

            $this->updateDebit($account , $validated['total_cash']);
            $this->updateCredit($expense , $validated['total_cash']);
            $this->updateCredit($tax , $validated['tax_amount']);

            // $account_parent =Account::find($account->parent_id);
            // $expense_parent =Account::find($expense->parent_id);
            // $tax_parent =Account::find($tax->parent_id);
            

            // $account->net_debit += $validated['total_cash'];
            // $account->current_balance -= $validated['total_cash'];
    
            // $account_parent->net_debit += $validated['total_cash'];
            // $account_parent->current_balance -= $validated['total_cash'];
    
            // $expense->net_credit += $validated['total_cash'];
            // $expense->current_balance += $validated['total_cash'];
    
            // $expense_parent->net_credit += $validated['total_cash'];
            // $expense_parent->current_balance += $validated['total_cash'];
    


            // $tax->net_credit += $validated['tax_amount'];
            // $tax->current_balance += $validated['tax_amount'];
    
            // $tax_parent->net_credit += $validated['tax_amount'];
            // $tax_parent->current_balance += $validated['tax_amount'];

            // $tax_parent->save();
            // $tax->save();
            // $expense_parent->save();
            // $expense->save();
            // $account->save();
            // $expense_parent->save();


            $invoice = ExpenseInvoice::create([
                'date' => $validated['date'],
                'total_cash' => $validated['total_cash'],
                'account_id' => $validated['account_id'],
                'expense_id' => $validated['expense_id'],
                'payment_type' => $validated['payment_type'],
                'note' => $validated['note'] ?? '',
                'online_payment_image' => $online_payment_path,
                'tax_amount' => $validated['tax_amount'],
                'tax_rate' => $validated['tax_rate'],
                'invoice_image' => $invoice_image_path,
            ]);

            DB::commit();

            return new ExpenseInvoiceResource($invoice);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['status' => false, 'message' => $e->getMessage()], 500);
        }
    }



    public function update(Request $request, $id)
    {
        DB::beginTransaction();
    
        try {
            $validated = $request->validate([
                'date' => 'required|date',
                'total_cash' => 'required|numeric',
                'account_id' => 'required|exists:accounts,id',
                'expense_id' => 'required|exists:accounts,id',
                'payment_type' => 'required|in:cash,online',
                'note' => 'nullable|string',
                'online_payment_image' => 'nullable|image',
                'tax_amount' => 'required|numeric',
                'tax_rate' => 'required|numeric',
                'invoice_image' => 'nullable|image',
            ]);
    
            $invoice = ExpenseInvoice::findOrFail($id);
    

            $online_payment_path = $invoice->online_payment_image;
            if ($request->hasFile("online_payment_image")) {
                $image = $request->file("online_payment_image");
                $online_payment_path = $image->store('online_payment_images', 'uploads');
                $online_payment_path = asset('uploads/' . $online_payment_path);
            }
    
            $invoice_image_path = $invoice->invoice_image;
            if ($request->hasFile("invoice_image")) {
                $image = $request->file("invoice_image");
                $invoice_image_path = $image->store('invoice_images', 'uploads');
                $invoice_image_path = asset('uploads/' . $invoice_image_path);
            }
    

            $oldAccount = Account::find($invoice->account_id);
            $oldExpense = Account::find($invoice->expense_id);
            $oldTax = Account::find(54);

            // $oldAccount_parent =Account::find($oldAccount->parent_id);

            // $oldAccount_parent->net_debit -= $invoice->total_cash;
            // $oldAccount_parent->current_balance += $invoice->total_cash;

            $this->updateDebitRev($oldAccount , $invoice->total_cash);
            $this->updateCreditRev($oldExpense , $invoice->total_cash);
            $this->updateCreditRev($oldTax , $invoice->tax_amount);

            // $oldAccount->net_debit -= $invoice->total_cash;
            // $oldAccount->current_balance += $invoice->total_cash;
    
            // $oldExpense->net_credit -= $invoice->total_cash;
            // $oldExpense->current_balance -= $invoice->total_cash;
    
            // $oldTax->net_credit -= $invoice->tax_amount;
            // $oldTax->current_balance -= $invoice->tax_amount;
    
            // $oldAccount->save();
            // $oldExpense->save();
            // $oldTax->save();
    

            $account = Account::find($validated['account_id']);
            $expense = Account::find($validated['expense_id']);
            $tax = Account::find(54);


            $this->updateDebit($account , $validated['total_cash']);
            $this->updateCredit($expense , $validated['total_cash']);
            $this->updateCredit($tax , $validated['tax_amount']);


            // $account_parent->net_debit += $validated['total_cash'];
            // $account_parent->current_balance -= $validated['total_cash'];

            // $account->net_debit += $validated['total_cash'];
            // $account->current_balance -= $validated['total_cash'];
    
            // $expense->net_credit += $validated['total_cash'];
            // $expense->current_balance += $validated['total_cash'];
    
            // $tax->net_credit += $validated['tax_amount'];
            // $tax->current_balance += $validated['tax_amount'];
    
            // $account->save();
            // $expense->save();
            // $tax->save();
    

            $invoice->update([
                'date' => $validated['date'],
                'total_cash' => $validated['total_cash'],
                'account_id' => $validated['account_id'],
                'expense_id' => $validated['expense_id'],
                'payment_type' => $validated['payment_type'],
                'note' => $validated['note'] ?? '',
                'online_payment_image' => $online_payment_path,
                'tax_amount' => $validated['tax_amount'],
                'tax_rate' => $validated['tax_rate'],
                'invoice_image' => $invoice_image_path,
            ]);
    
            DB::commit();
    
            return new ExpenseInvoiceResource($invoice);
    
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['status' => false, 'message' => $e->getMessage()], 500);
        }
    }
    
    public function show(ExpenseInvoice $expenseInvoice)
    {
        $expenseInvoice->load(['account', 'expense']);
        return new ExpenseInvoiceResource($expenseInvoice);
    }

    // public function destroy(ExpenseInvoice $expenseInvoice)
    // {
    //     $expenseInvoice->delete();
    //     return response()->json(['message' => 'Expense Invoice deleted successfully.']);
    // }
    public function destroy($id)
{
    DB::beginTransaction();

    try {
        // Find the invoice
        $invoice = ExpenseInvoice::findOrFail($id);

        // Retrieve related accounts
        $account = Account::find($invoice->account_id);
        $expense = Account::find($invoice->expense_id);
        $tax = Account::find(54);

        // $account_parent = Account::find($account->parent_id);
        // $expense_parent = Account::find($expense->parent_id);
        // $tax_parent = Account::find($tax->parent_id);



        $this->updateDebitRev($account , $invoice->total_cash);
        $this->updateCreditRev($expense , $invoice->total_cash);
        $this->updateCreditRev($tax , $invoice->tax_amount);
        
        // $account->net_debit -= $invoice->total_cash;
        // $account->current_balance += $invoice->total_cash;

        // $account_parent->net_debit -= $invoice->total_cash;
        // $account_parent->current_balance += $invoice->total_cash;

        // $expense->net_credit -= $invoice->total_cash;
        // $expense->current_balance -= $invoice->total_cash;

        // $expense_parent->net_credit -= $invoice->total_cash;
        // $expense_parent->current_balance -= $invoice->total_cash;

        // $tax->net_credit -= $invoice->tax_amount;
        // $tax->current_balance -= $invoice->tax_amount;

        // $tax_parent->net_credit -= $invoice->tax_amount;
        // $tax_parent->current_balance -= $invoice->tax_amount;


        // $tax_parent->save();
        // $tax->save();
        // $expense_parent->save();
        // $expense->save();
        // $account_parent->save();
        // $account->save();

        if ($invoice->online_payment_image) {
            $onlinePaymentImagePath = str_replace(asset('uploads'), 'uploads', $invoice->online_payment_image);
            Storage::disk('uploads')->delete($onlinePaymentImagePath);
        }

        if ($invoice->invoice_image) {
            $invoiceImagePath = str_replace(asset('uploads'), 'uploads', $invoice->invoice_image);
            Storage::disk('uploads')->delete($invoiceImagePath);
        }

        // Delete the invoice
        $invoice->delete();

        DB::commit();

        return response()->json(['status' => true, 'message' => 'Invoice deleted successfully.']);

    } catch (\Exception $e) {
        DB::rollBack();
        return response()->json(['status' => false, 'message' => $e->getMessage()], 500);
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


}
