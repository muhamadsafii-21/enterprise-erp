import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ auth, purchaseOrders }) {
    const formatRupiah = (num) => 
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num || 0);

    // Helper untuk menghitung total biaya dari relasi items
    const calculateTotal = (items) => {
        if (!items || items.length === 0) return 0;
        return items.reduce((acc, item) => acc + (parseFloat(item.subtotal) || (item.quantity * item.unit_cost)), 0);
    };

    return (
        <AuthenticatedLayout 
            user={auth.user} 
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Purchase Orders (Barang Masuk)</h2>}
        >
            <Head title="Purchase Orders" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="font-bold text-gray-800 text-lg">Daftar Purchase Order</h3>
                                <p className="text-xs text-gray-500">Riwayat barang masuk dari supplier</p>
                            </div>
                            <Link
                                href={route('purchase-orders.create')}
                                style={{ backgroundColor: '#4f46e5', color: '#ffffff' }}
                                className="px-4 py-2 font-bold text-sm rounded-md shadow hover:opacity-90 transition cursor-pointer"
                            >
                                + Tambah PO Baru
                            </Link>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-500">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-100 border-b">
                                    <tr>
                                        <th className="px-4 py-3">No. PO</th>
                                        <th className="px-4 py-3">Supplier</th>
                                        <th className="px-4 py-3">Tanggal</th>
                                        <th className="px-4 py-3 text-right">Total Biaya</th>
                                        <th className="px-4 py-3 text-center">Status</th>
                                        <th className="px-4 py-3 text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {purchaseOrders.data && purchaseOrders.data.length > 0 ? (
                                        purchaseOrders.data.map((po) => (
                                            <tr key={po.id} className="border-b hover:bg-gray-50 transition">
                                                <td className="px-4 py-3 font-mono font-bold text-emerald-600">
                                                    {po.po_number}
                                                </td>
                                                <td className="px-4 py-3 font-semibold text-gray-800">
                                                    {po.supplier?.name || '-'}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {po.order_date}
                                                </td>
                                                <td className="px-4 py-3 text-right font-bold text-gray-900">
                                                    {formatRupiah(calculateTotal(po.items))}
                                                </td>
                                               {/* Contoh bagian kolom status di dalam tabel Index PO */}
<td className="px-6 py-4 whitespace-nowrap">
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
        po.status === 'completed' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-yellow-100 text-yellow-800'
    }`}>
        {po.status}
    </span>
</td>

                                                <td className="px-4 py-3 text-center">
                                                    <Link 
                                                        href={route('purchase-orders.show', po.id)} 
                                                        className="text-indigo-600 hover:text-indigo-900 font-semibold text-xs"
                                                    >
                                                        Detail &rarr;
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="text-center py-6 text-gray-400">
                                                Belum ada transaksi Purchase Order.
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