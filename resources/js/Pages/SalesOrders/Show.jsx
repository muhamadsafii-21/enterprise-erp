import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Show({ auth, salesOrder }) {
    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(number || 0);
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Detail Sales Order</h2>}
        >
            <Head title={`Sales Order ${salesOrder.order_number}`} />

            {/* CSS Khusus Cetak / Print Mode */}
            <style>
                {`
                    @media print {
                        body * {
                            visibility: hidden;
                        }
                        #printable-invoice, #printable-invoice * {
                            visibility: visible;
                        }
                        #printable-invoice {
                            position: absolute;
                            left: 0;
                            top: 0;
                            width: 100%;
                            padding: 20px;
                            box-shadow: none !important;
                            border: none !important;
                        }
                        .no-print {
                            display: none !important;
                        }
                    }
                `}
            </style>

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    
                    {/* Tombol Navigasi, Aksi Faktur & Print (Hidden saat dicetak) */}
                    <div className="mb-6 flex flex-wrap justify-between items-center gap-3 no-print">
                        <Link
                            href={route('sales-orders.index')}
                            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md text-sm font-semibold transition"
                        >
                            &larr; Kembali ke Daftar
                        </Link>

                        <div className="flex items-center gap-3">
                            {/* Tombol Buat Faktur yang dikunci ke ID Sales Order ini */}
                            <Link 
                                href={route('sales-invoices.create', salesOrder.id)} 
                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-sm font-semibold transition shadow-sm flex items-center gap-2"
                            >
                                📄 Buat Faktur Penjualan
                            </Link>

                            <button
                                onClick={handlePrint}
                                style={{ backgroundColor: '#1e293b', color: '#ffffff' }}
                                className="px-4 py-2 font-bold text-sm rounded-md shadow hover:opacity-90 transition cursor-pointer flex items-center gap-2"
                            >
                                🖨️ Cetak Sales Order
                            </button>
                        </div>
                    </div>

                    {/* Area Dokumen Sales Order */}
                    <div id="printable-invoice" className="bg-white overflow-hidden shadow-lg sm:rounded-lg p-8 border border-gray-200">
                        
                        {/* Header Perusahaan & SO */}
                        <div className="flex justify-between items-start border-b pb-6 mb-6">
                            <div>
                                <h1 className="text-2xl font-black tracking-wider text-indigo-700">ERP SYSTEM</h1>
                                <p className="text-xs text-gray-500 mt-1">Sales Order Resmi / Pesanan Penjualan</p>
                            </div>
                            <div className="text-right">
                                <h2 className="text-xl font-bold text-gray-800">{salesOrder.order_number}</h2>
                                <p className="text-xs text-gray-500 mt-1">Tanggal: <span className="font-semibold text-gray-700">{salesOrder.order_date}</span></p>
                                <span className="inline-block mt-2 px-3 py-1 text-xs font-bold text-green-800 bg-green-100 rounded-full uppercase">
                                    {salesOrder.status}
                                </span>
                            </div>
                        </div>

                        {/* Informasi Pelanggan */}
                        <div className="mb-8 bg-gray-50 p-4 rounded-lg border border-gray-100">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Diterbitkan Untuk Pelanggan:</p>
                            <p className="text-lg font-bold text-gray-800">
                                {salesOrder.customer ? salesOrder.customer.name : '-'}
                            </p>
                        </div>

                        {/* Tabel Rincian Produk */}
                        <div className="overflow-x-auto mb-6">
                            <table className="w-full text-sm text-left text-gray-600 border-collapse">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-100 border-b">
                                    <tr>
                                        <th className="px-4 py-3">#</th>
                                        <th className="px-4 py-3">Nama Produk</th>
                                        <th className="px-4 py-3 text-center">Qty</th>
                                        <th className="px-4 py-3 text-right">Harga Satuan</th>
                                        <th className="px-4 py-3 text-right">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {salesOrder.items && salesOrder.items.length > 0 ? (
                                        salesOrder.items.map((item, index) => (
                                            <tr key={item.id} className="border-b hover:bg-gray-50">
                                                <td className="px-4 py-3 text-gray-400 font-mono text-xs">{index + 1}</td>
                                                <td className="px-4 py-3 font-semibold text-gray-800">
                                                    {item.product?.name || 'Produk Dihapus'}
                                                </td>
                                                <td className="px-4 py-3 text-center font-bold">{item.quantity}</td>
                                                <td className="px-4 py-3 text-right">{formatRupiah(item.unit_price)}</td>
                                                <td className="px-4 py-3 text-right font-bold text-gray-900">
                                                    {formatRupiah(item.subtotal || (item.quantity * item.unit_price))}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="px-4 py-3 text-center text-gray-400">
                                                Tidak ada rincian item.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Ringkasan Total Pembayaran */}
                        <div className="flex justify-end mb-12">
                            <div className="w-full md:w-1/2 bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                                <div className="flex justify-between items-center text-indigo-950 font-black text-xl">
                                    <span>Total Pesanan:</span>
                                    <span>{formatRupiah(salesOrder.total_amount)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Tanda Tangan / Stempel */}
                        <div className="grid grid-cols-2 text-center text-xs text-gray-500 pt-8 border-t">
                            <div>
                                <p className="mb-12 font-medium">Hormat Kami,</p>
                                <p className="font-bold text-gray-800 underline">( Bagian Penjualan )</p>
                            </div>
                            <div>
                                <p className="mb-12 font-medium">Penerima,</p>
                                <p className="font-bold text-gray-800 underline">
                                    ( {salesOrder.customer ? salesOrder.customer.name : '-'} )
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}