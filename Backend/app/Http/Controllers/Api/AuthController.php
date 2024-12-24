<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;


use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;


use App\Models\User;  

use App\Http\Resources\UserResource;


class AuthController extends Controller
{

    
    public function login(Request $request) {
        try {
        $validator = Validator::make($request->all(), [
            'username' => 'required',
            'password' => 'required|string',

        ], [
            "username.required" => "Email is required.",
            "password.required" => "Password is required.",
          
        ]);
    
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }
    
    

        $user = User::where('username', $request->username)->first();
    
        if (!$user) {
            return response()->json(['error' => 'username not found.'], 404);
        }
    
        if (!Auth::attempt($request->only('username', 'password'))) {
            return response()->json(['error' => 'Invalid password.'], 401);
        }


            return response()->json([
                'token' => $user->createToken('auth_token')->plainTextToken,
                'user' => new UserResource($user),
            ]);
        
    
    
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
    }

    public function logout()
    {
        try {
            auth()->user()->currentAccessToken()->delete();
            return response()->json(['message' => 'Successfully logged out from this device'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Error logging out from this device', 'error' => $e->getMessage()], 500);
        }
    }







    public function addUser(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users,username',
            'password' => 'required|string|min:8',
            'role' => 'required|in:accountant,worker,admin,supervisor',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);



        $my_path = '';
        if(request()->hasFile("image")){
            $image = request()->file("image");
            $my_path=$image->store('users','uploads');
            $my_path= asset('uploads/' . $my_path); 
        }


        $user = User::create([
            'name' => $request->name,
            'username' => $request->username,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'image' => $my_path,
           
        ]);

        return response()->json([
            'message' => 'User added successfully',
            'user' => new UserResource($user),
        ], 201);
    }





    public function updateUser(Request $request, $id)
{
    $user = User::find($id);

    if (!$user) {
        return response()->json(['message' => 'User not found'], 404);
    }

    $request->validate([
        'name' => 'sometimes|string|max:255',
        'username' => 'sometimes|string|max:255|unique:users,username,' . $id,
        'password' => 'sometimes|string|min:8',
        'role' => 'sometimes|in:accountant,worker,admin',
        'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
    ]);

    if ($request->hasFile('image')) {
        $image = $request->file('image');
        $path = $image->store('users', 'uploads');
        $user->image = asset('uploads/' . $path);
    }

    $user->update([
        'name' => $request->input('name', $user->name),
        'username' => $request->input('username', $user->username),
        'password' => $request->has('password') ? Hash::make($request->password) : $user->password,
        'role' => $request->input('role', $user->role),
    ]);

    return response()->json([
        'message' => 'User updated successfully',
        'user' => new UserResource($user),
    ]);
}




public function deleteUser($id)
{
    $user = User::find($id);

    if (!$user) {
        return response()->json(['message' => 'User not found'], 404);
    }

    $user->delete();

    return response()->json(['message' => 'User deleted successfully']);
}


public function getUser($id)
{
    $user = User::find($id);

    if (!$user) {
        return response()->json(['message' => 'User not found'], 404);
    }

    return response()->json([
        'message' => 'User retrieved successfully',
        'user' => new UserResource($user),
    ]);
}

public function getAllUsers()
{
    $user = User::all();

  

    return UserResource::collection($user);
}
public function getAllUsersByRole($role)
{
    $user = User::where('role' ,$role )->get();

  

    return UserResource::collection($user);
}

}



