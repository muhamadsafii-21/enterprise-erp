import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Show({ deliveryOrder }) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Detail Surat Jalan: {deliveryOrder.do_number}
                    </h2>
                    <Link
                        href={route('delivery-orders.index')}
                        className="bg-gray-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-600 transition"
                    >
                        Kembali
                    </Link>
                </div>
            }
        >
            <Head title={`DO - ${deliveryOrder.do_number}`} />

            <div className="py-6">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    
                    {/* Informasi Utama */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-800 border-b pb-3 mb-4">Informasi Pengiriman</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-gray-500 block">No. Surat Jalan:</span>
                                <span className="font-semibold text-gray-900">{deliveryOrder.do_number}</span>
                            </div>
                            <div>
                                <span className="text-gray-500 block">No. Sales Order (SO):</span>
                                <span className="font-semibold text-indigo-600">{deliveryOrder.sales_order?.order_number}</span>
                            </div>
                            <div>
                                <span className="text-gray-500 block">Customer:</span>
                                <span className="font-semibold text-gray-900">{deliveryOrder.sales_order?.customer?.name}</span>
                            </div>
                            <div>
                                <span className="text-gray-500 block">Tanggal Pengiriman:</span>
                                <span className="font-semibold text-gray-900">{deliveryOrder.delivery_date}</span>
                            </div>
                            <div>
                                <span className="text-gray-500 block">Driver / Kendaraan:</span>
                                <span className="font-semibold text-gray-900">{deliveryOrder.driver_name || '-'} ({deliveryOrder.vehicle_number || '-'})</span>
                            </div>
                            <div>
                                <span className="text-gray-500 block">Status:</span>
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                    {deliveryOrder.status}
                                </span>
                            </div>
                            <div className="col-span-2">
                                <span className="text-gray-500 block">Alamat Pengiriman:</span>
                                <span className="font-semibold text-gray-900">{deliveryOrder.shipping_address || '-'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Tabel Item Barang */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-gray-800 border-b pb-3 mb-4">Daftar Barang Dikirim</h3>
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">No</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Produk</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jumlah Dikirim (Qty)</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {deliveryOrder.items.map((item, index) => (
                                    <tr key={item.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.product?.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{item.quantity_shipped}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}