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
use App\Models\SalesInvoice;  
use App\Models\ProductMove;  
use App\Models\MainShift;  

use App\Http\Resources\MainShiftResource;  
use App\Http\Resources\ProductMoveResource;  
use App\Http\Resources\SalesInvoiceResource;  


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

        // $page = $request->input('page', 1);
        // $itemsPerPage = $request->input('itemsPerPage', 10);
    

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





    public function getProductsReports(Request $request)
    {
        
        $startDate = $request->input('startDate', null);
        $endDate = $request->input('endDate', null);

        $today = $request->input('today', null);
        $thisYear = $request->input('thisYear', null);


        $query = ProductMove::query();


        if (!empty($today)) {
            $query->whereDate('date', '=', now()->toDateString());
        } elseif (!empty($thisYear)) {
            $query->whereYear('date', '=', now()->year);
        } else {
            if (!empty($startDate)) {
                $query->whereDate('date', '>=', $startDate);
            }
            if (!empty($endDate)) {
                $query->whereDate('date', '<=', $endDate);
            }
        }

        $totalCount = $query->count();
        $totalAmountMoney = $query->sum('total_price');
        $totalAmountLiters = $query->sum('liters');

        $moves = $query->get();
     

        return response()->json([
            'expense_invoices' => ProductMoveResource::collection($moves),
            'totalCount' => $totalCount,
            'totalAmountMoney' => $totalAmountMoney,
            'totalAmountLiters' => $totalAmountLiters,       
        
        ]);

    }


    public function getSalesInvoicesReports(Request $request)
    {

        $startDate = $request->input('startDate', null);
        $endDate = $request->input('endDate', null);

        $today = $request->input('today', null);
        $thisYear = $request->input('thisYear', null);

        $account_id = $request->input('account_id', null);

        $accounts = Account::where('parent_id', 12)->get();



        foreach ($accounts as $account) {
            $query = SalesInvoice::where('account_id', $account->id);
            if (!empty($today)) {
                $query->whereDate('date', '=', now()->toDateString());
            } elseif (!empty($thisYear)) {
                $query->whereYear('date', '=', now()->year);
            } else {
                if (!empty($startDate)) {
                    $query->whereDate('date', '>=', $startDate);
                }
                if (!empty($endDate)) {
                    $query->whereDate('date', '<=', $endDate);
                }
            }
    
            $totalCount = $query->count();
            $totalAmount = $query->sum('amount');
            $totalAmountLiters = $query->sum('liters');

            $saleInvoices = $query->get();
            $accountDetails[$account->account_name] = [
                'account_name' => $account->account_name,
                'expense_invoices' => SalesInvoiceResource::collection($saleInvoices),
                'totalCount' => $totalCount,
                'totalAmount' => $totalAmount,
                'totalAmountLiters' => $totalAmountLiters,


                
            ];
        }

        return response()->json([
            $accountDetails
        ]);
    }
    
    public function getShiftsReports(Request $request)
    {

        $startDate = $request->input('startDate', null);
        $endDate = $request->input('endDate', null);

        $today = $request->input('today', null);
        $thisYear = $request->input('thisYear', null);

        $account_id = $request->input('account_id', null);

        $query = MainShift::where('status' , 'approved');
            if (!empty($today)) {
                $query->whereDate('date', '=', now()->toDateString());
            } elseif (!empty($thisYear)) {
                $query->whereYear('date', '=', now()->year);
            } else {
                if (!empty($startDate)) {
                    $query->whereDate('date', '>=', $startDate);
                }
                if (!empty($endDate)) {
                    $query->whereDate('date', '<=', $endDate);
                }
            }
    
            $totalCount = $query->count();
            $totalAmount = $query->sum('total_shift_money');
            $totalAmountCash = $query->sum('total_money_cash');
            $totalAmountClient = $query->sum('total_money_client');
            $totalAmountOnline = $query->sum('total_money_online');

            $shifts= $query->get();


         return response()->json([
                // 'account_name' => $account->name,
                'shifts' => MainShiftResource::collection($shifts),
                'totalCount' => $totalCount,
                'totalAmount' => $totalAmount,
                'totalAmountCash' => $totalAmountCash,
                'totalAmountClient' => $totalAmountClient,
                'totalAmountOnline' => $totalAmountOnline,
            ]);
        

     
    }
    
    public function getPurchaseInvoicesReports(Request $request)
    {

        $startDate = $request->input('startDate', null);
        $endDate = $request->input('endDate', null);

        $today = $request->input('today', null);
        $thisYear = $request->input('thisYear', null);

        // $year = $request->input('endDate', null);
        $supplierId = $request->input('supplier_id', null);
        $accountId = $request->input('account_id', null);




        $query = PurchaseInvoice::with(['product', 'account', 'supplier']);


        if (!empty($today)) {
            $query->whereDate('date', '=', now()->toDateString());
        } elseif (!empty($thisYear)) {
            $query->whereYear('date', '=', now()->year);
        } else {
            if (!empty($startDate)) {
                $query->whereDate('date', '>=', $startDate);
            }
            if (!empty($endDate)) {
                $query->whereDate('date', '<=', $endDate);
            }
        }



    if (!empty($supplierId)) {
        $query->where('supplier_id', '=', $supplierId);
    }


    if (!empty($accountId)) {
        $query->where('account_id', '=', $accountId);
    }


        $totalCount = $query->count();
        $totalAmount = $query->sum('total_cash');
        $totalLiters = $query->sum('amount_letters');
        $invoices = $query->get();
    
        return response()->json([
            'totalCount' => $totalCount,
            'totalAmount' => $totalAmount,
            'totalLiters' => $totalLiters,
            'invoices' => $invoices,
        ]);
    
    }


    public function getExpenseInvoicesReports(Request $request)
    {


        $accounts = Account::whereIn('parent_id', [32,33])->get();
        $accountDetails = [];

        $startDate = $request->input('startDate', null);
        $endDate = $request->input('endDate', null);

        $today = $request->input('today', null);
        $thisYear = $request->input('thisYear', null);

        // $supplierId = $request->input('expense_id', null);
        // $accountId = $request->input('account_id', null);

        foreach ($accounts as $account) {
            $query = ExpenseInvoice::with(['account' , 'expense'])->where('account_id', $account->id);
            if (!empty($today)) {
                $query->whereDate('date', '=', now()->toDateString());
            } elseif (!empty($thisYear)) {
                $query->whereYear('date', '=', now()->year);
            } else {
                if (!empty($startDate)) {
                    $query->whereDate('date', '>=', $startDate);
                }
                if (!empty($endDate)) {
                    $query->whereDate('date', '<=', $endDate);
                }
            }
    
            $totalCount = $query->count();
            $totalAmount = $query->sum('total_cash');
            $expenseInvoices = $query->get();
            $accountDetails[$account->account_name] = [
                'account_name' => $account->account_name,
                'expense_invoices' => ExpenseInvoiceResource::collection($expenseInvoices),
                'totalCount' => $totalCount,
                'totalAmount' => $totalAmount,
            ];
        }
     
    
        return response()->json([
            $accountDetails
        ]);
    
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
    
        $paginatedInvoices = $query->get();
    
        return PurchaseInvoiceResource::collection($paginatedInvoices);
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
