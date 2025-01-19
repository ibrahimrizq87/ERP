<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SalesInvoiceResource extends JsonResource
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
            'address' => $this->address,
            'tax_no' => $this->tax_no,
            'tax_name' => $this->tax_name,
            'client_name' => $this->client_name,
            'phone' => $this->phone,
            'type' => $this->type,
            'date' => $this->date,
            'liters' => $this->liters,
            'amount' => $this->amount,
            'tax_amount' => $this->tax_amount,
            'tax_rate' => $this->tax_rate,
            'number' => $this->number,
            'account' => new AccountResource($this->account),
            'main_shift' => new MainShiftResource($this->mainShift),
            'product_id' => $this->product_id,
        ];    }
}
