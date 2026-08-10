import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Show({ auth, invoice }) {
    const [showPaymentModal, setShowPaymentModal] = useState(false);

    // Form handling menggunakan Inertia useForm
    const { data, setData, post, processing, reset, errors } = useForm({
        amount: invoice.grand_total - (invoice.paid_amount || 0), // Default sisa tagihan
        payment_date: new Date().toISOString().slice(0, 10),
        payment_method: 'Transfer',
        notes: '',
    });

    const handlePrint = () => {
        window.print();
    };

    const submitPayment = (e) => {
        e.preventDefault();
        post(route('purchase-invoices.payments.store', invoice.id), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setShowPaymentModal(false);
            },
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-slate-800 leading-tight">Detail Purchase Invoice</h2>}
        >
            <Head title={`Invoice ${invoice.invoice_number}`} />

            <div className="py-8 bg-slate-50 min-h-screen">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    
                    {/* Action Bar (Top) */}
                    <div className="flex justify-between items-center print:hidden">
                        <Link
                            href={route('purchase-invoices.index')}
                            className="text-sm font-medium text-slate-500 hover:text-slate-700 flex items-center gap-1"
                        >
                            &larr; Kembali ke Daftar Invoice
                        </Link>
                        <div className="flex gap-3">
                            <button
                                onClick={handlePrint}
                                className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium px-4 py-2 rounded-lg text-sm shadow-sm transition"
                            >
                                🖨️ Cetak / Print
                            </button>
                            {invoice.status !== 'paid' && (
                                <button
                                    onClick={() => setShowPaymentModal(true)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg text-sm shadow-sm transition"
                                >
                                    💳 Catat Pembayaran
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Invoice Card Container */}
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 print:shadow-none print:border-none">
                        
                        {/* Header Invoice */}
                        <div className="flex justify-between items-start pb-6 border-b border-slate-200">
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900">PURCHASE INVOICE</h1>
                                <p className="text-sm font-semibold text-blue-600 mt-1">{invoice.invoice_number}</p>
                            </div>
                            <div className="text-right">
                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase ${
                                    invoice.status === 'paid' 
                                        ? 'bg-emerald-100 text-emerald-800' 
                                        : invoice.status === 'partially_paid'
                                        ? 'bg-blue-100 text-blue-800'
                                        : 'bg-amber-100 text-amber-800'
                                }`}>
                                    Status: {invoice.status}
                                </span>
                            </div>
                        </div>

                        {/* Metadata Grid */}
                        <div className="grid grid-cols-2 gap-8 my-6 text-sm">
                            <div>
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Vendor / Supplier</h3>
                                <p className="font-bold text-slate-800 text-base">{invoice.supplier?.name}</p>
                                <p className="text-slate-600">{invoice.supplier?.address || 'Alamat tidak tersedia'}</p>
                                <p className="text-slate-600">Telp: {invoice.supplier?.phone || '-'}</p>
                            </div>
                            <div className="space-y-2 text-right">
                                <div>
                                    <span className="text-slate-500">Tanggal Invoice: </span>
                                    <span className="font-semibold text-slate-800">{invoice.invoice_date}</span>
                                </div>
                                <div>
                                    <span className="text-slate-500">Jatuh Tempo: </span>
                                    <span className="font-semibold text-slate-800">{invoice.due_date}</span>
                                </div>
                                <div>
                                    <span className="text-slate-500">Ref Goods Receipt: </span>
                                    <span className="font-semibold text-blue-600">{invoice.goods_receipt?.gr_number}</span>
                                </div>
                            </div>
                        </div>

                        {/* Items Table */}
                        <div className="mt-8">
                            <table className="w-full text-left border-collapse text-sm">
                                <thead>
                                    <tr className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200">
                                        <th className="py-3 px-4">Deskripsi Item</th>
                                        <th className="py-3 px-4 text-center">Qty</th>
                                        <th className="py-3 px-4 text-right">Harga Satuan</th>
                                        <th className="py-3 px-4 text-right">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {invoice.items?.map((item) => (
                                        <tr key={item.id}>
                                            <td className="py-3.5 px-4 font-medium text-slate-800">{item.item_name}</td>
                                            <td className="py-3.5 px-4 text-center text-slate-600">{item.quantity}</td>
                                            <td className="py-3.5 px-4 text-right text-slate-600">
                                                Rp {Number(item.unit_price).toLocaleString('id-ID')}
                                            </td>
                                            <td className="py-3.5 px-4 text-right font-semibold text-slate-900">
                                                Rp {Number(item.total_price).toLocaleString('id-ID')}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Summary Section */}
                        <div className="flex justify-end border-t border-slate-200 pt-6 mt-6">
                            <div className="w-full md:w-80 space-y-2 text-sm">
                                <div className="flex justify-between text-slate-600">
                                    <span>Subtotal</span>
                                    <span className="font-medium text-slate-800">Rp {Number(invoice.subtotal).toLocaleString('id-ID')}</span>
                                </div>
                                {Number(invoice.discount) > 0 && (
                                    <div className="flex justify-between text-slate-600">
                                        <span>Diskon</span>
                                        <span className="font-medium text-amber-600">- Rp {Number(invoice.discount).toLocaleString('id-ID')}</span>
                                    </div>
                                )}
                                {Number(invoice.tax) > 0 && (
                                    <div className="flex justify-between text-slate-600">
                                        <span>Pajak (Tax)</span>
                                        <span className="font-medium text-slate-800">+ Rp {Number(invoice.tax).toLocaleString('id-ID')}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-base font-bold text-slate-900 border-t border-slate-200 pt-2">
                                    <span>Grand Total</span>
                                    <span className="text-blue-600">Rp {Number(invoice.grand_total).toLocaleString('id-ID')}</span>
                                </div>
                                <div className="flex justify-between text-slate-600">
                                    <span>Sudah Dibayar</span>
                                    <span className="font-medium text-emerald-600">Rp {Number(invoice.paid_amount || 0).toLocaleString('id-ID')}</span>
                                </div>
                                <div className="flex justify-between text-slate-700 font-semibold border-t border-dashed border-slate-200 pt-2">
                                    <span>Sisa Kurang</span>
                                    <span className="text-rose-600">
                                        Rp {Number(invoice.grand_total - (invoice.paid_amount || 0)).toLocaleString('id-ID')}
                                    </span>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Riwayat Pembayaran Card */}
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 print:hidden">
                        <h3 className="text-lg font-bold text-slate-800 mb-4">Riwayat Pembayaran</h3>
                        {invoice.payments && invoice.payments.length > 0 ? (
                            <table className="w-full text-left border-collapse text-sm">
                                <thead>
                                    <tr className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200">
                                        <th className="py-2.5 px-4">Tanggal</th>
                                        <th className="py-2.5 px-4">Metode</th>
                                        <th className="py-2.5 px-4">Catatan</th>
                                        <th className="py-2.5 px-4 text-right">Jumlah Bayar</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {invoice.payments.map((payment) => (
                                        <tr key={payment.id}>
                                            <td className="py-3 px-4 text-slate-700">{payment.payment_date}</td>
                                            <td className="py-3 px-4 text-slate-700">{payment.payment_method}</td>
                                            <td className="py-3 px-4 text-slate-500">{payment.notes || '-'}</td>
                                            <td className="py-3 px-4 text-right font-semibold text-emerald-600">
                                                Rp {Number(payment.amount).toLocaleString('id-ID')}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="text-sm text-slate-500 italic">Belum ada riwayat pembayaran untuk faktur ini.</p>
                        )}
                    </div>

                </div>
            </div>

            {/* Modal Input Pembayaran */}
            {showPaymentModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-lg">
                        <h3 className="text-lg font-bold text-slate-800 mb-4">Catat Pembayaran Invoice</h3>
                        
                        <form onSubmit={submitPayment} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Jumlah Bayar (Rp)</label>
                                <input
                                    type="number"
                                    value={data.amount}
                                    onChange={e => setData('amount', e.target.value)}
                                    className="w-full border-slate-300 rounded-lg shadow-sm text-sm"
                                    required
                                />
                                {errors.amount && <div className="text-red-500 text-xs mt-1">{errors.amount}</div>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Tanggal Bayar</label>
                                <input
                                    type="date"
                                    value={data.payment_date}
                                    onChange={e => setData('payment_date', e.target.value)}
                                    className="w-full border-slate-300 rounded-lg shadow-sm text-sm"
                                    required
                                />
                                {errors.payment_date && <div className="text-red-500 text-xs mt-1">{errors.payment_date}</div>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Metode Pembayaran</label>
                                <select
                                    value={data.payment_method}
                                    onChange={e => setData('payment_method', e.target.value)}
                                    className="w-full border-slate-300 rounded-lg shadow-sm text-sm"
                                >
                                    <option value="Transfer">Transfer Bank</option>
                                    <option value="Cash">Cash / Tunai</option>
                                    <option value="Giro">Giro / Check</option>
                                </select>
                                {errors.payment_method && <div className="text-red-500 text-xs mt-1">{errors.payment_method}</div>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Catatan (Opsional)</label>
                                <textarea
                                    value={data.notes}
                                    onChange={e => setData('notes', e.target.value)}
                                    className="w-full border-slate-300 rounded-lg shadow-sm text-sm"
                                    rows="2"
                                ></textarea>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t">
                                <button
                                    type="button"
                                    onClick={() => setShowPaymentModal(false)}
                                    className="bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition"
                                >
                                    {processing ? 'Menyimpan...' : 'Simpan Pembayaran'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}