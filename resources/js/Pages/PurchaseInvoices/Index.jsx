import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ auth, invoices }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-slate-800 leading-tight">Purchase Invoices</h2>}
        >
            <Head title="Purchase Invoices" />

            <div className="py-8 bg-slate-50 min-h-screen">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Header Action */}
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">Purchase Invoices</h1>
                            <p className="text-sm text-slate-500">Kelola tagihan pembelian dari supplier</p>
                        </div>
                        <Link
                            href={route('purchase-invoices.create')}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg shadow-sm transition duration-150 flex items-center gap-2"
                        >
                            + Create New Invoice
                        </Link>
                    </div>

                    {/* Table Data */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <table className="w-full text-left border-collapse text-sm">
                            <thead>
                                <tr className="bg-slate-100/80 text-slate-600 font-semibold border-b border-slate-200">
                                    <th className="py-3 px-4">Invoice #</th>
                                    <th className="py-3 px-4">Supplier</th>
                                    <th className="py-3 px-4">Status</th>
                                    <th className="py-3 px-4">Tanggal</th>
                                    <th className="py-3 px-4">Jatuh Tempo</th>
                                    <th className="py-3 px-4 text-right">Grand Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {invoices.length > 0 ? (
                                    invoices.map((inv) => (
                                        <tr key={inv.id} className="hover:bg-slate-50/80 transition">
                                            <td className="py-3.5 px-4 font-semibold">
    <Link 
        href={route('purchase-invoices.show', inv.id)} 
        className="text-blue-600 hover:text-blue-800 hover:underline"
    >
        {inv.invoice_number}
    </Link>
</td>
                                            <td className="py-3.5 px-4 text-slate-700">{inv.supplier?.name}</td>
                                            <td className="py-3.5 px-4">
                                                <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-1 rounded-full uppercase">
                                                    {inv.status}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4 text-slate-600">{inv.invoice_date}</td>
                                            <td className="py-3.5 px-4 text-slate-600">{inv.due_date}</td>
                                            <td className="py-3.5 px-4 text-right font-bold text-slate-900">
                                                Rp {Number(inv.grand_total).toLocaleString('id-ID')}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="py-8 text-center text-slate-400">
                                            Belum ada data Purchase Invoice. Klik tombol di atas untuk membuat.
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