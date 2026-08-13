import React, { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'; // Sesuaikan path layout-mu

export default function Index({ expenses }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        description: '',
        amount: '',
        expense_date: new Date().toISOString().split('T')[0], // Default tanggal hari ini
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('expenses.store'), {
            onSuccess: () => reset(),
        });
    };

    const handleDelete = (id) => {
        if (confirm('Yakin ingin menghapus data pengeluaran ini?')) {
            router.delete(route('expenses.destroy', id));
        }
    };

    // Format angka ke rupiah
    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(number);
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Manajemen Biaya Operasional (Expenses)</h2>}
        >
            <div className="py-12 max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                
                {/* Form Tambah Pengeluaran */}
                <div className="bg-white p-6 shadow sm:rounded-lg">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Tambah Pengeluaran Baru</h3>
                    
                    <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Keterangan / Keperluan</label>
                            <input
                                type="text"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                placeholder="Contoh: Gaji Karyawan / Listrik"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                            {errors.description && <div className="text-red-500 text-xs mt-1">{errors.description}</div>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nominal (Rp)</label>
                            <input
                                type="number"
                                value={data.amount}
                                onChange={(e) => setData('amount', e.target.value)}
                                placeholder="0"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                            {errors.amount && <div className="text-red-500 text-xs mt-1">{errors.amount}</div>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Tanggal Pengeluaran</label>
                            <input
                                type="date"
                                value={data.expense_date}
                                onChange={(e) => setData('expense_date', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                            {errors.expense_date && <div className="text-red-500 text-xs mt-1">{errors.expense_date}</div>}
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Simpan Pengeluaran
                            </button>
                        </div>
                    </form>
                </div>

                {/* Tabel Daftar Pengeluaran */}
                <div className="bg-white overflow-hidden shadow sm:rounded-lg">
                    <div className="p-6 text-gray-900">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Daftar Riwayat Pengeluaran</h3>
                        
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Keterangan</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Nominal</th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {expenses.length > 0 ? (
                                        expenses.map((expense) => (
                                            <tr key={expense.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{expense.expense_date}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{expense.description}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-red-600 font-semibold">{formatRupiah(expense.amount)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                                    <button
                                                        onClick={() => handleDelete(expense.id)}
                                                        className="text-red-600 hover:text-red-900 bg-red-50 px-3 py-1 rounded-md text-xs font-semibold"
                                                    >
                                                        Hapus
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                                                Belum ada data pengeluaran operasional.
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