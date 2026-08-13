import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ deliveryOrders, filters }) {
    const { flash } = usePage().props;
    
    // State untuk menampung nilai input pencarian
    const [search, setSearch] = useState(filters?.search || '');

    // Fungsi untuk menghandle pencarian saat diketik
    const handleSearch = (e) => {
        const value = e.target.value;
        setSearch(value);
        
        router.get(
            route('delivery-orders.index'),
            { search: value },
            { preserveState: true, replace: true }
        );
    };

    return (
        <AuthenticatedLayout>
            <Head title="Delivery Orders" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    
                    {/* Header Halaman, Input Search, & Tombol Aksi Sejajar Rapi */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-lg shadow-sm">
                        <div>
                            <h2 className="text-xl font-semibold leading-tight text-gray-800">
                                Delivery Orders (Surat Jalan)
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Kelola dokumen pengiriman barang keluar ke pelanggan.
                            </p>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                            {/* Input Search */}
                            <input
                                type="text"
                                placeholder="Cari No. DO / Customer..."
                                value={search}
                                onChange={handleSearch}
                                className="border-gray-300 rounded-lg text-sm focus:border-indigo-500 focus:ring-indigo-500 w-full sm:w-64"
                            />

                            <Link
                                href={route('delivery-orders.create')}
                                className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition shadow-sm flex items-center gap-2 whitespace-nowrap w-full sm:w-auto justify-center"
                            >
                                <span>+ Buat Surat Jalan Baru</span>
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
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No. DO</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No. Sales Order</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal Kirim</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver / Kendaraan</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {deliveryOrders.data.length > 0 ? (
                                        deliveryOrders.data.map((doItem) => (
                                            <tr key={doItem.id} className="hover:bg-gray-50 transition">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-indigo-600">
                                                    {doItem.do_number}
                                                </td>
                                                
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                    {doItem.sales_order?.order_number || '-'}
                                                </td>
                                                
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                                    {doItem.sales_order?.customer?.name || '-'}
                                                </td>

                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {doItem.delivery_date}
                                                </td>
                                                
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {doItem.driver_name || '-'} ({doItem.vehicle_number || '-'})
                                                </td>
                                                
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="px-2.5 py-1 inline-flex text-xs leading-4 font-semibold rounded-full bg-green-100 text-green-800">
                                                        {doItem.status}
                                                    </span>
                                                </td>
                                                
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <Link
                                                        href={route('delivery-orders.show', doItem.id)}
                                                        className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 px-3 py-1.5 rounded-md transition"
                                                    >
                                                        Detail
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="px-6 py-10 text-center text-sm text-gray-500">
                                                Data Surat Jalan tidak ditemukan.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>

                            {/* Pagination Links - Posisi pojok kanan bawah */}
                            {deliveryOrders.links && deliveryOrders.links.length > 3 && (
                                <div className="flex justify-end mt-6">
                                    <div className="flex flex-wrap gap-1">
                                        {deliveryOrders.links.map((link, index) => (
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