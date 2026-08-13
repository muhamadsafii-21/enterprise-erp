import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement, // <-- Tambahan untuk Bar Chart
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2'; // <-- Import Bar

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement, // <-- Registrasi BarElement
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

export default function Dashboard({ auth, stats, lowStockProducts, recentSalesOrders, topProducts, recentStockMovements, chartData, chartStatusData }) {
    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(number || 0);
    };

    // Konfigurasi Line Chart
    const dataLineChart = {
        labels: chartData?.labels || [],
        datasets: [
            {
                label: 'Pendapatan',
                data: chartData?.revenue || [],
                borderColor: 'rgb(79, 70, 229)',
                backgroundColor: 'rgba(79, 70, 229, 0.1)',
                fill: true,
                tension: 0.4,
            },
            {
                label: 'Pengeluaran',
                data: chartData?.expense || [],
                borderColor: 'rgb(225, 29, 72)',
                backgroundColor: 'rgba(225, 29, 72, 0.05)',
                fill: true,
                tension: 0.4,
            },
        ],
    };

    const optionsLineChart = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'top', labels: { font: { size: 11 }, usePointStyle: true } },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        let label = context.dataset.label || '';
                        if (label) label += ': ';
                        if (context.parsed.y !== null) label += formatRupiah(context.parsed.y);
                        return label;
                    }
                }
            }
        },
        scales: {
            y: {
                ticks: {
                    callback: function(value) {
                        if (value >= 1000000) return (value / 1000000) + 'jt';
                        else if (value >= 1000) return (value / 1000) + 'rb';
                        return value;
                    },
                    font: { size: 10 }
                },
                grid: { color: 'rgba(0, 0, 0, 0.04)' }
            },
            x: { grid: { display: false }, ticks: { font: { size: 10 } } }
        },
    };

    // Konfigurasi Doughnut Chart
    const dataDoughnutChart = {
        labels: chartStatusData?.labels?.length > 0 ? chartStatusData.labels : ['Belum Ada Data'],
        datasets: [{
            data: chartStatusData?.data?.length > 0 ? chartStatusData.data : [1],
            backgroundColor: ['rgba(16, 185, 129, 0.8)', 'rgba(245, 158, 11, 0.8)', 'rgba(239, 68, 68, 0.8)'],
            borderWidth: 2,
            borderColor: '#ffffff',
        }],
    };

    const optionsDoughnutChart = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom', labels: { font: { size: 11 }, usePointStyle: true } } },
    };

    // Konfigurasi Bar Chart (Top 5 Produk Terlaris)
    const dataBarChart = {
        labels: topProducts?.length > 0 ? topProducts.map(p => p.name) : ['Belum Ada Data'],
        datasets: [{
            label: 'Total Terjual (Unit)',
            data: topProducts?.length > 0 ? topProducts.map(p => p.total_sold) : [0],
            backgroundColor: 'rgba(59, 130, 246, 0.8)', // Blue-500
            borderRadius: 6,
        }],
    };

    const optionsBarChart = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            y: {
                beginAtZero: true,
                ticks: { font: { size: 10 }, stepSize: 1 },
                grid: { color: 'rgba(0, 0, 0, 0.04)' }
            },
            x: { grid: { display: false }, ticks: { font: { size: 10 } } }
        }
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
                        <p className="text-xs text-slate-500">Halo, <span className="font-bold text-slate-700">{auth.user.name}</span>! Berikut ringkasan analitik bisnis Anda.</p>
                    </div>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-sm">
                        <span className="w-2 h-2 mr-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                        Live System Active
                    </span>
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="py-8 bg-slate-100/70 min-h-[calc(100vh-4rem)]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                    
                    {/* STATISTIK UTAMA */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 relative overflow-hidden">
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-blue-500"></div>
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Omzet Penjualan</span>
                            <div className="mt-4">
                                <div className="text-2xl font-black text-slate-800 tracking-tight">{formatRupiah(stats.totalRevenue)}</div>
                                <p className="text-[11px] text-slate-400 mt-1">Akumulasi invoice lunas</p>
                            </div>
                        </div>
                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 relative overflow-hidden">
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-400"></div>
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Penjualan (SO)</span>
                            <div className="mt-4">
                                <div className="text-2xl font-black text-slate-800 tracking-tight">{stats.totalSalesOrders} <span className="text-xs font-medium text-slate-500">Transaksi</span></div>
                                <p className="text-[11px] text-slate-400 mt-1">Sales Order tercatat sistem</p>
                            </div>
                        </div>
                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200/80 relative overflow-hidden">
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-400"></div>
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Jumlah Produk</span>
                            <div className="mt-4">
                                <div className="text-2xl font-black text-slate-800 tracking-tight">{stats.totalProducts} <span className="text-xs font-medium text-slate-500">Item</span></div>
                                <p className="text-[11px] text-slate-400 mt-1">Katalog barang aktif</p>
                            </div>
                        </div>
                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-rose-200/80 relative overflow-hidden">
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 to-orange-400"></div>
                            <span className="text-xs font-bold uppercase tracking-wider text-rose-600">Stok Menipis (≤ 10)</span>
                            <div className="mt-4">
                                <div className="text-2xl font-black text-rose-600 tracking-tight">{stats.lowStockCount} <span className="text-xs font-medium text-rose-400">Barang</span></div>
                                <p className="text-[11px] text-rose-500/80 mt-1">Butuh tindakan restock</p>
                            </div>
                        </div>
                    </div>

                    {/* SECTION GRAFIK BAGIAN ATAS (Line & Doughnut) */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 lg:col-span-2 flex flex-col justify-between">
                            <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
                                <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-pulse"></span>
                                    Analitik Pendapatan vs Pengeluaran
                                </h3>
                                <span className="text-xs text-slate-400 font-medium">Tahun Berjalan</span>
                            </div>
                            <div className="h-72 w-full"><Line data={dataLineChart} options={optionsLineChart} /></div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 lg:col-span-1 flex flex-col justify-between">
                            <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
                                <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                    Status Sales Order
                                </h3>
                                <span className="text-xs text-slate-400 font-medium">Distribusi</span>
                            </div>
                            <div className="h-72 w-full flex items-center justify-center"><Doughnut data={dataDoughnutChart} options={optionsDoughnutChart} /></div>
                        </div>
                    </div>

                    {/* SECTION GRAFIK BAGIAN TENGAH (Bar Chart Top Produk & Tabel Stok Menipis) */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Bar Chart: Top 5 Produk Terlaris */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 lg:col-span-2 flex flex-col justify-between">
                            <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
                                <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></span>
                                    Top 5 Produk Terlaris
                                </h3>
                                <span className="text-xs text-slate-400 font-medium">Berdasarkan Jumlah Keluar</span>
                            </div>
                            <div className="h-64 w-full"><Bar data={dataBarChart} options={optionsBarChart} /></div>
                        </div>

                        {/* Tabel Stok Menipis */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 lg:col-span-1">
                            <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
                                <h3 className="font-bold text-slate-800 text-sm">Peringatan Stok Menipis</h3>
                                <Link href={route('products.index')} className="text-xs font-bold text-indigo-600 hover:text-indigo-800">Lihat Semua &rarr;</Link>
                            </div>
                            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                                {lowStockProducts.length > 0 ? (
                                    lowStockProducts.map((product) => (
                                        <div key={product.id} className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                                            <div>
                                                <p className="font-bold text-xs text-slate-800 line-clamp-1">{product.name}</p>
                                                <p className="text-[11px] text-slate-500">{formatRupiah(product.sell_price)}</p>
                                            </div>
                                            <span className="px-2.5 py-1 bg-rose-100 text-rose-700 font-extrabold text-[11px] rounded-lg">Sisa: {product.stock}</span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-xs text-slate-400 text-center py-8 bg-slate-50 rounded-xl border border-dashed border-slate-200">✅ Stok aman.</div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* SECTION BAWAH (Tabel Transaksi Terbaru & Log Aktivitas Gudang) */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        
                        {/* Tabel Transaksi Penjualan Terbaru */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80">
                            <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
                                <h3 className="font-bold text-slate-800 text-sm">Transaksi Penjualan Terbaru</h3>
                                <Link href={route('sales-orders.index')} className="text-xs font-bold text-indigo-600 hover:text-indigo-800">Lihat Semua &rarr;</Link>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left text-slate-600">
                                    <thead className="text-[11px] text-slate-400 uppercase bg-slate-50 border-y border-slate-200">
                                        <tr>
                                            <th className="px-3 py-2.5 font-semibold">No. Order</th>
                                            <th className="px-3 py-2.5 font-semibold">Pelanggan</th>
                                            <th className="px-3 py-2.5 text-right font-semibold">Total</th>
                                            <th className="px-3 py-2.5 text-center font-semibold">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 text-xs">
                                        {recentSalesOrders.length > 0 ? (
                                            recentSalesOrders.map((order) => (
                                                <tr key={order.id} className="hover:bg-indigo-50/30">
                                                    <td className="px-3 py-3 font-bold text-indigo-600 font-mono">{order.order_number}</td>
                                                    <td className="px-3 py-3 text-slate-800 font-semibold">{order.customer?.name || '-'}</td>
                                                    <td className="px-3 py-3 text-right font-black text-slate-900">{formatRupiah(order.total_amount)}</td>
                                                    <td className="px-3 py-3 text-center">
                                                        <span className={`px-2 py-0.5 text-[9px] font-extrabold rounded-full uppercase ${order.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                                                            {order.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr><td colSpan="4" className="px-3 py-6 text-center text-slate-400 italic">Belum ada transaksi.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Tabel Log Aktivitas Gudang (Stock Movement) */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80">
                            <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
                                <h3 className="font-bold text-slate-800 text-sm">Aktivitas Gudang Terbaru (Stock Movement)</h3>
                                <Link href={route('stock-movements.index')} className="text-xs font-bold text-indigo-600 hover:text-indigo-800">Lihat Semua &rarr;</Link>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left text-slate-600">
                                    <thead className="text-[11px] text-slate-400 uppercase bg-slate-50 border-y border-slate-200">
                                        <tr>
                                            <th className="px-3 py-2.5 font-semibold">Produk</th>
                                            <th className="px-3 py-2.5 text-center font-semibold">Tipe</th>
                                            <th className="px-3 py-2.5 text-center font-semibold">Qty</th>
                                            <th className="px-3 py-2.5 font-semibold">Keterangan</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 text-xs">
                                        {recentStockMovements.length > 0 ? (
                                            recentStockMovements.map((movement) => (
                                                <tr key={movement.id} className="hover:bg-slate-50/60">
                                                    <td className="px-3 py-3 font-bold text-slate-800">{movement.product?.name || 'Produk Dihapus'}</td>
                                                    <td className="px-3 py-3 text-center">
                                                        <span className={`px-2 py-0.5 text-[9px] font-extrabold rounded-full ${movement.type === 'IN' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                                                            {movement.type}
                                                        </span>
                                                    </td>
                                                    <td className="px-3 py-3 text-center font-black text-slate-900">{movement.quantity}</td>
                                                    <td className="px-3 py-3 text-slate-500 truncate max-w-[150px]">{movement.reference || '-'}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr><td colSpan="4" className="px-3 py-6 text-center text-slate-400 italic">Belum ada aktivitas gudang.</td></tr>
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