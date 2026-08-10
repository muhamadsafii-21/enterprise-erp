import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Index({ auth, goodsReceipts }) {
    const { flash } = usePage().props;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Penerimaan Barang (Goods Receipt)</h2>}
        >
            <Head title="Goods Receipts" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        
                        {/* Header dengan Tombol Tambah GR */}
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Daftar Goods Receipt</h3>
                                <p className="text-sm text-gray-500">Catatan penerimaan fisik barang masuk di gudang</p>
                            </div>
                            <Link
                                href={route('goods-receipts.create')}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm px-4 py-2 rounded-md transition shadow-sm"
                            >
                                + Buat Goods Receipt Baru
                            </Link>
                        </div>

                        {/* Flash Message Jika Ada */}
                        {flash?.success && (
                            <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative text-sm">
                                {flash.success}
                            </div>
                        )}

                        {/* Tabel Goods Receipt */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-500">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                                    <tr>
                                        <th className="px-6 py-3">No. GR</th>
                                        <th className="px-6 py-3">Ref. PO</th>
                                        <th className="px-6 py-3">Supplier</th>
                                        <th className="px-6 py-3">Tanggal Diterima</th>
                                        <th className="px-6 py-3">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {goodsReceipts && goodsReceipts.length > 0 ? (
                                        goodsReceipts.map((gr) => (
                                            <tr key={gr.id} className="bg-white border-b hover:bg-gray-50">
                                                <td className="px-6 py-4 font-bold text-gray-900">
                                                    {gr.gr_number}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {gr.purchase_order?.po_number || '-'}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {gr.supplier?.name || '-'}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {gr.received_date}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 capitalize">
                                                        {gr.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-4 text-center text-gray-500 italic">
                                                Belum ada data penerimaan barang.
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