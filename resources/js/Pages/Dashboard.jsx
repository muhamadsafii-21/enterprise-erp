import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ auth, stats, lowStockProducts, recentSalesOrders }) {
    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(number || 0);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                        <h2 className="font-extrabold text-xl text-slate-900 tracking-tight flex items-center gap-2">
                            Dashboard Utama ERP 
                            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700">v2.0</span>
                        </h2>
                        <p className="text-xs text-slate-500">Ringkasan analitik operasional dan finansial bisnis secara real-time.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-sm">
                            <span className="w-2 h-2 mr-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                            Live System Active
                        </span>
                    </div>
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="py-8 bg-slate-100/70 min-h-[calc(100vh-4rem)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                    
                    {/* GRID STATISTIK UTAMA (Dibuat Lebih "Nyala" dengan Aksen Warna) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        
                        {/* Card 1: Total Omzet */}
                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 relative overflow-hidden group hover:shadow-md transition-all">
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-blue-500"></div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Omzet Penjualan</span>
                                <div className="p-2.5 bg-indigo-500 text-white rounded-xl shadow-md shadow-indigo-500/30">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                </div>
                            </div>
                            <div className="mt-4">
                                <div className="text-2xl font-black text-slate-800 tracking-tight">
                                    {formatRupiah(stats.totalRevenue)}
                                </div>
                                <p className="text-[11px] text-slate-400 mt-1">Akumulasi dari invoice lunas</p>
                            </div>
                        </div>

                        {/* Card 2: Total Sales Order */}
                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 relative overflow-hidden group hover:shadow-md transition-all">
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-400"></div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Penjualan (SO)</span>
                                <div className="p-2.5 bg-blue-500 text-white rounded-xl shadow-md shadow-blue-500/30">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                                </div>
                            </div>
                            <div className="mt-4">
                                <div className="text-2xl font-black text-slate-800 tracking-tight flex items-baseline gap-1.5">
                                    {stats.totalSalesOrders} <span className="text-xs font-medium text-slate-500">Transaksi</span>
                                </div>
                                <p className="text-[11px] text-slate-400 mt-1">Sales Order tercatat sistem</p>
                            </div>
                        </div>

                        {/* Card 3: Total Jenis Produk */}
                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 relative overflow-hidden group hover:shadow-md transition-all">
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-400"></div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Jumlah Produk</span>
                                <div className="p-2.5 bg-emerald-500 text-white rounded-xl shadow-md shadow-emerald-500/30">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                                </div>
                            </div>
                            <div className="mt-4">
                                <div className="text-2xl font-black text-slate-800 tracking-tight flex items-baseline gap-1.5">
                                    {stats.totalProducts} <span className="text-xs font-medium text-slate-500">Item</span>
                                </div>
                                <p className="text-[11px] text-slate-400 mt-1">Katalog barang aktif</p>
                            </div>
                        </div>

                        {/* Card 4: Alert Stok Menipis */}
                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-rose-200/80 relative overflow-hidden group hover:shadow-md transition-all">
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 to-orange-400"></div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold uppercase tracking-wider text-rose-600">Stok Menipis (≤ 10)</span>
                                <div className="p-2.5 bg-rose-500 text-white rounded-xl shadow-md shadow-rose-500/30">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                </div>
                            </div>
                            <div className="mt-4">
                                <div className="text-2xl font-black text-rose-600 tracking-tight flex items-baseline gap-1.5">
                                    {stats.lowStockCount} <span className="text-xs font-medium text-rose-400">Barang</span>
                                </div>
                                <p className="text-[11px] text-rose-500/80 mt-1">Membutuhkan tindakan restock</p>
                            </div>
                        </div>

                    </div>

                    {/* KONTEN UTAMA */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        
                        {/* Tabel Stok Menipis */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 lg:col-span-1 flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
                                    <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
                                        Peringatan Stok Menipis
                                    </h3>
                                    <Link href={route('products.index')} className="text-xs font-bold text-indigo-600 hover:text-indigo-800">
                                        Lihat Semua &rarr;
                                    </Link>
                                </div>

                                <div className="space-y-3">
                                    {lowStockProducts.length > 0 ? (
                                        lowStockProducts.map((product) => (
                                            <div key={product.id} className="flex justify-between items-center bg-slate-50 hover:bg-rose-50/40 p-3 rounded-xl border border-slate-200/60 transition-colors">
                                                <div className="pr-2">
                                                    <p className="font-bold text-xs text-slate-800 line-clamp-1">{product.name}</p>
                                                    <p className="text-[11px] text-slate-500 mt-0.5">{formatRupiah(product.sell_price)}</p>
                                                </div>
                                                <span className="px-2.5 py-1 bg-rose-100 text-rose-700 font-extrabold text-[11px] rounded-lg shrink-0">
                                                    Sisa: {product.stock}
                                                </span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-xs text-slate-400 text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                                            ✅ Stok semua barang aman.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Tabel Transaksi Penjualan Terbaru */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 lg:col-span-2">
                            <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
                                <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse"></span>
                                    Transaksi Penjualan Terbaru
                                </h3>
                                <Link href={route('sales-orders.index')} className="text-xs font-bold text-indigo-600 hover:text-indigo-800">
                                    Lihat Semua &rarr;
                                </Link>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left text-slate-600">
                                    <thead className="text-[11px] text-slate-400 uppercase bg-slate-50 border-y border-slate-200">
                                        <tr>
                                            <th className="px-4 py-3 font-semibold">No. Order</th>
                                            <th className="px-4 py-3 font-semibold">Pelanggan</th>
                                            <th className="px-4 py-3 text-right font-semibold">Total Amount</th>
                                            <th className="px-4 py-3 text-center font-semibold">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {recentSalesOrders.length > 0 ? (
                                            recentSalesOrders.map((order) => (
                                                <tr key={order.id} className="hover:bg-indigo-50/30 transition-colors">
                                                    <td className="px-4 py-3.5 font-bold text-indigo-600 font-mono text-xs">
                                                        {order.order_number}
                                                    </td>
                                                    <td className="px-4 py-3.5 text-slate-800 font-semibold text-xs">
                                                        {order.customer ? order.customer.name : '-'}
                                                    </td>
                                                    <td className="px-4 py-3.5 text-right font-black text-slate-900 text-xs">
                                                        {formatRupiah(order.total_amount)}
                                                    </td>
                                                    <td className="px-4 py-3.5 text-center">
                                                        <span className={`px-2.5 py-1 text-[10px] font-extrabold rounded-full uppercase tracking-wider ${
                                                            order.status === 'COMPLETED' 
                                                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                                                                : 'bg-amber-100 text-amber-800 border border-amber-200'
                                                        }`}>
                                                            {order.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className="px-4 py-8 text-center text-slate-400 text-xs italic bg-slate-50/50 rounded-xl">
                                                    Belum ada transaksi tercatat.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}