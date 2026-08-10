import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function ProfitAndLoss({ auth, summary }) {
    const formatRupiah = (num) => 
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num || 0);

    return (
        <AuthenticatedLayout 
            user={auth.user} 
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Laporan Laba Rugi (Profit & Loss)</h2>}
        >
            <Head title="Laporan Laba Rugi" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    
                    {/* Kartu Informasi Periode */}
                    <div className="bg-white p-6 rounded-lg shadow border flex justify-between items-center">
                        <div>
                            <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">Periode Laporan</span>
                            <h3 className="text-lg font-bold text-gray-800 mt-1">
                                {summary.start_date} s/d {summary.end_date}
                            </h3>
                        </div>
                        <div className="text-right">
                            <span className="text-xs text-gray-400 uppercase font-bold tracking-wider block">Status Laba Bersih</span>
                            <span className={`text-xl font-black ${summary.net_profit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                {formatRupiah(summary.net_profit)}
                            </span>
                        </div>
                    </div>

                    {/* Tabel Komponen Laba Rugi */}
                    <div className="bg-white p-6 rounded-lg shadow border">
                        <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">Ringkasan Kinerja Keuangan</h3>
                        
                        <div className="space-y-4 text-sm">
                            {/* Pendapatan */}
                            <div className="flex justify-between items-center py-2 border-b">
                                <span className="font-semibold text-gray-600">1. Total Pendapatan (Revenue)</span>
                                <span className="font-bold text-gray-900 font-mono">{formatRupiah(summary.total_revenue)}</span>
                            </div>

                            {/* HPP */}
                            <div className="flex justify-between items-center py-2 border-b">
                                <span className="font-semibold text-gray-600">2. Harga Pokok Penjualan / Pembelian (HPP / COGS)</span>
                                <span className="font-bold text-red-600 font-mono">- {formatRupiah(summary.total_hpp)}</span>
                            </div>

                            {/* Laba Kotor */}
                            <div className="flex justify-between items-center py-3 bg-gray-50 px-4 rounded font-bold">
                                <span className="text-gray-800">LABA KOTOR (Gross Profit)</span>
                                <span className={`font-mono ${summary.gross_profit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                    {formatRupiah(summary.gross_profit)}
                                </span>
                            </div>

                            {/* Beban Operasional */}
                            <div className="flex justify-between items-center py-2 border-b">
                                <span className="font-semibold text-gray-600">3. Total Beban Operasional</span>
                                <span className="font-bold text-red-600 font-mono">- {formatRupiah(summary.total_expenses)}</span>
                            </div>

                            {/* Laba Bersih (Final) */}
                            <div className="flex justify-between items-center py-4 bg-emerald-50 border border-emerald-200 px-4 rounded-lg">
                                <span className="text-base font-black text-emerald-900 uppercase">Laba / Rugi Bersih (Net Profit)</span>
                                <span className={`text-xl font-black font-mono ${summary.net_profit >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                                    {formatRupiah(summary.net_profit)}
                                </span>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}