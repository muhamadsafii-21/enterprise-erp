import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function AccountsPayable({ auth, invoices, totalDebt }) {
    const formatRupiah = (num) => 
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num || 0);

    return (
        <AuthenticatedLayout 
            user={auth.user} 
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Laporan Utang Usaha (Accounts Payable)</h2>}
        >
            <Head title="Laporan Utang Usaha" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    
                    {/* Kartu Ringkasan Total Utang */}
                    <div className="bg-white p-6 rounded-lg shadow border flex justify-between items-center">
                        <div>
                            <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">Total Sisa Utang ke Supplier</span>
                            <h2 className="text-3xl font-black text-red-600 font-mono mt-1">{formatRupiah(totalDebt)}</h2>
                        </div>
                        <div>
                            <span className="text-xs bg-red-100 text-red-800 px-3 py-1 rounded-full font-bold uppercase">
                                {invoices.length} Faktur Belum Lunas
                            </span>
                        </div>
                    </div>

                    {/* Tabel Daftar Utang */}
                    <div className="bg-white p-6 rounded-lg shadow border overflow-x-auto">
                        <h3 className="text-lg font-semibold mb-4 text-gray-700">Rincian Faktur Belum Lunas</h3>
                        <table className="w-full text-sm text-left text-gray-600 border-collapse">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                                <tr>
                                    <th className="px-4 py-3">No. Invoice</th>
                                    <th className="px-4 py-3">Supplier</th>
                                    <th className="px-4 py-3">Tanggal Invoice</th>
                                    <th className="px-4 py-3">Jatuh Tempo</th>
                                    <th className="px-4 py-3 text-right">Total Tagihan</th>
                                    <th className="px-4 py-3 text-right">Sudah Dibayar</th>
                                    <th className="px-4 py-3 text-right">Sisa Kurang</th>
                                    <th className="px-4 py-3 text-center">Status</th>
                                    <th className="px-4 py-3 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoices.length > 0 ? (
                                    invoices.map((inv) => (
                                        <tr key={inv.id} className="border-b hover:bg-gray-50">
                                            <td className="px-4 py-3 font-bold text-gray-800 font-mono">{inv.invoice_number}</td>
                                            <td className="px-4 py-3 font-semibold">{inv.supplier_name}</td>
                                            <td className="px-4 py-3">{inv.invoice_date}</td>
                                            <td className="px-4 py-3 text-red-600 font-medium">{inv.due_date}</td>
                                            <td className="px-4 py-3 text-right">{formatRupiah(inv.grand_total)}</td>
                                            <td className="px-4 py-3 text-right text-green-600">{formatRupiah(inv.paid_amount)}</td>
                                            <td className="px-4 py-3 text-right font-black text-red-700">{formatRupiah(inv.remaining_balance)}</td>
                                            <td className="px-4 py-3 text-center">
                                                <span className={`px-2 py-1 text-xs font-bold rounded uppercase ${
                                                    inv.status === 'partially_paid' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {inv.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <Link 
                                                    href={route('purchase-invoices.show', inv.id)} 
                                                    className="text-indigo-600 hover:underline font-semibold text-xs"
                                                >
                                                    Detail
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="9" className="text-center py-6 text-gray-400 italic">
                                            Hore! Tidak ada utang yang tertunda. Semua invoice sudah lunas.
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