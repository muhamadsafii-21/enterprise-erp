import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useEffect } from 'react';

export default function Create({ salesOrders }) {
    const { data, setData, post, processing, errors } = useForm({
        sales_order_id: '',
        delivery_date: new Date().toISOString().split('T')[0],
        driver_name: '',
        vehicle_number: '',
        shipping_address: '',
        notes: '',
        items: [],
    });

    // Ketika Sales Order dipilih, otomatis ambil data item produknya
  useEffect(() => {
        if (data.sales_order_id) {
            const selectedSo = salesOrders.find(so => so.id == data.sales_order_id);
            if (selectedSo) {
                setData(prev => ({
                    ...prev,
                    shipping_address: selectedSo.shipping_address || '',
                    items: selectedSo.items ? selectedSo.items.map(item => ({
                        product_id: item.product_id,
                        product_name: item.product?.name || 'Produk',
                        quantity_shipped: item.quantity || 1,
                    })) : []
                }));
            }
        }
    }, [data.sales_order_id]);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('delivery-orders.store'));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Buat Surat Jalan (Delivery Order)
                </h2>
            }
        >
            <Head title="Buat Delivery Order" />

            <div className="py-6">
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            
                            {/* Pilih Sales Order */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Pilih Sales Order (SO)</label>
                                <select
    value={data.sales_order_id}
    onChange={(e) => setData('sales_order_id', e.target.value)}
    className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
>
    <option value="">-- Pilih Sales Order --</option>
    {salesOrders && salesOrders.map((so) => (
        <option key={so.id} value={so.id}>
            {so.order_number} - {so.customer?.name} ({so.order_date})
        </option>
    ))}
</select>
                                {errors.sales_order_id && <div className="text-red-500 text-xs mt-1">{errors.sales_order_id}</div>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Tanggal Kirim */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Tanggal Pengiriman</label>
                                    <input
                                        type="date"
                                        value={data.delivery_date}
                                        onChange={(e) => setData('delivery_date', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                    {errors.delivery_date && <div className="text-red-500 text-xs mt-1">{errors.delivery_date}</div>}
                                </div>

                                {/* Nama Driver */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Nama Driver</label>
                                    <input
                                        type="text"
                                        placeholder="Contoh: Budi Santoso"
                                        value={data.driver_name}
                                        onChange={(e) => setData('driver_name', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Nomor Kendaraan */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Plat Nomor Kendaraan</label>
                                    <input
                                        type="text"
                                        placeholder="Contoh: H 1234 ABC"
                                        value={data.vehicle_number}
                                        onChange={(e) => setData('vehicle_number', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                </div>

                                {/* Alamat Pengiriman */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Alamat Pengiriman</label>
                                    <input
                                        type="text"
                                        value={data.shipping_address}
                                        onChange={(e) => setData('shipping_address', e.target.value)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                </div>
                            </div>

                            {/* Daftar Barang yang Dikirim */}
                            {data.items.length > 0 && (
                                <div className="mt-6">
                                    <h3 className="text-md font-semibold text-gray-800 mb-2">Item Barang yang Dikirim</h3>
                                    <table className="min-w-full divide-y divide-gray-200 border">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Produk</th>
                                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Jumlah Kirim (Qty)</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {data.items.map((item, index) => (
                                                <tr key={index}>
                                                    <td className="px-4 py-2 text-sm text-gray-900">{item.product_name}</td>
                                                    <td className="px-4 py-2 text-sm text-gray-700">
                                                        <input
                                                            type="number"
                                                            min="1"
                                                            value={item.quantity_shipped}
                                                            onChange={(e) => {
                                                                const newItems = [...data.items];
                                                                newItems[index].quantity_shipped = e.target.value;
                                                                setData('items', newItems);
                                                            }}
                                                            className="w-32 border-gray-300 rounded-md shadow-sm sm:text-sm"
                                                        />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            <div className="flex justify-end space-x-3 pt-4 border-t">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-50"
                                >
                                    {processing ? 'Menyimpan...' : 'Simpan & Proses DO'}
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}