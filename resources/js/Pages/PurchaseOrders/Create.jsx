import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';

export default function Create({ auth, products, suppliers }) {
    const { data, setData, post, processing, errors } = useForm({
        supplier_id: '',
        order_date: new Date().toISOString().split('T')[0],
        items: [{ product_id: '', quantity: 1, unit_cost: 0, subtotal: 0 }]
    });

    const formatRupiah = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num || 0);

    const handleProductChange = (index, productId) => {
        const selectedProd = products.find(p => p.id === parseInt(productId));
        const newItems = [...data.items];
        newItems[index].product_id = productId;
        newItems[index].unit_cost = selectedProd ? selectedProd.buy_price : 0;
        newItems[index].subtotal = newItems[index].quantity * newItems[index].unit_cost;
        setData('items', newItems);
    };

    const handleQtyCostChange = (index, field, value) => {
        const newItems = [...data.items];
        newItems[index][field] = parseFloat(value) || 0;
        newItems[index].subtotal = newItems[index].quantity * newItems[index].unit_cost;
        setData('items', newItems);
    };

    const addItem = () => setData('items', [...data.items, { product_id: '', quantity: 1, unit_cost: 0, subtotal: 0 }]);
    const removeItem = (index) => setData('items', data.items.filter((_, i) => i !== index));

    const grandTotal = data.items.reduce((acc, curr) => acc + curr.subtotal, 0);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('purchase-orders.store'));
    };

    return (
        <AuthenticatedLayout 
            user={auth.user} 
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Buat Purchase Order Baru</h2>}
        >
            <Head title="Buat PO" />
            <div className="py-12">
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">
                    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow border space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            
                            {/* Dropdown Supplier Dinamis */}
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Pilih Supplier</label>
                                <select
                                    className="w-full rounded border-gray-300 text-sm focus:ring-blue-500 focus:border-blue-500"
                                    value={data.supplier_id}
                                    onChange={(e) => setData('supplier_id', e.target.value)}
                                    required
                                >
                                    <option value="">-- Pilih Supplier --</option>
                                    {suppliers && suppliers.map(s => (
                                        <option key={s.id} value={s.id}>
                                            {s.code} - {s.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.supplier_id && <p className="text-red-500 text-xs mt-1">{errors.supplier_id}</p>}
                            </div>

                            {/* Tanggal Transaksi */}
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Tanggal Transaksi</label>
                                <input
                                    type="date"
                                    className="w-full rounded border-gray-300 text-sm focus:ring-blue-500 focus:border-blue-500"
                                    value={data.order_date}
                                    onChange={(e) => setData('order_date', e.target.value)}
                                    required
                                />
                                {errors.order_date && <p className="text-red-500 text-xs mt-1">{errors.order_date}</p>}
                            </div>
                        </div>

                        <div className="border-t pt-4">
                            <div className="flex justify-between items-center mb-3">
                                <h4 className="font-bold text-gray-800">Daftar Barang Masuk</h4>
                                <button
                                    type="button"
                                    onClick={addItem}
                                    style={{ backgroundColor: '#059669', color: '#ffffff' }}
                                    className="px-3 py-1.5 rounded text-xs font-bold shadow hover:opacity-90 cursor-pointer"
                                >
                                    + Tambah Item
                                </button>
                            </div>

                            {data.items.map((item, index) => (
                                <div key={index} className="grid grid-cols-12 gap-2 items-center mb-3 bg-gray-50 p-3 rounded border">
                                    <div className="col-span-4">
                                        <select
                                            className="w-full text-xs rounded border-gray-300"
                                            value={item.product_id}
                                            onChange={(e) => handleProductChange(index, e.target.value)}
                                            required
                                        >
                                            <option value="">-- Pilih Produk --</option>
                                            {products.map(p => <option key={p.id} value={p.id}>{p.name} (Stok: {p.stock})</option>)}
                                        </select>
                                    </div>
                                    <div className="col-span-2">
                                        <input
                                            type="number"
                                            min="1"
                                            className="w-full text-xs rounded border-gray-300 text-center"
                                            value={item.quantity}
                                            onChange={(e) => handleQtyCostChange(index, 'quantity', e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="col-span-3">
                                        <input
                                            type="number"
                                            min="0"
                                            className="w-full text-xs rounded border-gray-300 text-right"
                                            value={item.unit_cost}
                                            onChange={(e) => handleQtyCostChange(index, 'unit_cost', e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="col-span-2 text-right font-bold text-sm text-gray-800">
                                        {formatRupiah(item.subtotal)}
                                    </div>
                                    <div className="col-span-1 text-center">
                                        {data.items.length > 1 && (
                                            <button type="button" onClick={() => removeItem(index)} className="text-red-600 font-bold">✕</button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-between items-center border-t pt-4">
                            <div className="text-xl font-black text-gray-900">
                                Total PO: <span className="text-emerald-600">{formatRupiah(grandTotal)}</span>
                            </div>
                            <div className="flex gap-3">
                                <Link href={route('purchase-orders.index')} className="px-4 py-2 border rounded text-sm font-bold text-gray-700 bg-white">Batal</Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    style={{ backgroundColor: '#4f46e5', color: '#ffffff' }}
                                    className="px-6 py-2 font-bold text-sm rounded shadow hover:opacity-90 cursor-pointer"
                                >
                                    {processing ? 'Menyimpan...' : 'Simpan Purchase Order'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}