<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AccountResource extends JsonResource
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
            'account_name' => $this->account_name,
            'phone' => $this->phone,
            'parent_id' => $this->parent_id,
            'can_delete' => $this->can_delete,
            'current_balance' => $this->current_balance,
            'net_debit' => $this->net_debit,
            'net_credit' => $this->net_credit,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'parent' => new AccountResource($this->whenLoaded('parent')),
            // 'children' => AccountResource::collection($this->whenLoaded('children')),
        ];
    
    
    }
}
