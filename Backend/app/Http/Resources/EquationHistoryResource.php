<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EquationHistoryResource extends JsonResource
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
            'equation_id' => new EquationResource($this->equation),
            'last_price' => $this->last_price,
            'current_price' => $this->current_price,
            'amount' => $this->amount,
            'year' => $this->year,
            'period_number' => $this->period_number,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
        }
}
