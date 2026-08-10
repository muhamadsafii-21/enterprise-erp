import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Show({ auth, purchaseOrder }) {
    const formatRupiah = (num) => 
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num || 0);

    const grandTotal = purchaseOrder.items
        ? purchaseOrder.items.reduce((acc, item) => acc + (parseFloat(item.subtotal) || (item.quantity * item.unit_cost)), 0)
        : 0;

    return (
        <AuthenticatedLayout 
            user={auth.user} 
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Detail Purchase Order</h2>}
        >
            <Head title={`PO ${purchaseOrder.po_number}`} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="mb-4">
                        <Link 
                            href={route('purchase-orders.index')} 
                            className="text-indigo-600 font-bold text-sm hover:underline inline-flex items-center gap-1"
                        >
                            &larr; Kembali ke Daftar PO
                        </Link>
                    </div>

                    <div className="bg-white p-8 rounded-lg shadow border">
                        {/* Header PO */}
                        <div className="flex justify-between items-start border-b pb-6 mb-6">
                            <div>
                                <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">Purchase Order</span>
                                <h1 className="text-3xl font-black text-emerald-600 font-mono">{purchaseOrder.po_number}</h1>
                                <div className="mt-2 text-sm text-gray-600">
                                    <span>Supplier: </span>
                                    <strong className="text-gray-900 font-bold">{purchaseOrder.supplier?.name || '-'}</strong>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-gray-500 mb-1">Tanggal Transaksi</p>
                                <p className="text-sm font-semibold text-gray-800 mb-2">{purchaseOrder.order_date}</p>
                                <div className="flex gap-2 justify-end">
                                    <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full uppercase ${
                                        purchaseOrder.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                                        purchaseOrder.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                                        'bg-gray-100 text-gray-800'
                                    }`}>
                                        {purchaseOrder.status}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Tabel Detail Items */}
                        <div className="overflow-x-auto mb-6">
                            <table className="w-full text-sm text-left text-gray-600 border-collapse">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                                    <tr>
                                        <th className="px-4 py-3">Nama Produk</th>
                                        <th className="px-4 py-3 text-center">Jumlah (Qty)</th>
                                        <th className="px-4 py-3 text-right">Harga Satuan</th>
                                        <th className="px-4 py-3 text-right">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {purchaseOrder.items && purchaseOrder.items.length > 0 ? (
                                        purchaseOrder.items.map((item) => (
                                            <tr key={item.id} className="border-b">
                                                <td className="px-4 py-3 font-semibold text-gray-800">
                                                    {item.product?.name || 'Produk Tidak Ditemukan'}
                                                </td>
                                                <td className="px-4 py-3 text-center font-bold">
                                                    {item.quantity}
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    {formatRupiah(item.unit_cost)}
                                                </td>
                                                <td className="px-4 py-3 text-right font-bold text-gray-900">
                                                    {formatRupiah(item.subtotal || (item.quantity * item.unit_cost))}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="text-center py-4 text-gray-400">
                                                Tidak ada item barang dalam PO ini.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Ringkasan Total Biaya PO */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-emerald-50 p-4 rounded border border-emerald-100">
                            <div>
                                <span className="text-xs text-gray-500 uppercase font-bold block mb-1">Informasi PO</span>
                                <p className="status text-sm text-gray-700">Total Item Barang: <strong className="text-gray-900">{purchaseOrder.items?.length || 0} Jenis</strong></p>
                            </div>
                            <div className="text-right flex flex-col justify-center">
                                <span className="text-xs text-gray-500 uppercase font-bold block mb-1">Total Biaya Pembelian</span>
                                <div className="text-2xl font-black text-emerald-950">
                                    {formatRupiah(grandTotal)}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}