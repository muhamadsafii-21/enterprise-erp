import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Index({ auth, customers }) {
    const { flash } = usePage().props;

    return (
        <AuthenticatedLayout
            user={auth}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Daftar Pelanggan (Customer)</h2>}
        >
            <Head title="Daftar Pelanggan" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    {/* Notifikasi Flash Message */}
                    {flash?.message && (
                        <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative shadow-sm">
                            <span className="block sm:inline">{flash.message}</span>
                        </div>
                    )}

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-gray-700">Kelola Data Pelanggan</h3>
                            <Link
                                href={route('customers.create')}
                                className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-indigo-700 transition"
                            >
                                + Tambah Pelanggan
                            </Link>
                        </div>

                        {/* Tabel Pelanggan */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-600 border-collapse">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-100 border-b">
                                    <tr>
                                        <th className="px-4 py-3">#</th>
                                        <th className="px-4 py-3">Nama Pelanggan</th>
                                        <th className="px-4 py-3">Email</th>
                                        <th className="px-4 py-3">No. Telepon</th>
                                        <th className="px-4 py-3">Alamat</th>
                                        <th className="px-4 py-3 text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {customers.data && customers.data.length > 0 ? (
                                        customers.data.map((customer, index) => (
                                            <tr key={customer.id} className="border-b hover:bg-gray-50">
                                                <td className="px-4 py-3 text-gray-400 font-mono text-xs">{index + 1}</td>
                                                <td className="px-4 py-3 font-semibold text-gray-800">{customer.name}</td>
                                                <td className="px-4 py-3">{customer.email || '-'}</td>
                                                <td className="px-4 py-3">{customer.phone || '-'}</td>
                                                <td className="px-4 py-3">{customer.address || '-'}</td>
                                                <td className="px-4 py-3 text-center space-x-2">
                                                    <Link
                                                        href={route('customers.edit', customer.id)}
                                                        className="text-yellow-600 hover:underline font-bold text-xs"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <Link
                                                        href={route('customers.destroy', customer.id)}
                                                        method="delete"
                                                        as="button"
                                                        className="text-red-600 hover:underline font-bold text-xs"
                                                        onBefore={() => confirm('Yakin ingin menghapus pelanggan ini?')}
                                                    >
                                                        Hapus
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="px-4 py-4 text-center text-gray-400">
                                                Belum ada data pelanggan.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}