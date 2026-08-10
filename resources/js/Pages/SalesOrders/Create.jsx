import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Create({ auth, customers, products }) {
    const { data, setData, post, processing, errors } = useForm({
        customer_id: '',
        order_date: new Date().toISOString().split('T')[0],
        items: [
            { product_id: '', quantity: 1, unit_price: 0, subtotal: 0, available_stock: 0 }
        ]
    });

    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(number);
    };

    const handleProductChange = (index, productId) => {
        const selectedProduct = products.find(p => p.id === parseInt(productId));
        const updatedItems = [...data.items];

        if (selectedProduct) {
            const price = parseFloat(selectedProduct.sell_price || 0);

            updatedItems[index].product_id = selectedProduct.id;
            updatedItems[index].unit_price = price;
            updatedItems[index].available_stock = selectedProduct.stock;
            updatedItems[index].subtotal = updatedItems[index].quantity * price;
        } else {
            updatedItems[index].product_id = '';
            updatedItems[index].unit_price = 0;
            updatedItems[index].available_stock = 0;
            updatedItems[index].subtotal = 0;
        }

        setData('items', updatedItems);
    };

    const handleQuantityChange = (index, qty) => {
        const updatedItems = [...data.items];
        const quantity = parseInt(qty) || 0;
        
        updatedItems[index].quantity = quantity;
        updatedItems[index].subtotal = quantity * updatedItems[index].unit_price;

        setData('items', updatedItems);
    };

    const addItem = () => {
        setData('items', [
            ...data.items,
            { product_id: '', quantity: 1, unit_price: 0, subtotal: 0, available_stock: 0 }
        ]);
    };

    const removeItem = (index) => {
        if (data.items.length > 1) {
            const updatedItems = data.items.filter((_, i) => i !== index);
            setData('items', updatedItems);
        }
    };

    const calculateGrandTotal = () => {
        return data.items.reduce((sum, item) => sum + (item.subtotal || 0), 0);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('sales-orders.store'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Buat Sales Order Baru</h2>}
        >
            <Head title="Buat Sales Order" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <form onSubmit={handleSubmit}>
                            
                            {/* Header Transaksi */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Pelanggan / Toko</label>
                                    <select
                                        required
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                                        value={data.customer_id}
                                        // Diubah menggunakan parseInt agar tipe data ID aman (integer)
                                        onChange={(e) => setData('customer_id', e.target.value ? parseInt(e.target.value) : '')}
                                    >
                                        <option value="">-- Pilih Pelanggan --</option>
                                        {customers.map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {c.name} {c.phone ? `(${c.phone})` : ''}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.customer_id && <div className="text-red-500 text-xs mt-1">{errors.customer_id}</div>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Transaksi</label>
                                    <input
                                        type="date"
                                        required
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                                        value={data.order_date}
                                        onChange={(e) => setData('order_date', e.target.value)}
                                    />
                                    {errors.order_date && <div className="text-red-500 text-xs mt-1">{errors.order_date}</div>}
                                </div>
                            </div>

                            <hr className="my-6" />

                            {/* Item Barang */}
                            <div className="mb-4 flex justify-between items-center">
                                <h4 className="font-bold text-gray-700">Daftar Barang</h4>
                                <button
                                    type="button"
                                    onClick={addItem}
                                    style={{ backgroundColor: '#059669', color: '#ffffff' }}
                                    className="px-3 py-1.5 rounded text-xs font-bold shadow hover:opacity-95 transition cursor-pointer"
                                >
                                    + Tambah Barang
                                </button>
                            </div>

                            <div className="space-y-4 mb-6">
                                {data.items.map((item, index) => (
                                    <div key={index} className="flex flex-col md:flex-row gap-4 items-end bg-gray-50 p-4 rounded-lg border">
                                        
                                        {/* Pilih Produk */}
                                        <div className="flex-1">
                                            <label className="block text-xs font-medium text-gray-600 mb-1">Pilih Produk</label>
                                            <select
                                                required
                                                className="w-full rounded-md border-gray-300 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                value={item.product_id}
                                                onChange={(e) => handleProductChange(index, e.target.value)}
                                            >
                                                <option value="">-- Pilih Produk --</option>
                                                {products.map((p) => (
                                                    <option key={p.id} value={p.id}>
                                                        {p.name} (Stok: {p.stock})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Quantity */}
                                        <div className="w-full md:w-28">
                                            <label className="block text-xs font-medium text-gray-600 mb-1">Jumlah (Qty)</label>
                                            <input
                                                type="number"
                                                min="1"
                                                max={item.available_stock || 9999}
                                                required
                                                className="w-full rounded-md border-gray-300 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                value={item.quantity}
                                                onChange={(e) => handleQuantityChange(index, e.target.value)}
                                            />
                                        </div>

                                        {/* Harga Satuan */}
                                        <div className="w-full md:w-36">
                                            <label className="block text-xs font-medium text-gray-600 mb-1">Harga Satuan</label>
                                            <input
                                                type="text"
                                                disabled
                                                className="w-full rounded-md border-gray-200 bg-gray-100 text-sm font-semibold text-gray-600"
                                                value={formatRupiah(item.unit_price)}
                                            />
                                        </div>

                                        {/* Subtotal */}
                                        <div className="w-full md:w-40">
                                            <label className="block text-xs font-medium text-gray-600 mb-1">Subtotal</label>
                                            <input
                                                type="text"
                                                disabled
                                                className="w-full rounded-md border-gray-200 bg-gray-100 text-sm font-bold text-gray-800"
                                                value={formatRupiah(item.subtotal)}
                                            />
                                        </div>

                                        {/* Tombol Hapus Baris */}
                                        {data.items.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeItem(index)}
                                                className="px-3 py-2 bg-red-600 text-white rounded text-xs font-bold hover:bg-red-700 transition"
                                            >
                                                Hapus
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Total Akhir */}
                            <div className="flex justify-between items-center bg-indigo-50 p-4 rounded-lg mb-6">
                                <span className="font-bold text-indigo-900 text-lg">Total Keseluruhan:</span>
                                <span className="font-extrabold text-indigo-900 text-2xl">{formatRupiah(calculateGrandTotal())}</span>
                            </div>

                            {/* Tombol Aksi */}
                            <div className="flex justify-end gap-3 mt-6">
                                <Link
                                    href={route('sales-orders.index')}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 transition"
                                >
                                    Batal
                                </Link>
                                
                                <button
                                    type="submit"
                                    disabled={processing}
                                    style={{ backgroundColor: '#4f46e5', color: '#ffffff' }}
                                    className="px-6 py-2 font-bold text-sm rounded-md shadow hover:opacity-90 transition cursor-pointer"
                                >
                                    {processing ? 'Menyimpan...' : 'Simpan Transaksi'}
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}