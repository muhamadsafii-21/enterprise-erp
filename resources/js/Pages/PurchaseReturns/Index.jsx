import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ purchaseReturns, filters }) {
    const { flash } = usePage().props;
    const [search, setSearch] = useState(filters?.search || '');

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearch(value);
        router.get(
            route('purchase-returns.index'),
            { search: value },
            { preserveState: true, replace: true }
        );
    };

    return (
        <AuthenticatedLayout>
            <Head title="Purchase Returns" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    
                    {/* Header Halaman, Input Search, & Tombol Aksi */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-lg shadow-sm">
                        <div>
                            <h2 className="text-xl font-semibold leading-tight text-gray-800">
                                Purchase Returns (Retur Pembelian)
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Kelola pengembalian barang rusak atau tidak sesuai ke supplier.
                            </p>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                            <input
                                type="text"
                                placeholder="Cari No. Retur / Supplier..."
                                value={search}
                                onChange={handleSearch}
                                className="border-gray-300 rounded-lg text-sm focus:border-indigo-500 focus:ring-indigo-500 w-full sm:w-64"
                            />

                            <Link
                                href={route('purchase-returns.create')}
                                className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition shadow-sm flex items-center gap-2 whitespace-nowrap w-full sm:w-auto justify-center"
                            >
                                <span>+ Buat Retur Baru</span>
                            </Link>
                        </div>
                    </div>

                    {flash?.success && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg relative shadow-sm">
                            {flash.success}
                        </div>
                    )}

                    {/* Tabel Data */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No. Retur</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supplier</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Retur</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alasan</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {purchaseReturns.data.length > 0 ? (
                                        purchaseReturns.data.map((item) => (
                                            <tr key={item.id} className="hover:bg-gray-50 transition">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-indigo-600">
                                                    {item.return_number}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                                    {item.supplier?.name || '-'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {item.return_date}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500 truncate max-w-xs">
                                                    {item.reason || '-'}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="px-2.5 py-1 inline-flex text-xs leading-4 font-semibold rounded-full bg-rose-100 text-rose-800">
                                                        {item.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <Link
                                                        href={route('purchase-returns.show', item.id)}
                                                        className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 px-3 py-1.5 rounded-md transition"
                                                    >
                                                        Detail
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-10 text-center text-sm text-gray-500">
                                                Belum ada data retur pembelian.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>

                            {/* Pagination Links - Posisi pojok kanan bawah */}
                            {purchaseReturns.links && purchaseReturns.links.length > 3 && (
                                <div className="flex justify-end mt-6">
                                    <div className="flex flex-wrap gap-1">
                                        {purchaseReturns.links.map((link, index) => (
                                            <Link
                                                key={index}
                                                href={link.url || '#'}
                                                className={`px-3 py-1 text-xs rounded border transition ${
                                                    link.active
                                                        ? 'bg-indigo-600 text-white border-indigo-600 font-bold'
                                                        : link.url
                                                        ? 'bg-white text-gray-700 hover:bg-gray-100 border-gray-300'
                                                        : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                                                }`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}