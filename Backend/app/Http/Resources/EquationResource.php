<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EquationResource extends JsonResource
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
            'collection_id' => new AccountResource ($this->collection),
            'base_id' => new AccountResource ($this->base),
            'first_price' => $this->first_price,
            'current_price' => $this->current_price,
            'number_of_periods' => $this->number_of_periods,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
        
    }
}
