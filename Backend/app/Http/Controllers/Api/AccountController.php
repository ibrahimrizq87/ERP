<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

use App\Models\Account;
use App\Http\Resources\AccountResource;

class AccountController extends Controller
{
    public function index()
    {
        $accounts = Account::with('parent')->get();
        return AccountResource::collection($accounts);
    }

    public function store(Request $request)
    {

        $validator = Validator::make($request->all(), [
            'account_name' => 'required|string|max:255|unique:accounts,account_name',
            'phone' => 'nullable|string|max:255',
            'parent_id' => 'nullable|exists:accounts,id',
            'current_balance' => 'required|numeric|min:0',
            'net_debit' => 'nullable|numeric|min:0',
            'net_credit' => 'nullable|numeric|min:0',

        ]);
    
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }


        $data =$request->all();
        $account = Account::create(
       [
        'account_name' => $data['account_name'],
        'phone' => $data['phone'] ?? '',
        'parent_id' => $data['parent_id'],
        'can_delete' => true,
        'current_balance' => $data['current_balance'] ?? 0,
        'net_debit' => $data['net_debit']?? 0,
        'net_credit' => $data['net_credit']??0,
       ]
        );
        return new AccountResource($account);
    }

    public function show(Account $account)
    {
        $account->load('parent');
        return new AccountResource($account);
    }

    public function getAccountById($id)
    {

        $account = Account::find($id);
        if (!$account){
            return response()->json(['errors' => 'account not found'], 404);

        }
        $account->load('parent');
        return new AccountResource($account);
    }
    
    
    public function mainAccount()
    {
        $accounts = Account::where('parent_id' ,null)->get();
        return AccountResource::collection($accounts);
    }

    public function getAccountsByParent($parent_id)
    {
        $accounts = Account::where('parent_id' ,$parent_id)->get();
        return AccountResource::collection($accounts);
    }


    public function getCompanyAccount()
    {

        $accounts = Account::whereIn('parent_id', [1, 4])->get();
        return AccountResource::collection($accounts);
    }
    


    public function getCustomerAccounts()
{
    // return response().json('herererererer');

    $accounts = Account::whereIn('parent_id', [2,3,5,6])->get();
    return AccountResource::collection($accounts);
}

    // public function update(Request $request, Account $account)
    // {

    //     $validator = Validator::make($request->all(), [
    //         'account_name' => 'required|string|max:255|unique:accounts,account_name',
    //         'phone' => 'nullable|string|max:255',
    //         'parent_id' => 'nullable|exists:accounts,id',
    //         'can_delete' => true,
    //         // 'can_delete' => 'required|boolean',
    //         'current_balance' => 'required|numeric|min:0',
    //         'net_debit' => 'required|numeric|min:0',
    //         'net_credit' => 'required|numeric|min:0',

    //     ]);
    
    //     if ($validator->fails()) {
    //         return response()->json(['errors' => $validator->errors()], 400);
    //     }
        
    //     $account->update($request->validated());
    //     return new AccountResource($account);
    // }
    public function update(Request $request, Account $account)
{
    $validator = Validator::make($request->all(), [
        'account_name' => 'required|string|max:255|unique:accounts,account_name,' . $account->id,
        'phone' => 'nullable|string|max:255',
        'parent_id' => 'nullable|exists:accounts,id',
        'current_balance' => 'required|numeric|min:0',
        'net_debit' => 'required|numeric|min:0',
        'net_credit' => 'required|numeric|min:0',
    ]);

    if ($validator->fails()) {
        return response()->json(['errors' => $validator->errors()], 400);
    }

    // Update account details
    $account->update($request->only([
        'account_name', 
        'phone', 
        'parent_id', 
        'current_balance', 
        'net_debit', 
        'net_credit'
    ]));

    return new AccountResource($account);
}


    public function destroy(Account $account)
    {
        if ($account->can_delete) {
            $account->delete();
            return response()->json(['message' => 'Account deleted successfully']);
        }

        return response()->json(['message' => 'This account cannot be deleted'], 403);
    }
}
