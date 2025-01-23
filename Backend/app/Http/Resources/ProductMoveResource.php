<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductMoveResource extends JsonResource
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
            'type' => $this->type,
            'liters' => $this->liters,
            'total_price' => $this->total_price,
            'date' => $this->date,
            'product' => new ProductResource($this->product),
            'main_shift' => new MainShiftResource($this->mainShift),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
