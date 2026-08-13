import React from 'react';
import { Link } from '@inertiajs/react';
import { useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Show({ employee }) {
    const getStatusBadge = (status) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800';
            case 'probation':
                return 'bg-yellow-100 text-yellow-800';
            case 'resign':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };
    const destroy = () => {
    if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
        router.delete(route('employees.destroy', employee.id));
    }
};
    

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Detail Karyawan</h2>}
        >
            <div className="w-full">
                <div className="bg-white overflow-hidden shadow-sm rounded-lg p-6 w-full">
                    
                    {/* Tombol Kembali & Aksi */}
                    <div className="mb-6 flex justify-between items-center border-b pb-4">
                        <Link 
                            href={route('employees.index')} 
                            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md font-medium text-sm transition-colors"
                        >
                            &larr; Kembali
                        </Link>
                        <div className="flex space-x-2">
    <Link 
        href={route('employees.edit', employee.id)} 
        className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md font-medium text-sm"
    >
        Edit Data
    </Link>
    <button 
        onClick={destroy}
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-medium text-sm"
    >
        Hapus
    </button>
</div>
                    </div>

                    {/* Konten Detail */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        
                        {/* Kolom Kiri: Foto & Status Singkat */}
                        <div className="bg-gray-50 p-6 rounded-lg border flex flex-col items-center text-center">
                            <img 
                                src={employee.profile_photo ? `/storage/${employee.profile_photo}` : '/default-avatar.png'} 
                                alt="Profile" 
                                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md mb-4"
                            />
                            <h3 className="text-lg font-bold text-gray-900">{employee.full_name}</h3>
                            <p className="text-sm text-gray-500 mb-3">NIP: {employee.nip}</p>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(employee.status)}`}>
                                {employee.status ? employee.status.toUpperCase() : 'ACTIVE'}
                            </span>
                        </div>

                        {/* Kolom Kanan: Informasi Lengkap */}
                        <div className="md:col-span-2 bg-white p-6 rounded-lg border">
                            <h4 className="text-md font-bold text-gray-800 mb-4 border-b pb-2">Informasi Personal & Kontak</h4>
                            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4 text-sm">
                                <div>
                                    <dt className="text-gray-500 font-medium">Jenis Kelamin</dt>
                                    <dd className="text-gray-900 mt-1">{employee.gender === 'L' ? 'Laki-laki' : 'Perempuan'}</dd>
                                </div>
                                <div>
                                    <dt className="text-gray-500 font-medium">Nomor Telepon</dt>
                                    <dd className="text-gray-900 mt-1">{employee.phone_number || '-'}</dd>
                                </div>
                                <div className="sm:col-span-2">
                                    <dt className="text-gray-500 font-medium">Alamat</dt>
                                    <dd className="text-gray-900 mt-1">{employee.address || '-'}</dd>
                                </div>
                            </dl>

                            <h4 className="text-md font-bold text-gray-800 mt-6 mb-4 border-b pb-2">Informasi Pekerjaan</h4>
                            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4 text-sm">
                                <div>
                                    <dt className="text-gray-500 font-medium">Departemen</dt>
                                    <dd className="text-gray-900 mt-1 font-semibold">{employee.department}</dd>
                                </div>
                                <div>
                                    <dt className="text-gray-500 font-medium">Jabatan (Job Title)</dt>
                                    <dd className="text-gray-900 mt-1 font-semibold">{employee.job_title}</dd>
                                </div>
                            </dl>
                        </div>

                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}