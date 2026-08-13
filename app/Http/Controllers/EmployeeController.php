<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class EmployeeController extends Controller
{
    public function index()
    {
        $employees = Employee::paginate(10); // Batasi 10 data per halaman
        return inertia('Employees/Index', [
            'employees' => $employees
        ]);
    }

    public function create()
    {
        return Inertia::render('Employees/Create', [
            'users' => \App\Models\User::all() // Mengambil semua user untuk pilihan
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'nip' => 'required|unique:employees,nip',
            'full_name' => 'required|string|max:255',
            'phone_number' => 'nullable|string',
            'gender' => 'required|in:L,P',
            'birth_date' => 'required|date',
            'job_title' => 'required|string',
            'department' => 'required|string',
            'join_date' => 'required|date',
            'status' => 'required|in:probation,active,resign',
            'profile_photo' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('profile_photo')) {
            $validated['profile_photo'] = $request->file('profile_photo')->store('employees', 'public');
        }

        Employee::create($validated);

        return redirect()->route('employees.index')->with('success', 'Data karyawan berhasil ditambahkan!');
    }
    public function show(Employee $employee)
    {
        return Inertia::render('Employees/Show', [
            'employee' => $employee
        ]);
    }
    public function edit(Employee $employee)
    {
        return Inertia::render('Employees/Edit', ['employee' => $employee]);
    }

    public function update(Request $request, Employee $employee)
    {
        // 1. Validasi (tambahkan 'nullable' pada profile_photo)
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'nip' => 'required|unique:employees,nip,' . $employee->id,
            'full_name' => 'required|string|max:255',
            'phone_number' => 'nullable|string',
            'gender' => 'required|in:L,P',
            'birth_date' => 'required|date',
            'job_title' => 'required|string',
            'department' => 'required|string',
            'join_date' => 'required|date',
            'status' => 'required|in:probation,active,resign',
            'profile_photo' => 'nullable|image|max:2048', // Tetap nullable
        ]);

        // 2. Logika update foto (JANGAN masukkan ke $validated dulu)
        if ($request->hasFile('profile_photo')) {
            // Hapus foto lama jika ada
            if ($employee->profile_photo) {
                Storage::disk('public')->delete($employee->profile_photo);
            }
            // Simpan foto baru dan tambahkan ke array update
            $validated['profile_photo'] = $request->file('profile_photo')->store('employees', 'public');
        } else {
            // Jika tidak ada file baru, HAPUS key profile_photo dari array $validated
            // Agar Laravel tidak mencoba meng-update kolom foto menjadi null
            unset($validated['profile_photo']);
        }

        // 3. Update data
        $employee->update($validated);

        return redirect()->route('employees.index')->with('success', 'Data karyawan berhasil diperbarui!');
    }

    public function destroy(Employee $employee)
    {
        $employee->delete();
        return redirect()->route('employees.index')->with('success', 'Data berhasil dihapus');
    }
}
