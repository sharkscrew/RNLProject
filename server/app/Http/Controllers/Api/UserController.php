<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function loadUsers () {
        $users = User:: with (['gender'])
        ->where('tbl_users.is_deleted', false)
        ->get();

        $users->transform(function ($user) {
            $user->age = Carbon::parse($user->birth_date)->age;
            return $user;
        });

        return response()->json([
            'users' => $users
        ], 200);
    }

    public function storeUser(Request $request) {
        $validated = $request->validate([
            'first_name' => ['required', 'max:55'],
            'middle_name' => ['nullable', 'max:55'],
            'last_name' => ['required', 'max:55'],
            'suffix_name' => ['nullable', 'max:55'],
            'gender' => ['required'],
            'birth_date' => ['required', 'date', 'before_or_equal:today'],
            'username' => ['required', 'min:6', 'max:12', Rule::unique('tbl_users', 'username')],
            'password' => ['required', 'min:6', 'max:12', 'confirmed'],
            'password_confirmation' => ['required', 'min:6', 'max:12']
        ]);

        $age = Carbon::parse($validated['birth_date'])->age;

        User::create([
            'first_name' => $validated['first_name'],
            'middle_name' => $validated['middle_name'],
            'last_name' => $validated['last_name'],
            'suffix_name' => $validated['suffix_name'],
            'gender_id' => $validated['gender'],
            'birth_date' => $validated['birth_date'],
            'age' => $age,
            'username' => $validated['username'],
            'password' => $validated['password']
        ]);

        return response()->json([
            'message' => 'User Successfully Saved.'
        ], 200);
    }

    public function updateUser(Request $request, User $user) {
        $validated = $request->validate([
            'first_name' => ['required', 'max:55'],
            'middle_name' => ['nullable', 'max:55'],
            'last_name' => ['required', 'max:55'],
            'suffix_name' => ['nullable', 'max:55'],
            'gender' => ['required'],
            'birth_date' => ['required', 'date', 'before_or_equal:today'],
            'username' => ['required', 'min:6', 'max:12', Rule::unique('tbl_users', 'username') ->ignore($user)]
        ]);

        $age = Carbon::parse($validated['birth_date'])->age;

        $user->update([
            'first_name' => $validated['first_name'],
            'middle_name' => $validated['middle_name'],
            'last_name' => $validated['last_name'],
            'suffix_name' => $validated['suffix_name'],
            'gender_id' => $validated['gender'],
            'birth_date' => $validated['birth_date'],
            'age' => $age,
            'username' => $validated['username']
        ]);

        return response()->json([
            'message' => 'User Successfully Updated.',
            'user' => $user
        ], 200);
    }
    public function destroyUser(User $user): \Illuminate\Http\JsonResponse
    {
        if ($user->is_deleted) {
            return response()->json([
                'message' => 'User already deleted.',
            ], 200);
        }

        $user->update([
            'is_deleted' => true,
        ]);

        return response()->json([
            'message' => 'User Successfully Deleted.',
        ], 200);
    }
}
