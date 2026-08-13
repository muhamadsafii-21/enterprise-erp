import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Show({ purchaseReturn }) {
    return (
        <AuthenticatedLayout>
            <Head title={`Detail Retur - ${purchaseReturn.return_number}`} />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    
                    {/* Header & Tombol Kembali */}
                    <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow-sm">
                        <div>
                            <h2 className="text-xl font-semibold leading-tight text-gray-800">
                                Detail Retur Pembelian: <span className="text-indigo-600">{purchaseReturn.return_number}</span>
                            </h2>
                            <p className="text-sm text-gray-500 mt-1">
                                Informasi lengkap pengembalian barang ke supplier.
                            </p>
                        </div>

                        <Link
                            href={route('purchase-returns.index')}
                            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-300 transition"
                        >
                            &larr; Kembali
                        </Link>
                    </div>

                    {/* Informasi Utama */}
                    <div className="bg-white p-6 rounded-lg shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider block">Supplier</span>
                            <span className="text-base font-semibold text-gray-800 mt-1 block">
                                {purchaseReturn.supplier?.name || '-'}
                            </span>
                        </div>

                        <div>
                            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider block">No. Purchase Order (PO) Asal</span>
                            <span className="text-base font-semibold text-indigo-600 mt-1 block">
                                {purchaseReturn.purchase_order?.po_number || '-'}
                            </span>
                        </div>

                        <div>
                            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider block">Tanggal Retur</span>
                            <span className="text-base font-medium text-gray-800 mt-1 block">
                                {purchaseReturn.return_date}
                            </span>
                        </div>

                        <div>
                            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider block">Status</span>
                            <span className="mt-1 inline-flex px-2.5 py-1 text-xs font-semibold rounded-full bg-rose-100 text-rose-800">
                                {purchaseReturn.status}
                            </span>
                        </div>

                        <div className="md:col-span-2">
                            <span className="text-xs font-medium text-gray-400 uppercase tracking-wider block">Alasan Retur</span>
                            <span className="text-base text-gray-700 mt-1 block bg-gray-50 p-3 rounded-md border border-gray-100">
                                {purchaseReturn.reason || 'Tidak ada alasan yang dicatat.'}
                            </span>
                        </div>
                    </div>

                    {/* Tabel Item Barang yang Diretur */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h3 className="text-md font-medium text-gray-800 mb-4">Daftar Barang yang Dikembalikan</h3>

                            <table className="min-w-full divide-y divide-gray-200 border">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">No</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Produk</th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Jumlah (Qty)</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Harga Satuan</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {purchaseReturn.items && purchaseReturn.items.length > 0 ? (
                                        purchaseReturn.items.map((item, index) => {
                                            const subtotal = item.quantity * item.unit_price;
                                            return (
                                                <tr key={item.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {index + 1}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {item.product?.name || 'Produk Dihapus'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-semibold text-gray-800">
                                                        {item.quantity}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-600">
                                                        Rp {Number(item.unit_price).toLocaleString('id-ID')}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold text-gray-900">
                                                        Rp {Number(subtotal).toLocaleString('id-ID')}
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-6 text-center text-sm text-gray-400">
                                                Tidak ada item barang dalam retur ini.
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