import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';

export default function Create({ auth, goodsReceipts }) {
    const [selectedGR, setSelectedGR] = useState(null);

    const { data, setData, post, processing, errors } = useForm({
        goods_receipt_id: '',
        supplier_id: '',
        invoice_date: new Date().toISOString().split('T')[0],
        due_date: '',
        subtotal: 0,
        discount: 0,
        tax: 0,
        grand_total: 0,
        items: [],
    });

   // Jalankan saat User memilih Goods Receipt (GR)
    const handleGRChange = (grId) => {
        const gr = goodsReceipts.find((item) => item.id === parseInt(grId));
        if (gr) {
            setSelectedGR(gr);

            // Ambil item asli dari relasi PO yang ada di GR
            const grItems = gr.purchase_order && gr.purchase_order.items ? gr.purchase_order.items.map((item) => {
                const qty = item.quantity || 0;
                const price = item.unit_cost || 0; // Mengambil harga asli dari PO (misal: 65.000)
                return {
                    item_name: item.product ? item.product.name : 'Produk',
                    quantity: qty,
                    unit_price: price,
                    total_price: qty * price,
                };
            }) : [];

            const sub = grItems.reduce((acc, curr) => acc + curr.total_price, 0);

            setData((prevData) => ({
                ...prevData,
                goods_receipt_id: gr.id,
                supplier_id: gr.supplier_id,
                items: grItems,
                subtotal: sub,
                grand_total: sub - prevData.discount + prevData.tax,
            }));
        } else {
            setSelectedGR(null);
            setData((prevData) => ({
                ...prevData,
                goods_receipt_id: '',
                supplier_id: '',
                items: [],
                subtotal: 0,
                grand_total: 0,
            }));
        }
    };

    // Recalculate saat Discount / Tax diubah
    const handleCalcChange = (field, val) => {
        const numVal = parseFloat(val) || 0;
        const newDiscount = field === 'discount' ? numVal : data.discount;
        const newTax = field === 'tax' ? numVal : data.tax;
        const newGrandTotal = data.subtotal - newDiscount + newTax;

        setData((prev) => ({
            ...prev,
            [field]: numVal,
            grand_total: newGrandTotal,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('purchase-invoices.store'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-slate-800 leading-tight">Create Purchase Invoice</h2>}
        >
            <Head title="Create Purchase Invoice" />

            <div className="py-8 bg-slate-50 min-h-screen">
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">
                    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <div className="flex justify-between items-center pb-4 mb-6 border-b border-slate-200">
                            <h1 className="text-xl font-bold text-slate-800">Form Purchase Invoice Baru</h1>
                            <Link href={route('purchase-invoices.index')} className="text-sm text-slate-500 hover:text-slate-700">
                                &larr; Kembali
                            </Link>
                        </div>

                        {/* Top Form Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Pilih Goods Receipt (GR)</label>
                                <select
                                    className="w-full border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    onChange={(e) => handleGRChange(e.target.value)}
                                >
                                    <option value="">-- Pilih Nomor GR --</option>
                                    {goodsReceipts.map((gr) => (
                                        <option key={gr.id} value={gr.id}>
                                            {gr.gr_number} - ({gr.supplier?.name})
                                        </option>
                                    ))}
                                </select>
                                {errors.goods_receipt_id && <p className="text-red-500 text-xs mt-1">{errors.goods_receipt_id}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Supplier</label>
                                <input
                                    type="text"
                                    readOnly
                                    value={selectedGR ? selectedGR.supplier?.name : ''}
                                    placeholder="Otomatis terisi setelah pilih GR"
                                    className="w-full bg-slate-100 border-slate-300 rounded-lg text-slate-600 cursor-not-allowed"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Tanggal Invoice</label>
                                <input
                                    type="date"
                                    value={data.invoice_date}
                                    onChange={(e) => setData('invoice_date', e.target.value)}
                                    className="w-full border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-600 uppercase mb-2">Tanggal Jatuh Tempo</label>
                                <input
                                    type="date"
                                    value={data.due_date}
                                    onChange={(e) => setData('due_date', e.target.value)}
                                    className="w-full border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                />
                                {errors.due_date && <p className="text-red-500 text-xs mt-1">{errors.due_date}</p>}
                            </div>
                        </div>

                        {/* Item Table */}
                        <div className="mb-6">
                            <h3 className="text-sm font-bold text-slate-700 uppercase mb-3">Detail Item Barang (Ditarik dari GR)</h3>
                            <table className="w-full text-left border-collapse text-sm">
                                <thead>
                                    <tr className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200">
                                        <th className="py-2.5 px-3">Nama Barang</th>
                                        <th className="py-2.5 px-3">Qty Diterima</th>
                                        <th className="py-2.5 px-3">Harga Satuan</th>
                                        <th className="py-2.5 px-3 text-right">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.items.length > 0 ? (
                                        data.items.map((item, idx) => (
                                            <tr key={idx} className="border-b border-slate-100">
                                                <td className="py-3 px-3">{item.item_name}</td>
                                                <td className="py-3 px-3">{item.quantity}</td>
                                                <td className="py-3 px-3">Rp {item.unit_price.toLocaleString('id-ID')}</td>
                                                <td className="py-3 px-3 text-right font-medium">
                                                    Rp {item.total_price.toLocaleString('id-ID')}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="py-4 text-center text-slate-400 italic">
                                                Pilih Goods Receipt di atas untuk memuat item barang.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Summary & Calculations */}
                        <div className="flex justify-end border-t border-slate-200 pt-4">
                            <div className="w-full md:w-80 space-y-3">
                                <div className="flex justify-between text-sm text-slate-600">
                                    <span>Subtotal:</span>
                                    <span className="font-semibold">Rp {data.subtotal.toLocaleString('id-ID')}</span>
                                </div>
                                <div className="flex justify-between text-sm text-slate-600 items-center">
                                    <span>Diskon:</span>
                                    <input
                                        type="number"
                                        value={data.discount}
                                        onChange={(e) => handleCalcChange('discount', e.target.value)}
                                        className="w-32 border-slate-300 rounded text-right py-1 text-sm focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div className="flex justify-between text-sm text-slate-600 items-center">
                                    <span>Pajak (Tax):</span>
                                    <input
                                        type="number"
                                        value={data.tax}
                                        onChange={(e) => handleCalcChange('tax', e.target.value)}
                                        className="w-32 border-slate-300 rounded text-right py-1 text-sm focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div className="flex justify-between text-base font-bold text-slate-900 border-t border-slate-200 pt-2">
                                    <span>Grand Total:</span>
                                    <span className="text-blue-600">Rp {data.grand_total.toLocaleString('id-ID')}</span>
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing || data.items.length === 0}
                                    className="w-full mt-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-semibold py-2.5 rounded-lg shadow transition duration-150"
                                >
                                    {processing ? 'Saving...' : 'Simpan Purchase Invoice'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}