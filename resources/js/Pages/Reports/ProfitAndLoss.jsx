import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';

export default function ProfitAndLoss({ auth, summary, filters }) {
    const { data, setData, processing } = useForm({
        start_date: filters?.start_date || summary.start_date || '',
        end_date: filters?.end_date || summary.end_date || '',
    });

   const handleFilter = () => {
        // Validasi: Jika tanggal mulai lebih besar dari tanggal selesai, cegah submit & beri alert
        if (data.start_date && data.end_date && data.start_date > data.end_date) {
            alert('Perhatian: "Dari Tanggal" tidak boleh lebih besar dari "Sampai Tanggal"!');
            return;
        }

        router.get('/reports/profit-and-loss', {
            start_date: data.start_date,
            end_date: data.end_date,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const formatRupiah = (num) => 
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num || 0);

    const isEmptyReport = summary.total_revenue === 0 && summary.total_hpp === 0 && summary.total_expenses === 0;

    return (
        <AuthenticatedLayout 
            user={auth.user} 
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Laporan Laba Rugi (Profit & Loss)</h2>}
        >
            <Head title="Laporan Laba Rugi" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    
                    {/* Form Filter Rentang Tanggal */}
<div className="bg-white p-6 rounded-lg shadow border">
    <div className="flex flex-col sm:flex-row items-end gap-4">
        <div className="w-full sm:w-auto flex-1">
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Dari Tanggal</label>
            <input 
                type="date" 
                value={data.start_date}
                onChange={(e) => setData('start_date', e.target.value)}
                className="w-full border-gray-300 rounded-md shadow-sm text-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
        </div>
        <div className="w-full sm:w-auto flex-1">
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Sampai Tanggal</label>
            <input 
                type="date" 
                value={data.end_date}
                min={data.start_date} // Mencegah pilih tanggal sebelum start_date
                onChange={(e) => setData('end_date', e.target.value)}
                className="w-full border-gray-300 rounded-md shadow-sm text-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
        </div>
        
        <div>
            <button 
                type="button" 
                onClick={handleFilter}
                disabled={processing}
                className="w-full sm:w-auto px-5 py-2 bg-indigo-600 text-white font-semibold text-sm rounded-md shadow hover:bg-indigo-700 transition disabled:opacity-50 cursor-pointer"
            >
                Filter Laporan
            </button>
        </div>
        <a 
    href={`/reports/profit-and-loss/pdf?start_date=${data.start_date}&end_date=${data.end_date}`}
    target="_blank"
    className="px-4 py-2 bg-emerald-600 text-white font-semibold text-sm rounded-md shadow hover:bg-emerald-700 transition flex items-center justify-center"
>
    Cetak PDF
</a>
    </div>
</div>

                    {/* Kartu Informasi Periode & Status Laba Bersih */}
                    <div className="bg-white p-6 rounded-lg shadow border flex justify-between items-center">
                        <div>
                            <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">Periode Aktif</span>
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
                        
                        {isEmptyReport && (
                            <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-md mb-6 text-sm flex items-center gap-3">
                                <svg className="w-5 h-5 text-amber-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                                <div>
                                    <span className="font-bold">Informasi:</span> Belum ada laporan atau transaksi tercatat pada rentang tanggal <span className="font-semibold">{summary.start_date}</span> s/d <span className="font-semibold">{summary.end_date}</span>.
                                </div>
                            </div>
                        )}

                        <div className="space-y-4 text-sm">
                            <div className="flex justify-between items-center py-2 border-b">
                                <span className="font-semibold text-gray-600">1. Total Pendapatan (Revenue)</span>
                                <span className="font-bold text-gray-900 font-mono">{formatRupiah(summary.total_revenue)}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b">
                                <span className="font-semibold text-gray-600">2. Harga Pokok Penjualan / Pembelian (HPP / COGS)</span>
                                <span className="font-bold text-red-600 font-mono">- {formatRupiah(summary.total_hpp)}</span>
                            </div>
                            <div className="flex justify-between items-center py-3 bg-gray-50 px-4 rounded font-bold">
                                <span className="text-gray-800">LABA KOTOR (Gross Profit)</span>
                                <span className={`font-mono ${summary.gross_profit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                    {formatRupiah(summary.gross_profit)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b">
                                <span className="font-semibold text-gray-600">3. Total Beban Operasional</span>
                                <span className="font-bold text-red-600 font-mono">- {formatRupiah(summary.total_expenses)}</span>
                            </div>
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