import React from 'react';
import { Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Index({ employees }) {
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

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Daftar Karyawan</h2>}
        >
            <div className="w-full">
                <div className="bg-white overflow-hidden shadow-sm rounded-lg p-6 w-full">
                    
                    {/* Tombol Tambah */}
                    <div className="mb-6 flex justify-between items-center">
                        <Link 
                            href={route('employees.create')} 
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium text-sm transition-colors"
                        >
                            + Tambah Karyawan
                        </Link>
                    </div>

                    {/* Tabel Karyawan */}
                    <div className="overflow-x-auto w-full">
                        <table className="w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Foto</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Nama / NIP</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">No. Telepon</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Departemen</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {employees.data && employees.data.length > 0 ? (
                                    employees.data.map((emp) => (
                                        <tr key={emp.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <img 
                                                    src={emp.profile_photo ? `/storage/${emp.profile_photo}` : '/default-avatar.png'} 
                                                    alt="Profile" 
                                                    className="w-12 h-12 rounded-full object-cover border shadow-sm"
                                                />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{emp.full_name}</div>
                                                <div className="text-xs text-gray-500">NIP: {emp.nip}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">{emp.phone_number || '-'}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{emp.department}</div>
                                                <div className="text-xs text-gray-500">{emp.job_title}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusBadge(emp.status)}`}>
                                                    {emp.status ? emp.status.toUpperCase() : 'ACTIVE'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                                                <Link href={route('employees.show', emp.id)}className="text-indigo-600 hover:text-indigo-900 mr-3">Detail</Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-4 text-center text-gray-500 text-sm">
                                            Belum ada data karyawan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Navigasi Pagination Laravel */}
                    {employees.links && employees.links.length > 3 && (
                        <div className="mt-6 flex flex-wrap justify-between items-center border-t pt-4">
                            <div className="text-xs text-gray-500 mb-2 sm:mb-0">
                                Menampilkan <span className="font-medium">{employees.from || 0}</span> sampai <span className="font-medium">{employees.to || 0}</span> dari <span className="font-medium">{employees.total}</span> data
                            </div>
                            <div className="flex flex-wrap gap-1">
                                {employees.links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url || '#'}
                                        className={`px-3 py-1.5 text-xs rounded border transition-colors ${
                                            link.active 
                                                ? 'bg-blue-600 text-white border-blue-600' 
                                                : link.url 
                                                    ? 'bg-white text-gray-700 hover:bg-gray-100 border-gray-300' 
                                                    : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </AuthenticatedLayout>
    );
}