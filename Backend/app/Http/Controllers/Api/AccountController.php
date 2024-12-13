<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

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
            'can_delete' => 'required|boolean',
            'current_balance' => 'required|numeric|min:0',
            'net_debit' => 'required|numeric|min:0',
            'net_credit' => 'required|numeric|min:0',

        ]);
    
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        $account = Account::create($request->validated());
        return new AccountResource($account);
    }

    public function show(Account $account)
    {
        $account->load('parent');
        return new AccountResource($account);
    }

    public function update(Request $request, Account $account)
    {

        $validator = Validator::make($request->all(), [
            'account_name' => 'required|string|max:255|unique:accounts,account_name',
            'phone' => 'nullable|string|max:255',
            'parent_id' => 'nullable|exists:accounts,id',
            'can_delete' => 'required|boolean',
            'current_balance' => 'required|numeric|min:0',
            'net_debit' => 'required|numeric|min:0',
            'net_credit' => 'required|numeric|min:0',

        ]);
    
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }
        
        $account->update($request->validated());
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
