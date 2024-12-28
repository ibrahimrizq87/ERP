<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PurchaseInvoiceResource extends JsonResource
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
            'product' => new ProductResource($this->whenLoaded('product')),
            'price' => $this->price,
            'amount_letters' => $this->amount_letters,
            'total_cash' => $this->total_cash,
            'account' => new AccountResource($this->whenLoaded('account')),
            'supplier' => new AccountResource($this->whenLoaded('supplier')),
            'payment_type' => $this->payment_type,
            'note' => $this->note,
            'online_payment_image' => $this->online_payment_image,
            'tax_amount' => $this->tax_amount,
            'tax_rate' => $this->tax_rate,
            'created_at' => $this->created_at->toDateTimeString(),
            'updated_at' => $this->updated_at->toDateTimeString(),
        ];    }
}
