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
            'type' =>'required|string|in:1,2,3,4,5,6,7,8,9,10,11,13,14,15,16,17,18,19,20,21,22,23,24,25,26,none',

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
        'start_amount'=>$data['current_balance'] ?? 0,
        'current_balance' => $data['current_balance'] ?? 0,
        'net_debit' => $data['net_debit']?? 0,
        'net_credit' => $data['net_credit']??0,
        'type' => $data['type'],
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
        $accounts = Account::with('children')->where('parent_id' ,null)->get();
        return AccountResource::collection($accounts);
    }

    public function getAccountsByParent($parent_id)
    {
        $accounts = Account::where('parent_id' ,$parent_id)->get();
        return AccountResource::collection($accounts);
    }


    public function getCompanyAccount()
    {

        $accounts = Account::whereIn('parent_id', [10,11 ])->get();
        return AccountResource::collection($accounts);
    }
    


    public function getCustomerAccounts()
{
    $accounts = Account::whereIn('parent_id', [12])->get();
    return AccountResource::collection($accounts);
}


public function getExpencesAccounts()
{
    $accounts = Account::whereIn('parent_id', [32,33])->get();
    return AccountResource::collection($accounts);
}

public function getSuppliersAccounts()
{
    $accounts = Account::whereIn('parent_id', [22])->get();
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

    // $accountTypes = [
    //     ['id' => '1', 'message' => 'النقدية و ما فى حكمها'],
    //     ['id' => '2', 'message' => 'مخزون'],
    //     ['id' => '3', 'message' => 'الذمم المدينة التجارية'],
    //     ['id' => '4', 'message' => 'مصروفات مدفوعة مقدما'],
    //     ['id' => '5', 'message' => 'ارصدة مدينة التجارية'],
    //     ['id' => '6', 'message' => 'اصراف ذات علاقة مدينة'],
    //     ['id' => '7', 'message' => 'ممتلكات و ألات و معدات صافى'],
    //     ['id' => '8', 'message' => 'مشروعات تحت التنفيذ'],
    //     ['id' => '9', 'message' => 'ذمم دائنة تجارية'],
    //     ['id' => '10', 'message' => 'اطراف ذات علاقة دائنة'],
    //     ['id' => '11', 'message' => 'ارصدة دائنة اخرى'],
    //     ['id' => '13', 'message' => 'المصروفات المستحقة'],
    //     ['id' => '14', 'message' => 'قروض طويلة الاجل'],
    //     ['id' => '15', 'message' => 'رأس المال'],
    //     ['id' => '16', 'message' => 'جارى الشركاء'],
    //     ['id' => '17', 'message' => 'ارباح العام'],
    //     ['id' => '18', 'message' => 'صافى الايرادات التشغيلية'],
    //     ['id' => '19', 'message' => 'تكلفة الايرادات'],
    //     ['id' => '20', 'message' => 'التكاليف التشغيلية'],
    //     ['id' => '21', 'message' => 'مصاريف بيع و توزيع'],
    //     ['id' => '22', 'message' => 'مخصص اهلاك الاصول الثابته'],
    //     ['id' => '23', 'message' => 'مصاريف ادارية و عمومية'],
    //     ['id' => '24', 'message' => 'ايرادات اخرى'],
    //     ['id' => '25', 'message' => 'الزكاة التقديرية'],
    //     ['id' => '26', 'message' => 'صافى الايرادات التشخيلية'],
    //     ['id' => 'none', 'message' => 'نوع اخر'],
    // ];



        public function yearReports()
        {



    $accountTypes = [
        ['id' => '1', 'value' => 0 ],
        ['id' => '2', 'value' => 0],
        ['id' => '3', 'value' => 0],
        ['id' => '4', 'value' => 0],
        ['id' => '5', 'value' => 0],
        ['id' => '6', 'value' => 0],
        ['id' => '7', 'value' => 0],
        ['id' => '8', 'value' => 0],
        ['id' => '9', 'value' => 0],
        ['id' => '10', 'value' => 0],
        ['id' => '11', 'value' => 0],
        ['id' => '12', 'value' => 0],
        ['id' => '13', 'value' => 0],
        ['id' => '14', 'value' => 0],
        ['id' => '15', 'value' => 0],
        ['id' => '16', 'value' => 0],
        ['id' => '17', 'value' => 0],
        ['id' => '18', 'value' => 0],
        ['id' => '19', 'value' => 0],
        ['id' => '20', 'value' => 0],
        ['id' => '21', 'value' => 0],
        ['id' => '22', 'value' => 0],
        ['id' => '23', 'value' => 0],
        ['id' => '24', 'value' => 0],
        ['id' => '25', 'value' => 0],
        ['id' => '26', 'value' => 0],
        ['id' => 'none', 'value' =>0],
    ];

// foreach($accountTypes as $type){
//     $type['value'] = $this->caluculateByNumber($type['id']);
// }

foreach($accountTypes as &$type){
    $type['value'] = $this->caluculateByNumber($type['id']);
}
unset($type);
    
            return response()->json(['data' => $accountTypes],200);
        }
        

        public function caluculateByNumber($typeNumber)
        {
            
            $accounts = Account::where('type' , $typeNumber)->get();
            $total =0;



            foreach($accounts as $account){
                // if ($account->current_balance < 0){
                //     $total += ($account->current_balance * -1);

                // }else{
                //     $total += $account->current_balance;
                // }
            
            
              
                $total += $account->current_balance;

            }
           
            


            return $total;
        }



        public function getAccountsByType($type)
        {
            $accounts = Account::where('type' , $type)->get();

            return AccountResource::collection($accounts);
        }


        
    
}
