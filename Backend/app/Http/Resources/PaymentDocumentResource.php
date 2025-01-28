<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\AccountResource;//
class PaymentDocumentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
return[

    
    'id' => $this->id,
    'amount' => $this->amount,
    'type' => $this->type,
    'statement' => $this->statement,

    'user_id' => $this->user_id,
    'receiver_name' => $this->receiver_name,
    'company_account_id' => $this->company_account_id,
    'customer_account_id' => $this->customer_account_id,
    'image' => $this->image,
    'created_at' => $this->created_at ? $this->created_at->format('Y-m-d') : null,
    'updated_at' => $this->updated_at? $this->updated_at->format('Y-m-d') : null,
    'company_account' => new AccountResource($this->whenLoaded('companyAccount')),//
    'customer_account' => new AccountResource($this->whenLoaded('customerAccount')),//
];
    }
}
