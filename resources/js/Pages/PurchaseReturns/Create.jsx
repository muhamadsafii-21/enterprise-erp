import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Create({ suppliers, defaultReturnNumber }) {
    const { data, setData, post, processing, errors } = useForm({
        return_number: defaultReturnNumber,
        supplier_id: '',
        purchase_order_id: '',
        return_date: new Date().toISOString().slice(0, 10),
        reason: '',
        items: []
    });

    const [availablePOs, setAvailablePOs] = useState([]);

    const handleSupplierChange = (e) => {
        const supplierId = e.target.value;
        setData('supplier_id', supplierId);
        setData('purchase_order_id', '');
        setData('items', []);

        if (supplierId) {
            const selectedSupplier = suppliers.find(s => s.id == supplierId);
            setAvailablePOs(selectedSupplier?.purchase_orders || []);
        } else {
            setAvailablePOs([]);
        }
    };

    const handlePOChange = (e) => {
        const poId = e.target.value;
        setData('purchase_order_id', poId);

        if (poId) {
            const selectedPO = availablePOs.find(po => po.id == poId);
            if (selectedPO && selectedPO.items) {
                const poItems = selectedPO.items.map(item => ({
                    product_id: item.product_id,
                    product_name: item.product?.name || 'Produk',
                    quantity: item.quantity,
                    max_quantity: item.quantity,
                    // Sesuaikan 'price' atau 'unit_price' dengan kolom di tabel purchase_order_items kamu
                    unit_price: item.unit_price || item.unit_cost || 0 
                }));
                setData('items', poItems);
            }
        } else {
            setData('items', []);
        }
    };

    const updateItemQuantity = (index, qty) => {
        const updated = [...data.items];
        updated[index].quantity = qty;
        setData('items', updated);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('purchase-returns.store'));
    };

    return (
        <AuthenticatedLayout>
            <Head title="Buat Retur Pembelian" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Form Retur Pembelian (Berbasis PO)</h2>

                        <form onSubmit={submit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Nomor Retur (Read-only / Terkunci) */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">No. Retur (Otomatis)</label>
                                    <input
                                        type="text"
                                        value={data.return_number}
                                        disabled
                                        className="mt-1 block w-full bg-gray-100 border-gray-300 rounded-md shadow-sm text-sm text-gray-500 cursor-not-allowed"
                                    />
                                </div>

                                {/* Pilih Supplier */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Supplier *</label>
                                    <select
                                        value={data.supplier_id}
                                        onChange={handleSupplierChange}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm text-sm"
                                    >
                                        <option value="">Pilih Supplier</option>
                                        {suppliers.map(sup => (
                                            <option key={sup.id} value={sup.id}>{sup.name}</option>
                                        ))}
                                    </select>
                                    {errors.supplier_id && <div className="text-red-500 text-xs mt-1">{errors.supplier_id}</div>}
                                </div>

                                {/* Pilih Purchase Order (PO) menggunakan po_number & order_date */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">No. Purchase Order (PO) Asal *</label>
                                    <select
                                        value={data.purchase_order_id}
                                        onChange={handlePOChange}
                                        disabled={!data.supplier_id}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm text-sm disabled:bg-gray-100"
                                    >
                                        <option value="">Pilih No. PO</option>
                                        {availablePOs.map(po => (
                                            <option key={po.id} value={po.id}>
                                                {po.po_number} ({po.order_date})
                                            </option>
                                        ))}
                                    </select>
                                    {errors.purchase_order_id && <div className="text-red-500 text-xs mt-1">{errors.purchase_order_id}</div>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Tanggal Retur *</label>
                                    <input
                                        type="date"
                                        value={data.return_date}
                                        onChange={e => setData('return_date', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm text-sm"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">Alasan Retur</label>
                                    <input
                                        type="text"
                                        placeholder="Misal: Barang cacat / tidak sesuai spesifikasi PO"
                                        value={data.reason}
                                        onChange={e => setData('reason', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm text-sm"
                                    />
                                </div>
                            </div>

                            {/* Tabel Barang Otomatis dari PO */}
                            <div>
                                <h3 className="text-md font-medium text-gray-700 mb-2">Daftar Barang dari PO yang Diretur</h3>

                                <table className="min-w-full divide-y divide-gray-200 border">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Nama Produk</th>
                                            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 w-40">Jumlah Retur (Qty)</th>
                                            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 w-40">Harga Satuan</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {data.items.length > 0 ? (
                                            data.items.map((item, index) => (
                                                <tr key={index}>
                                                    <td className="px-4 py-2 text-sm text-gray-800 font-medium">
                                                        {item.product_name}
                                                    </td>
                                                    <td className="px-4 py-2 text-center">
                                                        <input
                                                            type="number"
                                                            min="1"
                                                            max={item.max_quantity}
                                                            value={item.quantity}
                                                            onChange={e => updateItemQuantity(index, e.target.value)}
                                                            className="w-24 text-center border-gray-300 rounded-md text-sm"
                                                        />
                                                        <span className="text-[10px] text-gray-400 block mt-0.5">Maks: {item.max_quantity}</span>
                                                    </td>
                                                    <td className="px-4 py-2 text-right text-sm text-gray-600">
                                                        Rp {Number(item.unit_price).toLocaleString('id-ID')}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="3" className="px-4 py-6 text-center text-sm text-gray-400">
                                                    Silakan pilih Supplier dan No. PO terlebih dahulu untuk menampilkan barang.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <div className="flex justify-end gap-3">
                                <Link
                                    href={route('purchase-returns.index')}
                                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-300 transition"
                                >
                                    Batal
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing || data.items.length === 0}
                                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition shadow-sm disabled:opacity-50"
                                >
                                    Simpan Retur Pembelian
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}