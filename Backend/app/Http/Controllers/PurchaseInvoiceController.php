<?php

namespace App\Http\Controllers;

use App\Models\PurchaseInvoice;
use Illuminate\Http\Request;
use App\Models\Account;
use App\Models\Product;

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
        $purchaes =Account::find(55);

        $tax =Account::find(54);
        $this->updateDebit($account , $validated['total_cash']);
        $this->updateCredit($supplier , $validated['total_cash']);
        $this->updateDebit($purchaes , $validated['total_cash']);
        $this->updateCredit($tax , $validated['tax_amount']);
        $product = Product::find($validated['product_id']);

        $product->amount += $validated['amount_letters'];

        $move = new ProductMove();  
        $move->data = $validated['date'];
        $move->liters =  $validated['amount_letters'];
        $move->total_price =  $validated['amount_letters'] * $product->price;
        $move->product_id =  $product->id;
        $move->main_shift_id = null;
        $move->type = 'to_us';
        $move->save();



        $product->save();

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
       

               $previousAccount = Account::find($purchaseInvoice->account_id);
               $previousSupplier = Account::find($purchaseInvoice->supplier_id);
               $previousTax = Account::find(54);
       


        $this->updateDebitRev($previousAccount , $purchaseInvoice->total_cash);
        $this->updateCreditRev($previousSupplier , $purchaseInvoice->total_cash);
        $this->updateCreditRev($previousTax , $purchaseInvoice->tax_amount);

               $newAccount = Account::find($validated['account_id']);
               $newSupplier = Account::find($validated['supplier_id']);
               $newTax = Account::find(54);


            $this->updateDebit($newAccount , $validated['total_cash']);
            $this->updateCredit($newSupplier , $validated['total_cash']);
            $this->updateCredit($newTax , $validated['tax_amount']);

               $my_path = $purchaseInvoice->online_payment_image;
               if ($request->hasFile("online_payment_image")) {
                   $image = $request->file("online_payment_image");
                   $my_path = $image->store('online_payment_invoice_image', 'uploads');
                   $my_path = asset('uploads/' . $my_path);
               }
       
               $product = Product::find($purchaseInvoice->product_id);
               $product->amount -= $purchaseInvoice->amount_letters;
               $product->save();

               $product = Product::find($validated['product_id']);
               $product->amount += $validated['amount_letters'];
               $product->save();

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
       

    public function destroy($id)
{
    DB::beginTransaction();

    try {

        $invoice = PurchaseInvoice::findOrFail($id);


        $account = Account::find($invoice->account_id);
        $supplier = Account::find($invoice->supplier_id);
        $tax = Account::find(54);

   

        $this->updateDebitRev($account , $invoice->total_cash);
        $this->updateCreditRev($supplier , $invoice->total_cash);
        $this->updateCreditRev($tax , $invoice->tax_amount);

        // $product = Product::find($invoice->product_id);
        // $product->amount -= $invoice->amount_letters;
        // $product->save();
     


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



