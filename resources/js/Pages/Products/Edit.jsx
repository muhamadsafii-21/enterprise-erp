import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';

export default function Edit({ auth, product }) {
    const { data, setData, put, processing, errors } = useForm({
        name: product.name || '',
        sku: product.sku || '',
        buy_price: product.buy_price || 0,
        sell_price: product.sell_price || 0,
        stock: product.stock || 0,
        min_stock: product.min_stock || 10,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('products.update', product.id));
    };

    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Edit Produk</h2>}>
            <Head title={`Edit ${product.name}`} />
            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow border space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Nama Produk</label>
                            <input
                                type="text"
                                className="w-full rounded border-gray-300 text-sm"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                required
                            />
                            {errors.name && <span className="text-red-500 text-xs">{errors.name}</span>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">SKU / Kode Barang</label>
                                <input
                                    type="text"
                                    className="w-full rounded border-gray-300 text-sm"
                                    value={data.sku}
                                    onChange={(e) => setData('sku', e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Batas Minimum Stok (Alert)</label>
                                <input
                                    type="number"
                                    className="w-full rounded border-gray-300 text-sm"
                                    value={data.min_stock}
                                    onChange={(e) => setData('min_stock', e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Harga Beli (Modal)</label>
                                <input
                                    type="number"
                                    className="w-full rounded border-gray-300 text-sm"
                                    value={data.buy_price}
                                    onChange={(e) => setData('buy_price', e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Harga Jual</label>
                                <input
                                    type="number"
                                    className="w-full rounded border-gray-300 text-sm"
                                    value={data.sell_price}
                                    onChange={(e) => setData('sell_price', e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Stok Fisik</label>
                                <input
                                    type="number"
                                    className="w-full rounded border-gray-300 text-sm"
                                    value={data.stock}
                                    onChange={(e) => setData('stock', e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 border-t pt-4">
                            <Link href={route('products.index')} className="px-4 py-2 border rounded text-sm font-bold text-gray-700 bg-white">Batal</Link>
                            <button
                                type="submit"
                                disabled={processing}
                                style={{ backgroundColor: '#4f46e5', color: '#ffffff' }}
                                className="px-6 py-2 font-bold text-sm rounded shadow hover:opacity-90"
                            >
                                {processing ? 'Memperbarui...' : 'Simpan Perubahan'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}