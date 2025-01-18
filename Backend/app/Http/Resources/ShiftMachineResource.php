<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ShiftMachineResource extends JsonResource
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
            'open_amount' => $this->open_amount,
            'close_amount' => $this->close_amount,
            'close_image' => $this->close_image,
            'total_liters_amount' => $this->total_liters_amount,
            'total_money' => $this->total_money,
            'shift_id' => $this->shift_id,
            'product_id' => $this->product_id,
            'machine_id' => $this->machine_id,
            'shift' => new MainShiftResource($this->whenLoaded('shift')),  
            'product' => new ProductResource($this->whenLoaded('product')), 
            'machine' => new MachineResource($this->whenLoaded('machine')), 
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];    }
}
