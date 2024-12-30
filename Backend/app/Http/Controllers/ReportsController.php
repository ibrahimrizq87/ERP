<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PurchaseInvoice;
use App\Models\Account;
use Illuminate\Support\Facades\DB;
use App\Http\Resources\PurchaseInvoiceResource;
use App\Http\Resources\ExpenseInvoiceResource;
use App\Models\ExpenseInvoice;
use App\Models\Shift;  

class ReportsController extends Controller
{


    public function getByAccountId($accountId)
{
    $documents = PaymentDocument::where(function ($query) use ($accountId) {
        $query->where('company_account_id', $accountId)
              ->orWhere('customer_account_id', $accountId);
    })->with(['company_account', 'customer_account'])->get();

    return PaymentDocumentResource::collection($documents);
}





    public function getAllPurchaseInvoicesByAccout(Request $request,$id)
    {
    $account = Account::find($id);
        if(!$account){
            return response()->json([
                'message' => 'account not found',
            ], 404);
        }

        $page = $request->input('page', 1);
        $itemsPerPage = $request->input('itemsPerPage', 10);
    

        $startDate = $request->input('startDate', null);
        $endDate = $request->input('endDate', null);
    

    

        $query = PurchaseInvoice::with(['product', 'account', 'supplier'])
        ->where('account_id',$account->id)
        ->where('supplier_id',$account->id);
    

        if (!empty($startDate)) {
            $query->whereDate('date', '>=', $startDate);
        }
        if (!empty($endDate)) {
            $query->whereDate('date', '<=', $endDate);
        }
    
        $paginatedInvoices = $query->paginate($itemsPerPage, ['*'], 'page', $page);
    
        return PurchaseInvoiceResource::collection($paginatedInvoices)
            ->additional(['total' => $paginatedInvoices->total()]);
    }
    

    public function getAllPurchaseInvoicesByDate(Request $request)
    {

        $page = $request->input('page', 1);
        $itemsPerPage = $request->input('itemsPerPage', 10);
    

        $startDate = $request->input('startDate', null);
        $endDate = $request->input('endDate', null);
    

        $searchCriteria = $request->input('searchCriteria', null);
        $searchTerm = $request->input('searchTerm', null);
    

        $query = PurchaseInvoice::with(['product', 'account', 'supplier']);
    

        if (!empty($startDate)) {
            $query->whereDate('date', '>=', $startDate);
        }
        if (!empty($endDate)) {
            $query->whereDate('date', '<=', $endDate);
        }
    

        if (!empty($searchTerm)) {
            if ($searchCriteria === 'supplier') {
                $query->whereHas('supplier', function ($q) use ($searchTerm) {
                    $q->where('account_name', 'LIKE', '%' . $searchTerm . '%'); 
                });
            } elseif ($searchCriteria === 'account') {
                $query->whereHas('account', function ($q) use ($searchTerm) {
                    $q->where('account_name', 'LIKE', '%' . $searchTerm . '%');
                });
            } elseif ($searchCriteria === 'product') {
                $query->whereHas('product', function ($q) use ($searchTerm) {
                    $q->where('name', 'LIKE', '%' . $searchTerm . '%');
                });
            }
        }
    
        $paginatedInvoices = $query->paginate($itemsPerPage, ['*'], 'page', $page);
    
        return PurchaseInvoiceResource::collection($paginatedInvoices)
            ->additional(['total' => $paginatedInvoices->total()]);
    }
    



    public function getAllExpenceInvoicesByDate(Request $request)
    {

        $page = $request->input('page', 1);
        $itemsPerPage = $request->input('itemsPerPage', 10);
    

        $startDate = $request->input('startDate', null);
        $endDate = $request->input('endDate', null);
    

        $searchCriteria = $request->input('searchCriteria', null);
        $searchTerm = $request->input('searchTerm', null);
    
        $query = ExpenseInvoice::with(['account', 'expense']);

    

        if (!empty($startDate)) {
            $query->whereDate('date', '>=', $startDate);
        }
        if (!empty($endDate)) {
            $query->whereDate('date', '<=', $endDate);
        }
    

        if (!empty($searchTerm)) {
            if ($searchCriteria === 'expense') {
                $query->whereHas('expense', function ($q) use ($searchTerm) {
                    $q->where('account_name', 'LIKE', '%' . $searchTerm . '%'); 
                });
            } elseif ($searchCriteria === 'account') {
                $query->whereHas('account', function ($q) use ($searchTerm) {
                    $q->where('account_name', 'LIKE', '%' . $searchTerm . '%');
                });
            } 
        }
    
        $paginatedInvoices = $query->paginate($itemsPerPage, ['*'], 'page', $page);
    
        return ExpenseInvoiceResource::collection($paginatedInvoices)
            ->additional(['total' => $paginatedInvoices->total()]);
    }






    public function getAllExpenseInvoicesThisYear(Request $request)
    {
        $currentYear = now()->year;
        $page = $request->input('page', 1);
        $itemsPerPage = $request->input('itemsPerPage', 10);
    
        $query = ExpenseInvoice::with(['account', 'expense'])
            ->whereYear('date', $currentYear);
    
        $paginatedInvoices = $query->paginate($itemsPerPage, ['*'], 'page', $page);
    
        return ExpenseInvoiceResource::collection($paginatedInvoices)
            ->additional(['total' => $paginatedInvoices->total()]);
    }
    
    public function getAllPurchaseInvoicesThisYear(Request $request)
    {
        $currentYear = now()->year;
        $page = $request->input('page', 1);
        $itemsPerPage = $request->input('itemsPerPage', 10);
    
        $query = PurchaseInvoice::with(['product', 'account', 'supplier'])
            ->whereYear('date', $currentYear);
    
        $paginatedInvoices = $query->paginate($itemsPerPage, ['*'], 'page', $page);
    
        return PurchaseInvoiceResource::collection($paginatedInvoices)
            ->additional(['total' => $paginatedInvoices->total()]);
    }
    




    public function getAllShiftTaxesByDateAndYear(Request $request)
    {
        $page = $request->input('page', 1);
        $itemsPerPage = $request->input('itemsPerPage', 10);
    
        $startDate = $request->input('startDate', null);
        $endDate = $request->input('endDate', null);
    
        $query = ShiftTax::query(); 
    
        if (!empty($startDate)) {
            $query->whereDate('date', '>=', $startDate);
        }
        if (!empty($endDate)) {
            $query->whereDate('date', '<=', $endDate);
        }
    
        $paginatedShiftTaxes = $query->paginate($itemsPerPage, ['*'], 'page', $page);
    
        return ShiftTaxResource::collection($paginatedShiftTaxes)
            ->additional(['total' => $paginatedShiftTaxes->total()]);
    }
    


    
}
