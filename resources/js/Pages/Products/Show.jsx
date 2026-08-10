import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Show({ auth, product }) {
    const isLowStock = product.stock <= product.min_stock;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-slate-800 leading-tight">Detail Stok Produk</h2>}
        >
            <Head title={`Produk ${product.name}`} />

            <div className="py-8 bg-slate-50 min-h-screen">
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <Link
                            href={route('products.index')}
                            className="text-sm font-medium text-slate-500 hover:text-slate-700 flex items-center gap-1"
                        >
                            &larr; Kembali ke Daftar Inventory
                        </Link>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-1 rounded uppercase">
                                    {product.code}
                                </span>
                                <h1 className="text-2xl font-bold text-slate-900 mt-2">{product.name}</h1>
                                <p className="text-sm text-slate-500">Kategori: {product.category}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-semibold text-slate-400 uppercase">Sisa Stok Saat Ini</p>
                                <div className="flex items-center justify-end gap-2 mt-1">
                                    <span className="text-3xl font-extrabold text-slate-900">
                                        {product.stock} <span className="text-sm font-normal text-slate-500">{product.unit}</span>
                                    </span>
                                </div>
                                {isLowStock && (
                                    <span className="inline-block mt-2 bg-rose-100 text-rose-800 text-xs font-bold px-2.5 py-1 rounded-full">
                                        ⚠️ Stok Menipis (Batas Min: {product.min_stock})
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-100">
                            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                                <p className="text-xs text-slate-500">Harga Beli / Satuan</p>
                                <p className="text-lg font-bold text-slate-800">
                                    Rp {Number(product.buy_price).toLocaleString('id-ID')}
                                </p>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                                <p className="text-xs text-slate-500">Harga Jual / Satuan</p>
                                <p className="text-lg font-bold text-blue-600">
                                    Rp {Number(product.sell_price).toLocaleString('id-ID')}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <h3 className="text-base font-bold text-slate-800 mb-4">Riwayat Pergerakan Stok (Stock Movements)</h3>
                        
                        <table className="w-full text-left border-collapse text-sm">
                            <thead>
                                <tr className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200">
                                    <th className="py-2.5 px-3">Tanggal</th>
                                    <th className="py-2.5 px-3">Tipe</th>
                                    <th className="py-2.5 px-3">Jumlah</th>
                                    <th className="py-2.5 px-3">Referensi</th>
                                    <th className="py-2.5 px-3">Catatan</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {product.stock_movements && product.stock_movements.length > 0 ? (
                                    product.stock_movements.map((m) => (
                                        <tr key={m.id}>
                                            <td className="py-3 px-3 text-slate-600">{m.created_at}</td>
                                            <td className="py-3 px-3">
                                                <span className={`px-2 py-0.5 text-xs font-bold rounded uppercase ${
                                                    m.type === 'in' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                                                }`}>
                                                    {m.type === 'in' ? '+ Masuk' : '- Keluar'}
                                                </span>
                                            </td>
                                            <td className="py-3 px-3 font-semibold text-slate-800">{m.quantity}</td>
                                            <td className="py-3 px-3 text-slate-600">{m.reference_number || '-'}</td>
                                            <td className="py-3 px-3 text-slate-500">{m.notes || '-'}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="py-6 text-center text-slate-400">
                                            Belum ada riwayat pergerakan stok untuk barang ini.
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