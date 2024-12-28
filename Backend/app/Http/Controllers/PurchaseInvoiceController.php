<?php

namespace App\Http\Controllers;

use App\Models\PurchaseInvoice;
use Illuminate\Http\Request;
use App\Models\Account;
use Illuminate\Support\Facades\DB;
use App\Http\Resources\PurchaseInvoiceResource;
use Illuminate\Support\Facades\Storage;

class PurchaseInvoiceController extends Controller
{

    

       public function index()
       {
           $invoices = PurchaseInvoice::with(['product', 'account', 'supplier'])->get();
           return PurchaseInvoiceResource::collection($invoices);
       }
   
     

       public function store(Request $request)
       {


        DB::beginTransaction();

    try{ 
           $validated = $request->validate([
               'date' => 'required|date',
               'product_id' => 'required|exists:products,id',
               'price' => 'required|numeric',
               'amount_letters' => 'required|integer',
               'total_cash' => 'required|numeric',
               'account_id' => 'required|exists:accounts,id',
               'supplier_id' => 'required|exists:accounts,id',
               'payment_type' => 'required|in:cash,online',
               'note' => 'nullable|string',
               'online_payment_image' => 'nullable|image',
               'tax_amount' => 'required|numeric',
               'tax_rate' => 'required|numeric',
           ]);



        $my_path = '';
        if(request()->hasFile("online_payment_image")){
            $image = request()->file("online_payment_image");
            $my_path=$image->store('online_payment_invoice_image','uploads');
            $my_path= asset('uploads/' . $my_path); 
        }

        $account =Account::find($validated['account_id']);
        $supplier =Account::find($validated['supplier_id']);
        $tax =Account::find(9);

        $account_parent =Account::find($account->parent_id);
        $supplier_parent =Account::find($supplier->parent_id);
        $tax_parent =Account::find($tax->parent_id);

        $account->net_debit += $validated['total_cash'];
        $account->current_balance -= $validated['total_cash'];

        $account_parent->net_debit += $validated['total_cash'];
        $account_parent->current_balance -= $validated['total_cash'];

        $supplier->net_credit += $validated['total_cash'];
        $supplier->current_balance += $validated['total_cash'];

        $supplier_parent->net_credit += $validated['total_cash'];
        $supplier_parent->current_balance += $validated['total_cash'];

        $tax->net_credit += $validated['tax_amount'];
        $tax->current_balance += $validated['tax_amount'];

        $tax_parent->net_credit += $validated['tax_amount'];
        $tax_parent->current_balance += $validated['tax_amount'];



        $tax_parent->save();
        $tax->save();
        $supplier_parent->save();
        $supplier->save();
        $account_parent->save();
        $account->save();


           $invoice = PurchaseInvoice::create(
            [
                'date' =>$validated['date'],
                'product_id' => $validated['product_id'],
                'price' => $validated['price'],
                'amount_letters' => $validated['amount_letters'],
                'total_cash' => $validated['total_cash'],
                'account_id' => $validated['account_id'],
                'supplier_id' => $validated['supplier_id'],
                'payment_type' => $validated['payment_type'],
                'note' => $validated['note']??'',
                'online_payment_image' =>  $my_path ,
                'tax_amount' => $validated['tax_amount'],
                'tax_rate' => $validated['tax_rate'],
            ]
           );
           DB::commit();

           return new PurchaseInvoiceResource($invoice);



     
       
       
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
   

       public function show(PurchaseInvoice $purchaseInvoice)
       {
        $purchaseInvoice->load(['product', 'account', 'supplier']);
           return new PurchaseInvoiceResource($purchaseInvoice);
       }
   
 
       public function update(Request $request, PurchaseInvoice $purchaseInvoice)
       {
           DB::beginTransaction();
       
           try {
               $validated = $request->validate([
                   'date' => 'required|date',
                   'product_id' => 'required|exists:products,id',
                   'price' => 'required|numeric',
                   'amount_letters' => 'required|integer',
                   'total_cash' => 'required|numeric',
                   'account_id' => 'required|exists:accounts,id',
                   'supplier_id' => 'required|exists:accounts,id',
                   'payment_type' => 'required|in:cash,online',
                   'note' => 'nullable|string',
                   'online_payment_image' => 'nullable|image',
                   'tax_amount' => 'required|numeric',
                   'tax_rate' => 'required|numeric',
               ]);
       
               // Rollback changes made by the previous invoice
               $previousAccount = Account::find($purchaseInvoice->account_id);
               $previousSupplier = Account::find($purchaseInvoice->supplier_id);
               $previousTax = Account::find(9);
       
               $previousAccountParent = Account::find($previousAccount->parent_id);
               $previousSupplierParent = Account::find($previousSupplier->parent_id);
               $previousTaxParent = Account::find($previousTax->parent_id);
       
               $previousAccount->net_debit -= $purchaseInvoice->total_cash;
               $previousAccount->current_balance += $purchaseInvoice->total_cash;
       
               $previousAccountParent->net_debit -= $purchaseInvoice->total_cash;
               $previousAccountParent->current_balance += $purchaseInvoice->total_cash;
       
               $previousSupplier->net_credit -= $purchaseInvoice->total_cash;
               $previousSupplier->current_balance -= $purchaseInvoice->total_cash;
       
               $previousSupplierParent->net_credit -= $purchaseInvoice->total_cash;
               $previousSupplierParent->current_balance -= $purchaseInvoice->total_cash;
       
               $previousTax->net_credit -= $purchaseInvoice->tax_amount;
               $previousTax->current_balance -= $purchaseInvoice->tax_amount;
       
               $previousTaxParent->net_credit -= $purchaseInvoice->tax_amount;
               $previousTaxParent->current_balance -= $purchaseInvoice->tax_amount;
       
               $previousAccount->save();
               $previousAccountParent->save();
               $previousSupplier->save();
               $previousSupplierParent->save();
               $previousTax->save();
               $previousTaxParent->save();
       

               $newAccount = Account::find($validated['account_id']);
               $newSupplier = Account::find($validated['supplier_id']);
               $newTax = Account::find(9);
       
               $newAccountParent = Account::find($newAccount->parent_id);
               $newSupplierParent = Account::find($newSupplier->parent_id);
               $newTaxParent = Account::find($newTax->parent_id);
       
               $newAccount->net_debit += $validated['total_cash'];
               $newAccount->current_balance -= $validated['total_cash'];
       
               $newAccountParent->net_debit += $validated['total_cash'];
               $newAccountParent->current_balance -= $validated['total_cash'];
       
               $newSupplier->net_credit += $validated['total_cash'];
               $newSupplier->current_balance += $validated['total_cash'];
       
               $newSupplierParent->net_credit += $validated['total_cash'];
               $newSupplierParent->current_balance += $validated['total_cash'];
       
               $newTax->net_credit += $validated['tax_amount'];
               $newTax->current_balance += $validated['tax_amount'];
       
               $newTaxParent->net_credit += $validated['tax_amount'];
               $newTaxParent->current_balance += $validated['tax_amount'];
       
               $newAccount->save();
               $newAccountParent->save();
               $newSupplier->save();
               $newSupplierParent->save();
               $newTax->save();
               $newTaxParent->save();
       

               $my_path = $purchaseInvoice->online_payment_image;
               if ($request->hasFile("online_payment_image")) {
                   $image = $request->file("online_payment_image");
                   $my_path = $image->store('online_payment_invoice_image', 'uploads');
                   $my_path = asset('uploads/' . $my_path);
               }
       

               $purchaseInvoice->update([
                   'date' => $validated['date'],
                   'product_id' => $validated['product_id'],
                   'price' => $validated['price'],
                   'amount_letters' => $validated['amount_letters'],
                   'total_cash' => $validated['total_cash'],
                   'account_id' => $validated['account_id'],
                   'supplier_id' => $validated['supplier_id'],
                   'payment_type' => $validated['payment_type'],
                   'note' => $validated['note'] ?? '',
                   'online_payment_image' => $my_path,
                   'tax_amount' => $validated['tax_amount'],
                   'tax_rate' => $validated['tax_rate'],
               ]);
       
               DB::commit();
       
               return new PurchaseInvoiceResource($purchaseInvoice);
       
           } catch (\Exception $e) {
               DB::rollBack();
               return response()->json(
                   [
                       'status' => false,
                       'message' => $e->getMessage(),
                   ],
                   500
               );
           }
       }
       

    //    public function destroy(PurchaseInvoice $purchaseInvoice)
    //    {
    //        $purchaseInvoice->delete();
    //        return response()->json(['message' => 'Purchase Invoice deleted successfully.']);
    //    }
    public function destroy($id)
{
    DB::beginTransaction();

    try {

        $invoice = PurchaseInvoice::findOrFail($id);


        $account = Account::find($invoice->account_id);
        $supplier = Account::find($invoice->supplier_id);
        $tax = Account::find(9);

        $account_parent = Account::find($account->parent_id);
        $supplier_parent = Account::find($supplier->parent_id);
        $tax_parent = Account::find($tax->parent_id);


        $account->net_debit -= $invoice->total_cash;
        $account->current_balance += $invoice->total_cash;

        $account_parent->net_debit -= $invoice->total_cash;
        $account_parent->current_balance += $invoice->total_cash;

        $supplier->net_credit -= $invoice->total_cash;
        $supplier->current_balance -= $invoice->total_cash;

        $supplier_parent->net_credit -= $invoice->total_cash;
        $supplier_parent->current_balance -= $invoice->total_cash;

        $tax->net_credit -= $invoice->tax_amount;
        $tax->current_balance -= $invoice->tax_amount;

        $tax_parent->net_credit -= $invoice->tax_amount;
        $tax_parent->current_balance -= $invoice->tax_amount;


        $tax_parent->save();
        $tax->save();
        $supplier_parent->save();
        $supplier->save();
        $account_parent->save();
        $account->save();


        if ($invoice->online_payment_image) {
            $filePath = str_replace(asset('uploads/'), '', $invoice->online_payment_image);
            Storage::disk('uploads')->delete($filePath);
        }


        $invoice->delete();

        DB::commit();

        return response()->json(['status' => true, 'message' => 'Invoice deleted successfully.']);
    } catch (\Exception $e) {
        DB::rollBack();
        return response()->json(['status' => false, 'message' => $e->getMessage()], 500);
    }
}

}



