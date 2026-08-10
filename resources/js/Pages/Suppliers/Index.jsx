import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Index({ auth, suppliers }) {
    const { delete: destroy } = useForm();

    const handleDelete = (id) => {
        if (confirm('Apakah kamu yakin ingin menghapus supplier ini?')) {
            destroy(route('suppliers.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-slate-800 leading-tight">Daftar Supplier</h2>}
        >
            <Head title="Supplier" />

            <div className="py-8 bg-slate-50 min-h-screen">
                <div className="max-w-6xl mx-auto sm:px-6 lg:px-8">
                    
                    {/* Header & Tombol Tambah */}
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-xl font-bold text-slate-800">Manajemen Supplier</h1>
                        <Link
                            href={route('suppliers.create')}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow transition duration-150 text-sm"
                        >
                            + Tambah Supplier
                        </Link>
                    </div>

                    {/* Tabel Supplier */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <table className="w-full text-left border-collapse text-sm">
                            <thead>
                                <tr className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200">
                                    <th className="py-3 px-4">Kode</th>
                                    <th className="py-3 px-4">Nama Supplier</th>
                                    <th className="py-3 px-4">No. Telepon</th>
                                    <th className="py-3 px-4">Alamat</th>
                                    <th className="py-3 px-4 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {suppliers.length > 0 ? (
                                    suppliers.map((supplier) => (
                                        <tr key={supplier.id} className="border-b border-slate-100 hover:bg-slate-50">
                                            <td className="py-3 px-4 font-mono font-medium text-slate-700">{supplier.code}</td>
                                            <td className="py-3 px-4 font-semibold text-slate-900">{supplier.name}</td>
                                            <td className="py-3 px-4 text-slate-600">{supplier.phone || '-'}</td>
                                            <td className="py-3 px-4 text-slate-600 truncate max-w-xs">{supplier.address || '-'}</td>
                                            <td className="py-3 px-4 text-center space-x-2">
                                                <Link
                                                    href={route('suppliers.edit', supplier.id)}
                                                    className="text-amber-600 hover:text-amber-800 font-medium text-xs bg-amber-50 px-2.5 py-1 rounded border border-amber-200"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(supplier.id)}
                                                    className="text-red-600 hover:text-red-800 font-medium text-xs bg-red-50 px-2.5 py-1 rounded border border-red-200"
                                                >
                                                    Hapus
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="py-6 text-center text-slate-400 italic">
                                            Belum ada data supplier. Silakan tambahkan baru.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}