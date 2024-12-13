<?php

namespace App\Http\Controllers;


use App\Http\Resources\ProductResource;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Product;  


class ProductController extends Controller
{
    public function index()
    {
        $products = Product::all();
        return response()->json(ProductResource::collection($products));
    }


    public function store(Request $request)
    {
        $rules = [
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'amount' => 'required|integer|min:0',
        ];

        $validated = $request->validate($rules);

        $product = Product::create($validated);

        return response()->json(new ProductResource($product), 201);
    }



    public function show(Product $product)
    {
        return response()->json(new ProductResource($product));
    }



    public function update(Request $request, Product $product)
    {
        $rules = [
            'name' => 'sometimes|string|max:255',
            'price' => 'sometimes|numeric|min:0',
            'amount' => 'sometimes|integer|min:0',
        ];

        $validated = $request->validate($rules);

        $product->update($validated);

        return response()->json(new ProductResource($product));
    }



    public function destroy(Product $product)
    {
        $product->delete();

        return response()->json([
            'message' => 'Product deleted successfully.',
        ]);
    }


}
