import React from 'react';
import { useForm, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Edit({ employee }) {
    // Menggunakan useForm dengan menyertakan seluruh field karyawan
    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT', // Karena kita mengirim file foto, Laravel membutuhkan _method PUT lewat POST
        user_id: employee.user_id || '',
        nip: employee.nip || '',
        full_name: employee.full_name || '',
        phone_number: employee.phone_number || '',
        gender: employee.gender || 'L',
        birth_date: employee.birth_date || '',
        job_title: employee.job_title || '',
        department: employee.department || '',
        join_date: employee.join_date || '',
        status: employee.status || 'active',
        profile_photo: null,
    });

    const submit = (e) => {
        e.preventDefault();
        // Menggunakan post ke route update karena ada file upload (profile_photo)
        post(route('employees.update', employee.id));
    };

    return (
        <AuthenticatedLayout 
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Edit Data Karyawan</h2>}
        >
            <div className="w-full">
                <div className="bg-white overflow-hidden shadow-sm rounded-lg p-6 w-full">
                    
                    <form onSubmit={submit} encType="multipart/form-data">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            
                            {/* NIP */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">NIP</label>
                                <input 
                                    type="text" 
                                    className="w-full border-gray-300 rounded-md shadow-sm mt-1 p-2 border" 
                                    value={data.nip} 
                                    onChange={e => setData('nip', e.target.value)} 
                                />
                                {errors.nip && <div className="text-red-500 text-xs mt-1">{errors.nip}</div>}
                            </div>

                            {/* Nama Lengkap */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
                                <input 
                                    type="text" 
                                    className="w-full border-gray-300 rounded-md shadow-sm mt-1 p-2 border" 
                                    value={data.full_name} 
                                    onChange={e => setData('full_name', e.target.value)} 
                                />
                                {errors.full_name && <div className="text-red-500 text-xs mt-1">{errors.full_name}</div>}
                            </div>

                            {/* No. Telepon */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nomor Telepon</label>
                                <input 
                                    type="text" 
                                    className="w-full border-gray-300 rounded-md shadow-sm mt-1 p-2 border" 
                                    value={data.phone_number} 
                                    onChange={e => setData('phone_number', e.target.value)} 
                                />
                                {errors.phone_number && <div className="text-red-500 text-xs mt-1">{errors.phone_number}</div>}
                            </div>

                            {/* Gender */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Jenis Kelamin</label>
                                <select 
                                    className="w-full border-gray-300 rounded-md shadow-sm mt-1 p-2 border"
                                    value={data.gender}
                                    onChange={e => setData('gender', e.target.value)}
                                >
                                    <option value="L">Laki-laki</option>
                                    <option value="P">Perempuan</option>
                                </select>
                                {errors.gender && <div className="text-red-500 text-xs mt-1">{errors.gender}</div>}
                            </div>

                            {/* Tanggal Lahir */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Tanggal Lahir</label>
                                <input 
                                    type="date" 
                                    className="w-full border-gray-300 rounded-md shadow-sm mt-1 p-2 border" 
                                    value={data.birth_date} 
                                    onChange={e => setData('birth_date', e.target.value)} 
                                />
                                {errors.birth_date && <div className="text-red-500 text-xs mt-1">{errors.birth_date}</div>}
                            </div>

                            {/* Departemen */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Departemen</label>
                                <input 
                                    type="text" 
                                    className="w-full border-gray-300 rounded-md shadow-sm mt-1 p-2 border" 
                                    value={data.department} 
                                    onChange={e => setData('department', e.target.value)} 
                                />
                                {errors.department && <div className="text-red-500 text-xs mt-1">{errors.department}</div>}
                            </div>

                            {/* Jabatan */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Jabatan (Job Title)</label>
                                <input 
                                    type="text" 
                                    className="w-full border-gray-300 rounded-md shadow-sm mt-1 p-2 border" 
                                    value={data.job_title} 
                                    onChange={e => setData('job_title', e.target.value)} 
                                />
                                {errors.job_title && <div className="text-red-500 text-xs mt-1">{errors.job_title}</div>}
                            </div>

                            {/* Tanggal Masuk */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Tanggal Masuk (Join Date)</label>
                                <input 
                                    type="date" 
                                    className="w-full border-gray-300 rounded-md shadow-sm mt-1 p-2 border" 
                                    value={data.join_date} 
                                    onChange={e => setData('join_date', e.target.value)} 
                                />
                                {errors.join_date && <div className="text-red-500 text-xs mt-1">{errors.join_date}</div>}
                            </div>

                            {/* Status */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Status</label>
                                <select 
                                    className="w-full border-gray-300 rounded-md shadow-sm mt-1 p-2 border"
                                    value={data.status}
                                    onChange={e => setData('status', e.target.value)}
                                >
                                    <option value="active">Active</option>
                                    <option value="probation">Probation</option>
                                    <option value="resign">Resign</option>
                                </select>
                                {errors.status && <div className="text-red-500 text-xs mt-1">{errors.status}</div>}
                            </div>

                            {/* Foto Profil */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Foto Profil</label>
                                {employee.profile_photo && (
                                    <div className="mb-2 flex items-center gap-3">
                                        <img 
                                            src={`/storage/${employee.profile_photo}`} 
                                            alt="Current Profile" 
                                            className="w-12 h-12 rounded-full object-cover border shadow-sm"
                                        />
                                        <span className="text-xs text-gray-500">Foto saat ini (biarkan kosong jika tidak ingin mengubah)</span>
                                    </div>
                                )}
                                <input 
                                    type="file" 
                                    className="w-full border-gray-300 rounded-md shadow-sm mt-1 p-1 border bg-white text-sm" 
                                    onChange={e => setData('profile_photo', e.target.files[0])} 
                                />
                                {errors.profile_photo && <div className="text-red-500 text-xs mt-1">{errors.profile_photo}</div>}
                            </div>

                        </div>

                        {/* Tombol Aksi */}
                        <div className="flex items-center justify-end gap-4 mt-6 border-t pt-4">
                            <Link 
                                href={route('employees.show', employee.id)} 
                                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md font-medium text-sm transition-colors"
                            >
                                Batal
                            </Link>
                            <button 
                                type="submit" 
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium text-sm transition-colors" 
                                disabled={processing}
                            >
                                Simpan Perubahan
                            </button>
                        </div>
                    </form>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}