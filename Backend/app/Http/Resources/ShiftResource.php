<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ShiftResource extends JsonResource
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
            // 'user_id' => $this->user_id,
            'opening_image' => $this->opening_image,
            'opening_amount' => $this->opening_amount,
            'ending_image' => $this->ending_image,
            'ending_amount' => $this->ending_amount,
            'shift' => $this->shift,
            'status' => $this->status,
            'amount' => $this->amount,
            'total_money' => $this->total_money,
            'total_cash' => $this->total_cash,
            'total_payed_online' => $this->total_payed_online,
            'total_client_deposit' => $this->total_client_deposit,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'user' => new UserResource($this->whenLoaded('user')),
            'machine' => new MachineResource($this->whenLoaded('machine')),
            'online_payments' => OnlinePaymentResource::collection($this->whenLoaded('onlinePayments')),
            'client_counters' => ClientCounterResource::collection($this->whenLoaded('clientCounters')),
        ];
    }
}
