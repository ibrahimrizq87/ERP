<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

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
    'user_id' => $this->user_id,
    'receiver_name' => $this->receiver_name,
    'company_account_id' => $this->company_account_id,
    'customer_account_id' => $this->customer_account_id,
    'image' => $this->image,
    'created_at' => $this->created_at,
    'updated_at' => $this->updated_at,
];
    }
}