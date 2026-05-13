<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function loadUsers (Request $request) {
        $search = $request->input('search');
        $users = User:: with (['gender'])
        ->leftJoin('tbl_genders', 'tbl_users.gender_id', '=', 'tbl_genders.gender_id')
        ->where('tbl_users.is_deleted', false)
        ->orderBy('tbl_users.last_name', 'asc')
        ->orderBy('tbl_users.first_name', 'asc')
        ->orderBy('tbl_users.middle_name', 'asc')
        ->orderBy('tbl_users.suffix_name', 'asc');
        
        if($search) {
            $users->where(function ($user) use ($search){
                $user->where('tbl_users.first_name', 'like', "%{$search}%")
                ->orWhere('tbl_users.middle_name', 'like', "%{$search}%")
                ->orWhere('tbl_users.last_name', 'like', "%{$search}%")
                ->orWhere('tbl_users.suffix_name', 'like', "%{$search}%")
                ->orWhere('tbl_genders.gender', 'like', "%{$search}%");
            });
            
        }

        $users = $users->paginate(15);

        $users->getCollection()->transform(function($user) {
            $user->profile_picture = $user->profile_picture ? url ('storage/public/img/user/profile_picture/' . $user->profile_picture) : null;

            return $user;
        });

        return response()->json([
            'users' => $users
        ], 200);
    }

    public function storeUser(Request $request) {
        $validated = $request->validate([
            'add_user_profile_picture' => ['nullable', 'image','mimes:png,jpg,jpeg' ]  ,
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


        if($request->hasFile('add_user_profile_picture')) {
            $filenameWithExtension = $request->file('add_user_profile_picture');
            $filename = pathinfo($filenameWithExtension, PATHINFO_FILENAME);
            $extension = $filenameWithExtension->getClientOriginalExtension();
            $filenameToStore = sha1($filename . '_' . time() . '.' . $extension);
            $filenameWithExtension->storeAs('public/img/user/profile_picture', $filenameToStore);
            $validated['add_user_profile_picture'] = $filenameToStore;
        }

        $age = Carbon::parse($validated['birth_date'])->age;

        User::create([
            'profile_picture' => $validated['add_user_profile_picture'],
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
            'edit_user_profile_picture' => ['nullable', 'image','mimes:png,jpg,jpeg' ]  ,
            'first_name' => ['required', 'max:55'],
            'middle_name' => ['nullable', 'max:55'],
            'last_name' => ['required', 'max:55'],
            'suffix_name' => ['nullable', 'max:55'],
            'gender' => ['required'],
            'birth_date' => ['required', 'date', 'before_or_equal:today'],
            'username' => ['required', 'min:6', 'max:12', Rule::unique('tbl_users', 'username') ->ignore($user)]
        ]);

        $profilePictureFilename = $user->profile_picture;

        if ($request->has('remove_profile_picture') && $request->input('remove_profile_picture') === '1') {
            if ($profilePictureFilename) {
                $storedPath = 'public/img/user/profile_picture/' . $profilePictureFilename;
                if (Storage::exists($storedPath)) {
                    Storage::delete($storedPath);
                }
            }
            $profilePictureFilename = null;
        } elseif ($request->hasFile('edit_user_profile_picture')) {
            if ($user->profile_picture) {
                $storedPath = 'public/img/user/profile_picture/' . $user->profile_picture;
                if (Storage::exists($storedPath)) {
                    Storage::delete($storedPath);
                }
            }

            $filenameWithExtension = $request->file('edit_user_profile_picture');
            $filename = pathinfo($filenameWithExtension, PATHINFO_FILENAME);
            $extension = $filenameWithExtension->getClientOriginalExtension();
            $filenameToStore = sha1($filename . '_' . time() . '.' . $extension);
            $filenameWithExtension->storeAs('public/img/user/profile_picture', $filenameToStore);
            $profilePictureFilename = $filenameToStore;
        }

        $age = Carbon::parse($validated['birth_date'])->age;

        $user->update([
            'profile_picture' => $profilePictureFilename,
            'first_name' => $validated['first_name'],
            'middle_name' => $validated['middle_name'],
            'last_name' => $validated['last_name'],
            'suffix_name' => $validated['suffix_name'],
            'gender_id' => $validated['gender'],
            'birth_date' => $validated['birth_date'],
            'age' => $age,
            'username' => $validated['username']
        ]);

        
        $user->profile_picture = $user->profile_picture ? url('storage/public/img/user/profile_picture/' .
        $user->profile_picture) : null;

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
