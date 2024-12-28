<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ExpenseInvoiceResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'date' => $this->date,
            'total_cash' => $this->total_cash,
            'account' => new AccountResource($this->whenLoaded('account')),
            'expense' => new AccountResource($this->whenLoaded('expense')),
            'payment_type' => $this->payment_type,
            'note' => $this->note,
            'online_payment_image' => $this->online_payment_image,
            'tax_amount' => $this->tax_amount,
            'tax_rate' => $this->tax_rate,
            'invoice_image' => $this->invoice_image,
        ];    }
}
