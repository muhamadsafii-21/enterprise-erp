import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Create({ customers, defaultReturnNumber }) {
    const { data, setData, post, processing, errors } = useForm({
        return_number: defaultReturnNumber,
        customer_id: '',
        sales_order_id: '',
        return_date: new Date().toISOString().slice(0, 10),
        reason: '',
        items: []
    });

    const [availableSOs, setAvailableSOs] = useState([]);

    const handleCustomerChange = (e) => {
        const customerId = e.target.value;
        setData('customer_id', customerId);
        setData('sales_order_id', '');
        setData('items', []);

        if (customerId) {
            const selectedCustomer = customers.find(c => c.id == customerId);
            setAvailableSOs(selectedCustomer?.sales_orders || []);
        } else {
            setAvailableSOs([]);
        }
    };

    const handleSOChange = (e) => {
        const soId = e.target.value;
        setData('sales_order_id', soId);

        if (soId) {
            const selectedSO = availableSOs.find(so => so.id == soId);
            if (selectedSO && selectedSO.items) {
                const soItems = selectedSO.items.map(item => ({
                    product_id: item.product_id,
                    product_name: item.product?.name || 'Produk',
                    quantity: item.quantity,
                    max_quantity: item.quantity,
                    unit_price: item.unit_price || item.price || 0
                }));
                setData('items', soItems);
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
        post(route('sales-returns.store'));
    };

    return (
        <AuthenticatedLayout>
            <Head title="Buat Retur Penjualan" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Form Retur Penjualan (Berbasis SO)</h2>

                        <form onSubmit={submit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">No. Retur</label>
                                    <input
                                        type="text"
                                        value={data.return_number}
                                        disabled
                                        className="mt-1 block w-full bg-gray-100 border-gray-300 rounded-md text-sm cursor-not-allowed"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Customer *</label>
                                    <select
                                        value={data.customer_id}
                                        onChange={handleCustomerChange}
                                        className="mt-1 block w-full border-gray-300 rounded-md text-sm"
                                    >
                                        <option value="">Pilih Customer</option>
                                        {customers.map(cust => (
                                            <option key={cust.id} value={cust.id}>{cust.name}</option>
                                        ))}
                                    </select>
                                    {errors.customer_id && <div className="text-red-500 text-xs mt-1">{errors.customer_id}</div>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">No. Sales Order (SO) Asal *</label>
                                    <select
                                        value={data.sales_order_id}
                                        onChange={handleSOChange}
                                        disabled={!data.customer_id}
                                        className="mt-1 block w-full border-gray-300 rounded-md text-sm disabled:bg-gray-100"
                                    >
                                        <option value="">Pilih No. SO</option>
                                        {availableSOs.map(so => (
                                            <option key={so.id} value={so.id}>
                                                {so.order_number || so.so_number} ({so.order_date})
                                            </option>
                                        ))}
                                    </select>
                                    {errors.sales_order_id && <div className="text-red-500 text-xs mt-1">{errors.sales_order_id}</div>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Tanggal Retur *</label>
                                    <input
                                        type="date"
                                        value={data.return_date}
                                        onChange={e => setData('return_date', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md text-sm"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">Alasan Retur</label>
                                    <input
                                        type="text"
                                        placeholder="Misal: Barang tidak sesuai / cacat dari customer"
                                        value={data.reason}
                                        onChange={e => setData('reason', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md text-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <h3 className="text-md font-medium text-gray-700 mb-2">Daftar Barang yang Diretur oleh Customer</h3>
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
                                                    <td className="px-4 py-2 text-sm text-gray-800 font-medium">{item.product_name}</td>
                                                    <td className="px-4 py-2 text-center">
                                                        <input
                                                            type="number"
                                                            min="1"
                                                            max={item.max_quantity}
                                                            value={item.quantity}
                                                            onChange={e => updateItemQuantity(index, e.target.value)}
                                                            className="w-24 text-center border-gray-300 rounded-md text-sm"
                                                        />
                                                    </td>
                                                    <td className="px-4 py-2 text-right text-sm text-gray-600">
                                                        Rp {Number(item.unit_price).toLocaleString('id-ID')}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="3" className="px-4 py-6 text-center text-sm text-gray-400">
                                                    Silakan pilih Customer dan No. SO terlebih dahulu.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <div className="flex justify-end gap-3">
                                <Link
                                    href={route('sales-returns.index')}
                                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-300"
                                >
                                    Batal
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing || data.items.length === 0}
                                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
                                >
                                    Simpan Retur Penjualan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}