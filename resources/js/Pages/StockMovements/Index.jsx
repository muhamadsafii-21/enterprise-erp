import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';

export default function Index({ auth, stockMovements, products, filters }) {
    
    const handleFilterChange = (key, value) => {
        router.get(
            route('stock-movements.index'),
            { ...filters, [key]: value },
            { preserveState: true, replace: true }
        );
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Stock Movements (Mutasi Stok)</h2>}
        >
            <Head title="Mutasi Stok" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        
                        {/* Area Filter */}
                        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6 bg-gray-50 p-4 rounded-lg border">
                            <h3 className="font-bold text-gray-700 text-base">Riwayat Keluar / Masuk Barang</h3>

                            <div className="flex flex-wrap gap-3 w-full md:w-auto">
                                {/* Filter Tipe Mutasi */}
                                <select
                                    className="rounded-md border-gray-300 text-xs focus:border-indigo-500 focus:ring-indigo-500"
                                    value={filters?.type || ''}
                                    onChange={(e) => handleFilterChange('type', e.target.value)}
                                >
                                    <option value="">-- Semua Tipe --</option>
                                    <option value="IN">IN (Barang Masuk)</option>
                                    <option value="OUT">OUT (Barang Keluar)</option>
                                </select>

                                {/* Filter Produk */}
                                <select
                                    className="rounded-md border-gray-300 text-xs focus:border-indigo-500 focus:ring-indigo-500"
                                    value={filters?.product_id || ''}
                                    onChange={(e) => handleFilterChange('product_id', e.target.value)}
                                >
                                    <option value="">-- Semua Produk --</option>
                                    {products.map((p) => (
                                        <option key={p.id} value={p.id}>
                                            {p.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Tabel Riwayat Mutasi */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-500">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-100 border-b">
                                    <tr>
                                        <th className="px-6 py-3">Waktu / Tanggal</th>
                                        <th className="px-6 py-3">Nama Produk</th>
                                        <th className="px-6 py-3 text-center">Tipe</th>
                                        <th className="px-6 py-3 text-center">Jumlah (Qty)</th>
                                        <th className="px-6 py-3">No. Referensi / Dokumen</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stockMovements.data.length > 0 ? (
                                        stockMovements.data.map((movement) => (
                                            <tr key={movement.id} className="bg-white border-b hover:bg-gray-50">
                                                <td className="px-6 py-4 text-xs font-mono text-gray-500">
                                                    {new Date(movement.created_at).toLocaleString('id-ID')}
                                                </td>
                                                <td className="px-6 py-4 font-semibold text-gray-900">
                                                    {movement.product?.name || 'Produk Dihapus'}
                                                </td>
                                               <td className="px-6 py-4 text-center">
    {movement.type?.toUpperCase() === 'IN' ? (
        <span className="px-2.5 py-1 text-xs font-black text-emerald-800 bg-emerald-100 rounded-full">
            ▲ IN
        </span>
    ) : (
        <span className="px-2.5 py-1 text-xs font-black text-rose-800 bg-rose-100 rounded-full">
            ▼ OUT
        </span>
    )}
</td>
                                                <td className="px-6 py-4 text-center font-bold text-gray-800">
                                                    {movement.quantity}
                                                </td>
                                                <td className="px-6 py-4 font-mono text-indigo-600 font-semibold">
                                                    {movement.reference_number || '-'}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-4 text-center text-gray-400">
                                                Belum ada data mutasi stok.
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