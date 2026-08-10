import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';

export default function Create({ auth, salesOrder, invoiceNumber }) {
    const { data, setData, post, processing, errors } = useForm({
        sales_order_id: salesOrder ? salesOrder.id : '',
        invoice_number: invoiceNumber || '',
        invoice_date: new Date().toISOString().slice(0, 10),
        due_date: '',
        notes: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('sales-invoices.store'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Buat Faktur Penjualan dari Sales Order</h2>}
        >
            <Head title="Buat Faktur Penjualan" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 border border-gray-200">
                        
                        <form onSubmit={submit} className="space-y-6">
                            
                            {/* Informasi Referensi Sales Order & Pelanggan */}
                            <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                                <h3 className="text-sm font-bold text-indigo-900 uppercase tracking-wider mb-2">Informasi Sales Order</h3>
                                <div className="grid grid-cols-2 gap-4 text-sm text-indigo-800">
                                    <div><span className="font-semibold">No. SO:</span> {salesOrder.order_number}</div>
                                    <div><span className="font-semibold">Pelanggan:</span> {salesOrder.customer?.name || '-'}</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Nomor Invoice</label>
                                    <input
                                        type="text"
                                        value={data.invoice_number}
                                        readOnly
                                        className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 text-gray-600 shadow-sm sm:text-sm cursor-not-allowed"
                                    />
                                    {errors.invoice_number && <div className="text-red-500 text-xs mt-1">{errors.invoice_number}</div>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Tanggal Invoice</label>
                                    <input
                                        type="date"
                                        value={data.invoice_date}
                                        onChange={(e) => setData('invoice_date', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        required
                                    />
                                    {errors.invoice_date && <div className="text-red-500 text-xs mt-1">{errors.invoice_date}</div>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Jatuh Tempo (Due Date)</label>
                                    <input
                                        type="date"
                                        value={data.due_date}
                                        onChange={(e) => setData('due_date', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        required
                                    />
                                    {errors.due_date && <div className="text-red-500 text-xs mt-1">{errors.due_date}</div>}
                                </div>
                            </div>

                            {/* Daftar Produk dari Sales Order (Read-only otomatis ikut SO) */}
                            <div className="border-t border-gray-200 pt-4">
                                <h3 className="text-sm font-bold text-gray-800 uppercase mb-3">Daftar Produk / Barang dari Sales Order</h3>
                                <div className="overflow-x-auto border border-gray-200 rounded-md">
                                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                                        <thead className="bg-gray-50 text-gray-700">
                                            <tr>
                                                <th className="px-4 py-2 text-left">Produk</th>
                                                <th className="px-4 py-2 text-center">Qty</th>
                                                <th className="px-4 py-2 text-right">Harga Satuan</th>
                                                <th className="px-4 py-2 text-right">Subtotal</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 bg-white">
                                            {salesOrder.items && salesOrder.items.map((item, index) => (
                                                <tr key={index}>
                                                    <td className="px-4 py-2">{item.product?.name || 'Produk'}</td>
                                                    <td className="px-4 py-2 text-center">{item.quantity}</td>
                                                    <td className="px-4 py-2 text-right">Rp {Number(item.unit_price).toLocaleString('id-ID')}</td>
                                                    <td className="px-4 py-2 text-right font-medium">Rp {Number(item.sub_total || (item.quantity * item.unit_price)).toLocaleString('id-ID')}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Catatan / Keterangan</label>
                                <textarea
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    rows="3"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    placeholder="Catatan tambahan untuk pelanggan..."
                                ></textarea>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                                <Link
                                    href={route('sales-orders.index')}
                                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm font-semibold transition"
                                >
                                    Batal
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-semibold transition shadow-sm disabled:opacity-50"
                                >
                                    {processing ? 'Menyimpan...' : 'Terbitkan Faktur'}
                                </button>
                            </div>

                        </form>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}