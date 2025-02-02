<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MainShiftResource extends JsonResource
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
            'status' => $this->status,
            'shift' => $this->shift,
            'total_shift_money' => $this->total_shift_money,
            'total_money_cash' => $this->total_money_cash,
            'total_money_client' => $this->total_money_client,
            'total_money_online' => $this->total_money_online,
            'total_tax'=> $this->total_tax,
            'date' => $this->date,
            'worker' => new UserResource($this->worker),  
            'supervisor' => new UserResource($this->supervisor),  
            'shiftMachines' => ShiftMachineResource::collection($this->shiftMachines), 
            'OnlineImages' => MainShiftOnlineImageResource::collection($this->OnlineImages), 
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
        }
}
