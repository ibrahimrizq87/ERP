<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PaymentDocumentRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            
            'statement' => 'nullable|string|max:255',

            'amount' => 'required|numeric|min:0',
            'type' => 'required|in:payment,receipt',
            'receiver_name' => 'required|string|max:255',
            'company_account_id' => 'required|exists:accounts,id',
            'customer_account_id' => 'required|exists:accounts,id',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ];
    }

    public function messages()
    {
        return [
            'amount.required' => 'Amount is required.',
            'type.in' => 'Type must be either payment or receipt.',
            'image.image' => 'Image must be a valid image file.',
            'image.max' => 'Image must not exceed 2MB.',
        ];
    }
}
