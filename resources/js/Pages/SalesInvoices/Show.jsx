import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Show({ salesInvoice }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        amount: salesInvoice.grand_total - (salesInvoice.paid_amount || 0),
        payment_date: new Date().toISOString().split('T')[0],
        payment_method: 'transfer',
        notes: '',
    });

    const submitPayment = (e) => {
        e.preventDefault();
        post(route('sales-invoices.payments.store', salesInvoice.id), {
            onSuccess: () => reset('notes'),
        });
    };

    return (
        <div className="py-12 max-w-7xl mx-auto sm:px-6 lg:px-8">
            <Head title={`Detail Invoice - ${salesInvoice.invoice_number}`} />

            <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Detail Faktur: {salesInvoice.invoice_number}
                    </h2>
                    <Link
                        href={route('sales-invoices.index')}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm"
                    >
                        Kembali
                    </Link>
                </div>

                {/* Informasi Utama */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 bg-gray-50 p-4 rounded">
                    <div>
                        <p className="text-sm text-gray-500">No. Sales Order:</p>
                        <p className="font-medium">{salesInvoice.sales_order?.order_number || '-'}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Pelanggan:</p>
                        <p className="font-medium">{salesInvoice.customer_name}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Tanggal Faktur:</p>
                        <p className="font-medium">{salesInvoice.invoice_date}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Jatuh Tempo:</p>
                        <p className="font-medium">{salesInvoice.due_date}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Grand Total:</p>
                        <p className="font-medium text-gray-900">Rp {Number(salesInvoice.grand_total).toLocaleString()}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Sudah Dibayar:</p>
                        <p className="font-medium text-green-600">Rp {Number(salesInvoice.paid_amount || 0).toLocaleString()}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Status:</p>
                        <span className={`px-2 py-1 text-xs rounded uppercase font-bold ${
                            salesInvoice.status === 'paid' ? 'bg-green-100 text-green-800' : 
                            salesInvoice.status === 'partial' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                            {salesInvoice.status}
                        </span>
                    </div>
                </div>

                {/* Tabel Item Produk */}
                <h3 className="text-lg font-medium text-gray-700 mb-3">Daftar Item Produk</h3>
                <table className="min-w-full divide-y divide-gray-200 border mb-8">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produk</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Jumlah</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Harga Satuan</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {salesInvoice.items && salesInvoice.items.map((item) => (
                            <tr key={item.id}>
                                <td className="px-6 py-4 text-sm text-gray-900">{item.product?.name || 'Produk'}</td>
                                <td className="px-6 py-4 text-sm text-center text-gray-900">{item.quantity}</td>
                                <td className="px-6 py-4 text-sm text-right text-gray-900">Rp {Number(item.unit_price).toLocaleString()}</td>
                                <td className="px-6 py-4 text-sm text-right text-gray-900">Rp {Number(item.sub_total).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Bagian Riwayat Pembayaran & Form Input Pembayaran */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t pt-6">
                    {/* Daftar Riwayat Pembayaran */}
                    <div>
                        <h3 className="text-lg font-medium text-gray-700 mb-3">Riwayat Pembayaran</h3>
                        {salesInvoice.payments && salesInvoice.payments.length > 0 ? (
                            <table className="min-w-full divide-y divide-gray-200 border">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">No. Bayar</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
                                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Jumlah</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {salesInvoice.payments.map((pay) => (
                                        <tr key={pay.id}>
                                            <td className="px-4 py-2 text-sm text-gray-900">{pay.payment_number}</td>
                                            <td className="px-4 py-2 text-sm text-gray-500">{pay.payment_date}</td>
                                            <td className="px-4 py-2 text-sm text-right font-medium text-green-600">Rp {Number(pay.amount).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="text-sm text-gray-500 italic">Belum ada riwayat pembayaran untuk faktur ini.</p>
                        )}
                    </div>

                    {/* Form Catat Pembayaran Baru (Hanya tampil jika belum lunas) */}
                    {salesInvoice.status !== 'paid' && (
                        <div className="bg-gray-50 p-4 rounded border">
                            <h3 className="text-lg font-medium text-gray-700 mb-3">Catat Pembayaran</h3>
                            <form onSubmit={submitPayment}>
                                <div className="mb-3">
                                    <label className="block text-sm font-medium text-gray-700">Jumlah Bayar (Rp)</label>
                                    <input
                                        type="number"
                                        value={data.amount}
                                        onChange={(e) => setData('amount', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm text-sm"
                                        required
                                    />
                                    {errors.amount && <div className="text-red-500 text-xs mt-1">{errors.amount}</div>}
                                </div>

                                <div className="mb-3">
                                    <label className="block text-sm font-medium text-gray-700">Tanggal Bayar</label>
                                    <input
                                        type="date"
                                        value={data.payment_date}
                                        onChange={(e) => setData('payment_date', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm text-sm"
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="block text-sm font-medium text-gray-700">Metode Pembayaran</label>
                                    <select
                                        value={data.payment_method}
                                        onChange={(e) => setData('payment_method', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm text-sm"
                                    >
                                        <option value="cash">Cash / Tunai</option>
                                        <option value="transfer">Transfer Bank</option>
                                        <option value="giro">Giro / Cek</option>
                                    </select>
                                </div>

                                <div className="mb-3">
                                    <label className="block text-sm font-medium text-gray-700">Catatan (Opsional)</label>
                                    <input
                                        type="text"
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        placeholder="Misal: Lunas via BCA"
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm text-sm"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded text-sm transition"
                                >
                                    {processing ? 'Menyimpan...' : 'Simpan Pembayaran'}
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}