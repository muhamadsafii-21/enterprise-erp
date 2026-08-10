import React from 'react';
import { useForm, usePage, Link } from '@inertiajs/react';

export default function Create() {
    const { purchaseOrders } = usePage().props;

    // Inisialisasi state form menggunakan useForm Inertia
    const { data, setData, post, processing, errors } = useForm({
        purchase_order_id: '',
        supplier_id: '',
        received_date: new Date().toISOString().split('T')[0], // Default tanggal hari ini
        items: [],
    });

    // Handler ketika user memilih nomor PO dari dropdown
    const handlePoChange = (e) => {
        const selectedPoId = e.target.value;
        setData('purchase_order_id', selectedPoId);

        if (!selectedPoId) {
            setData({
                ...data,
                purchase_order_id: '',
                supplier_id: '',
                items: [],
            });
            return;
        }

        // Cari data PO yang dipilih dari list purchaseOrders yang dikirim controller
        const selectedPo = purchaseOrders.find((po) => po.id == selectedPoId);

        if (selectedPo) {
            setData({
                ...data,
                purchase_order_id: selectedPo.id,
                supplier_id: selectedPo.supplier_id ? selectedPo.supplier_id : '',
                // Ambil item dari PO untuk dimasukkan ke form penerimaan barang
                items: selectedPo.items.map((item) => ({
                    product_id: item.product_id,
                    product_name: item.product ? item.product.name : 'Produk',
                    quantity: item.quantity, // Default qty sesuai pesanan PO, bisa diubah jika fisik yang datang berbeda
                })),
            });
        }
    };

    // Handler untuk submit form GR
    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('goods-receipts.store'));
    };

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Form Goods Receipt (Penerimaan Barang) Baru</h1>
                <Link
                    href={route('goods-receipts.index')}
                    className="text-sm bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
                >
                    ← Kembali
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 space-y-6">
                {/* Baris 1: Pilih PO & Tanggal Diterima */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Dropdown Pilih PO */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Nomor PO (Ordered)</label>
                        <select
                            value={data.purchase_order_id}
                            onChange={handlePoChange}
                            className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        >
                            <option value="">-- Pilih Nomor PO --</option>
                            {purchaseOrders.map((po) => (
                                <option key={po.id} value={po.id}>
                                    {po.po_number} - ({po.supplier ? po.supplier.name : 'Supplier'})
                                </option>
                            ))}
                        </select>
                        {errors.purchase_order_id && <span className="text-red-500 text-xs mt-1 block">{errors.purchase_order_id}</span>}
                    </div>

                    {/* Tanggal Diterima */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Diterima</label>
                        <input
                            type="date"
                            value={data.received_date}
                            onChange={(e) => setData('received_date', e.target.value)}
                            className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                        {errors.received_date && <span className="text-red-500 text-xs mt-1 block">{errors.received_date}</span>}
                    </div>
                </div>

                {/* Hidden input untuk menyimpan supplier_id secara otomatis */}
                <input type="hidden" value={data.supplier_id} />

                {/* Detail Item Barang dari PO */}
                <div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Detail Item Barang (Ditarik dari PO)</h3>
                    <div className="border rounded-lg overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Barang</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qty Diterima (Fisik)</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {data.items.length > 0 ? (
                                    data.items.map((item, index) => (
                                        <tr key={index}>
                                            <td className="px-6 py-4 text-sm text-gray-800">{item.product_name}</td>
                                            <td className="px-6 py-4 text-sm text-gray-800">
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={item.quantity}
                                                    onChange={(e) => {
                                                        const newItems = [...data.items];
                                                        newItems[index].quantity = e.target.value;
                                                        setData('items', newItems);
                                                    }}
                                                    className="w-32 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                />
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="2" className="px-6 py-8 text-center text-sm text-gray-500 italic">
                                            Pilih Goods Receipt / Purchase Order di atas untuk memuat item barang.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {errors.items && <span className="text-red-500 text-xs mt-1 block">{errors.items}</span>}
                </div>

                {/* Tombol Simpan */}
                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={processing || data.items.length === 0}
                        className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition disabled:opacity-50 font-medium"
                    >
                        {processing ? 'Menyimpan...' : 'Simpan Goods Receipt'}
                    </button>
                </div>
            </form>
        </div>
    );
}