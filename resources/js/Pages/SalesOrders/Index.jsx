import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import PrimaryButton from '@/Components/PrimaryButton';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Index({ auth, salesOrders }) {
    const { flash } = usePage().props;

    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(number);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Sales Orders (Penjualan)</h2>}
        >
            <Head title="Sales Orders" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    
                    {flash?.message && (
                        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                            {flash.message}
                        </div>
                    )}

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-gray-700">Daftar Penjualan</h3>
                            <Link href={route('sales-orders.create')}>
                                <PrimaryButton>
                                    + Transaksi Penjualan Baru
                                </PrimaryButton>
                            </Link>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-500">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                                    <tr>
                                        <th className="px-6 py-3">No. Order</th>
                                        <th className="px-6 py-3">Tanggal</th>
                                        <th className="px-6 py-3">Pelanggan</th>
                                        <th className="px-6 py-3">Total Amount</th>
                                        <th className="px-6 py-3">Status</th>
                                        <th className="px-6 py-3 text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {salesOrders.data.length > 0 ? (
                                        salesOrders.data.map((order) => (
                                            <tr key={order.id} className="bg-white border-b hover:bg-gray-50">
                                                <td className="px-6 py-4 font-bold text-indigo-600">
                                                    {order.order_number}
                                                </td>
                                                <td className="px-6 py-4">{order.order_date}</td>
                                                
                                                {/* Diperbaiki menggunakan relasi order.customer.name */}
                                                <td className="px-6 py-4 font-medium text-gray-900">
                                                    {order.customer ? order.customer.name : '-'}
                                                </td>

                                                <td className="px-6 py-4 font-semibold text-gray-900">
                                                    {formatRupiah(order.total_amount)}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <Link
                                                        href={route('sales-orders.show', order.id)}
                                                        className="text-indigo-600 hover:text-indigo-900 font-medium"
                                                    >
                                                        Detail
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-4 text-center text-gray-400">
                                                Belum ada transaksi penjualan.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {salesOrders.links && (
                            <div className="mt-4 flex justify-end gap-1">
                                {salesOrders.links.map((link, key) => (
                                    <Link
                                        key={key}
                                        href={link.url || '#'}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`px-3 py-1 border rounded text-xs ${
                                            link.active ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700'
                                        } ${!link.url && 'opacity-50 cursor-not-allowed'}`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}