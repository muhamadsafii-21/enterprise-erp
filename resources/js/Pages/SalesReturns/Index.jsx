import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ salesReturns, filters }) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('sales-returns.index'), { search }, { preserveState: true });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Daftar Retur Penjualan" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow-sm">
                        <h2 className="text-xl font-semibold text-gray-800">Retur Penjualan (Sales Return)</h2>
                        <Link
                            href={route('sales-returns.create')}
                            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
                        >
                            + Buat Retur Penjualan
                        </Link>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <form onSubmit={handleSearch} className="mb-4 flex gap-2">
                            <input
                                type="text"
                                placeholder="Cari No. Retur atau Customer..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="border-gray-300 rounded-md text-sm w-72"
                            />
                            <button type="submit" className="bg-gray-800 text-white px-4 py-2 rounded-md text-sm">
                                Cari
                            </button>
                        </form>

                        <table className="min-w-full divide-y divide-gray-200 border">
                            <thead className="bg-gray-50">
                                {/* Header tabel */}
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">No. Retur</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
                                    <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {salesReturns.data.length > 0 ? (
                                    salesReturns.data.map((sr) => (
                                        <tr key={sr.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm font-medium text-indigo-600">{sr.return_number}</td>
                                            <td className="px-4 py-3 text-sm text-gray-800">{sr.customer?.name}</td>
                                            <td className="px-4 py-3 text-sm text-gray-600">{sr.return_date}</td>
                                            <td className="px-4 py-3 text-center">
                                                <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 font-semibold">
                                                    {sr.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right text-sm">
                                                <Link
                                                    href={route('sales-returns.show', sr.id)}
                                                    className="text-indigo-600 hover:text-indigo-900 font-medium"
                                                >
                                                    Detail
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="px-4 py-6 text-center text-sm text-gray-400">
                                            Belum ada data retur penjualan.
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