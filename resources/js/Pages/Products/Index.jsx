import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({ auth, products }) {
    const formatRupiah = (num) => 
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num || 0);

    const handleDelete = (id, name) => {
        if (confirm(`Apakah Anda yakin ingin menghapus produk "${name}"?`)) {
            router.delete(route('products.destroy', id));
        }
    };

    // Mengambil array item dari object pagination
    const productList = products?.data || (Array.isArray(products) ? products : []);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Manajemen Produk & Stok</h2>}
        >
            <Head title="Daftar Produk" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        
                        {/* Header & Tombol Tambah */}
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="font-bold text-gray-800 text-lg">Daftar Produk</h3>
                                <p className="text-xs text-gray-500">Kelola katalog produk, harga, dan ketersediaan stok</p>
                            </div>
                            <Link
                                href={route('products.create')}
                                style={{ backgroundColor: '#4f46e5', color: '#ffffff' }}
                                className="px-4 py-2 font-bold text-sm rounded-md shadow hover:opacity-90 transition cursor-pointer"
                            >
                                + Tambah Produk Baru
                            </Link>
                        </div>

                        {/* Tabel Produk */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-500">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-100 border-b">
                                    <tr>
                                        <th className="px-4 py-3">Nama Produk / SKU</th>
                                        <th className="px-4 py-3 text-right">Harga Beli</th>
                                        <th className="px-4 py-3 text-right">Harga Jual</th>
                                        <th className="px-4 py-3 text-center">Stok</th>
                                        <th className="px-4 py-3 text-center">Min. Stok</th>
                                        <th className="px-4 py-3 text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {productList.length > 0 ? (
                                        productList.map((product) => (
                                            <tr key={product.id} className="border-b hover:bg-gray-50 transition">
                                                <td className="px-4 py-3">
                                                    <div className="font-bold text-gray-800">{product.name}</div>
                                                    <div className="text-xs font-mono text-gray-400">{product.sku || '-'}</div>
                                                </td>
                                                <td className="px-4 py-3 text-right font-medium text-gray-600">
                                                    {formatRupiah(product.buy_price)}
                                                </td>
                                                <td className="px-4 py-3 text-right font-bold text-indigo-600">
                                                    {formatRupiah(product.sell_price)}
                                                </td>
                                                <td className="px-4 py-3 text-center font-extrabold">
                                                    <span className={`px-2.5 py-1 rounded-full text-xs ${
                                                        product.stock <= (product.min_stock || 10) 
                                                            ? 'bg-rose-100 text-rose-700' 
                                                            : 'bg-emerald-100 text-emerald-800'
                                                    }`}>
                                                        {product.stock}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-center text-xs font-semibold text-gray-500">
                                                    {product.min_stock || 10}
                                                </td>
                                                <td className="px-4 py-3 text-center space-x-2">
                                                    <Link
                                                        href={route('products.edit', product.id)}
                                                        className="text-amber-600 hover:underline font-bold text-xs"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(product.id, product.name)}
                                                        className="text-rose-600 hover:underline font-bold text-xs"
                                                    >
                                                        Hapus
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="text-center py-6 text-gray-400">
                                                Belum ada data produk. Klik "+ Tambah Produk Baru" untuk menambahkan!
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}