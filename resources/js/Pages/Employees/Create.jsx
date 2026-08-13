import React from 'react';
import { useForm, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Create() {
    const { users } = usePage().props; 
    const { data, setData, post, processing, errors } = useForm({
        user_id: '',
        nip: '',
        full_name: '',
        phone_number: '',
        gender: 'L',          // Sesuai dengan ENUM('L', 'P')
        birth_date: '',       // Wajib di database (Null: No)
        job_title: '',        // Wajib di database (Null: No)
        department: '',
        join_date: '',        // Wajib di database (Null: No)
        status: 'active',     // Sesuai default di database
        profile_photo: null,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('employees.store'));
    };

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl">Tambah Karyawan Baru</h2>}>
            <div className="max-w-4xl mx-auto p-6 bg-white rounded shadow">
                <form onSubmit={submit}>
                    <div className="grid grid-cols-2 gap-4">
                        {/* User Selection */}
                        <div>
                            <label className="block text-sm font-medium">Pilih Akun User</label>
                            <select 
                                value={data.user_id}
                                onChange={e => setData('user_id', e.target.value)} 
                                className="w-full border-gray-300 rounded"
                            >
                                <option value="">Pilih User...</option>
                                {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                            </select>
                            {errors.user_id && <div className="text-red-500 text-sm mt-1">{errors.user_id}</div>}
                        </div>

                        {/* NIP */}
                        <div>
                            <label className="block text-sm font-medium">NIP</label>
                            <input 
                                type="text" 
                                value={data.nip}
                                onChange={e => setData('nip', e.target.value)} 
                                placeholder="Contoh: 18 digit angka"
                                className="w-full border-gray-300 rounded" 
                            />
                            {errors.nip && <div className="text-red-500 text-sm mt-1">{errors.nip}</div>}
                        </div>

                        {/* Nama Lengkap */}
                        <div className="col-span-2">
                            <label className="block text-sm font-medium">Nama Lengkap</label>
                            <input 
                                type="text" 
                                value={data.full_name}
                                onChange={e => setData('full_name', e.target.value)} 
                                className="w-full border-gray-300 rounded" 
                            />
                            {errors.full_name && <div className="text-red-500 text-sm mt-1">{errors.full_name}</div>}
                        </div>

                        {/* No Telepon */}
                        <div>
                            <label className="block text-sm font-medium">No Telepon</label>
                            <input 
                                type="text" 
                                value={data.phone_number}
                                onChange={e => setData('phone_number', e.target.value)} 
                                className="w-full border-gray-300 rounded" 
                            />
                            {errors.phone_number && <div className="text-red-500 text-sm mt-1">{errors.phone_number}</div>}
                        </div>

                        {/* Jenis Kelamin */}
                        <div>
                            <label className="block text-sm font-medium">Jenis Kelamin</label>
                            <select 
                                value={data.gender}
                                onChange={e => setData('gender', e.target.value)} 
                                className="w-full border-gray-300 rounded"
                            >
                                <option value="L">Laki-laki (L)</option>
                                <option value="P">Perempuan (P)</option>
                            </select>
                            {errors.gender && <div className="text-red-500 text-sm mt-1">{errors.gender}</div>}
                        </div>

                        {/* Tanggal Lahir */}
                        <div>
                            <label className="block text-sm font-medium">Tanggal Lahir</label>
                            <input 
                                type="date" 
                                value={data.birth_date}
                                onChange={e => setData('birth_date', e.target.value)} 
                                className="w-full border-gray-300 rounded" 
                            />
                            {errors.birth_date && <div className="text-red-500 text-sm mt-1">{errors.birth_date}</div>}
                        </div>

                        {/* Jabatan (Job Title) */}
                        <div>
                            <label className="block text-sm font-medium">Jabatan (Job Title)</label>
                            <input 
                                type="text" 
                                value={data.job_title}
                                onChange={e => setData('job_title', e.target.value)} 
                                className="w-full border-gray-300 rounded" 
                            />
                            {errors.job_title && <div className="text-red-500 text-sm mt-1">{errors.job_title}</div>}
                        </div>

                        {/* Departemen */}
                        <div>
                            <label className="block text-sm font-medium">Departemen</label>
                            <input 
                                type="text" 
                                value={data.department}
                                onChange={e => setData('department', e.target.value)} 
                                className="w-full border-gray-300 rounded" 
                            />
                            {errors.department && <div className="text-red-500 text-sm mt-1">{errors.department}</div>}
                        </div>

                        {/* Tanggal Bergabung */}
                        <div>
                            <label className="block text-sm font-medium">Tanggal Bergabung</label>
                            <input 
                                type="date" 
                                value={data.join_date}
                                onChange={e => setData('join_date', e.target.value)} 
                                className="w-full border-gray-300 rounded" 
                            />
                            {errors.join_date && <div className="text-red-500 text-sm mt-1">{errors.join_date}</div>}
                        </div>

                        {/* Status */}
                        <div>
                            <label className="block text-sm font-medium">Status Karyawan</label>
                            <select 
                                value={data.status}
                                onChange={e => setData('status', e.target.value)} 
                                className="w-full border-gray-300 rounded"
                            >
                                <option value="active">Active</option>
                                <option value="probation">Probation</option>
                                <option value="resign">Resign</option>
                            </select>
                            {errors.status && <div className="text-red-500 text-sm mt-1">{errors.status}</div>}
                        </div>

                        {/* Foto Profil */}
                        <div className="col-span-2">
                            <label className="block text-sm font-medium">Foto Profil</label>
                            <input 
                                type="file" 
                                onChange={e => setData('profile_photo', e.target.files[0])} 
                                className="w-full" 
                            />
                            {errors.profile_photo && <div className="text-red-500 text-sm mt-1">{errors.profile_photo}</div>}
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={processing}
                        className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                        {processing ? 'Menyimpan...' : 'Simpan Karyawan'}
                    </button>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}