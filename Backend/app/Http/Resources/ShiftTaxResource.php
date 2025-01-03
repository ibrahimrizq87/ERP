<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ShiftTaxResource extends JsonResource
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
            'shift' => new ShiftResource($this->shift),
            'tax_amount' => $this->tax_amount,
            'tax_rate' => $this->tax_rate,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
        }
}