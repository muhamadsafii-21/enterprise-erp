import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useForm, Link } from '@inertiajs/react';
import { useState } from 'react';

export default function CustomerShow({ customer, salesOrders, stats }) {
    const [activeTab, setActiveTab] = useState('transaksi');
    
    // State lokal untuk pesan sukses
    const [successMessage, setSuccessMessage] = useState('');

    // Form state untuk Catatan Internal
    const { data, setData, patch, processing } = useForm({
        internal_notes: customer.internal_notes || '',
    });

    const submitNotes = (e) => {
        e.preventDefault();
        patch(route('customers.update-notes', customer.id), {
            onSuccess: () => {
                // Munculkan pesan sukses secara instan di frontend
                setSuccessMessage('Catatan internal berhasil diperbarui!');
                // Hilangkan pesan otomatis setelah 3 detik
                setTimeout(() => {
                    setSuccessMessage('');
                }, 3000);
            },
        });
    };

    return (
        <AuthenticatedLayout header={`Profil Pelanggan: ${customer.name}`}>
            <div className="py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* HEADER UTAMA: SPLIT LAYOUT (INFORMASI PRIMER & STATISTIK) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    
                    {/* Kolom Kiri & Tengah: Informasi Primer (Identitas & Kontak) */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <h2 className="text-2xl font-bold text-gray-800">{customer.name}</h2>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                    stats?.status_loyalitas === 'VIP Member' 
                                        ? 'bg-amber-100 text-amber-800 border border-amber-200' 
                                        : 'bg-gray-100 text-gray-700'
                                }`}>
                                    ⭐ {stats?.status_loyalitas || 'Reguler'}
                                </span>
                            </div>
                            
                            <div className="text-xs text-gray-400 mb-4 font-mono">
                                ID Pelanggan: CUST-2026-{String(customer.id).padStart(3, '0')}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm border-t border-gray-100 pt-4">
                                <div>
                                    <span className="block text-gray-400 text-xs uppercase font-medium">Kontak (Email / Telp)</span>
                                    <span className="text-gray-700 font-medium block">{customer.email || '-'}</span>
                                    
                                    {/* Nomor WhatsApp Interaktif */}
                                    {customer.phone ? (
                                        <a 
                                            href={`https://wa.me/${customer.phone.replace(/^0/, '62').replace(/\D/g, '')}`} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-emerald-600 hover:text-emerald-700 font-medium inline-flex items-center gap-1.5 mt-0.5 hover:underline"
                                            title="Klik untuk langsung chat WhatsApp"
                                        >
                                            <span>💬 {customer.phone}</span>
                                            <span className="text-xs bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-200">Chat ↗</span>
                                        </a>
                                    ) : (
                                        <span className="text-gray-600 font-medium block">-</span>
                                    )}
                                </div>
                                <div>
                                    <span className="block text-gray-400 text-xs uppercase font-medium">Alamat Lengkap</span>
                                    <span className="text-gray-700 font-medium">{customer.address || '-'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Kolom Kanan: Kartu Indikator Statistik Cepat (KPI Cards) */}
                    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex flex-col justify-between space-y-4">
                        <div>
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Transaksi</span>
                            <div className="text-xl font-extrabold text-indigo-600 mt-1">
                                Rp {Number(stats?.total_transaksi || 0).toLocaleString()}
                            </div>
                        </div>

                        <div className="border-t border-gray-100 pt-3">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Sisa Piutang</span>
                            <div className={`text-xl font-extrabold mt-1 ${(stats?.sisa_piutang || 0) > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                                Rp {Number(stats?.sisa_piutang || 0).toLocaleString()}
                            </div>
                        </div>
                    </div>

                </div>

                {/* Tab Navigasi */}
                <div className="flex border-b border-gray-200 mb-6">
                    <button 
                        onClick={() => setActiveTab('transaksi')} 
                        className={`py-2 px-6 font-medium text-sm border-b-2 transition ${
                            activeTab === 'transaksi' 
                                ? 'border-indigo-600 text-indigo-600' 
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Histori Transaksi
                    </button>
                    <button 
                        onClick={() => setActiveTab('catatan')} 
                        className={`py-2 px-6 font-medium text-sm border-b-2 transition ${
                            activeTab === 'catatan' 
                                ? 'border-indigo-600 text-indigo-600' 
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Catatan Internal Tim
                    </button>
                </div>

                {/* Konten Tab Transaksi (Dengan Pagination 10 data) */}
                {activeTab === 'transaksi' && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-4 border-b border-gray-100 font-bold text-gray-800 flex justify-between items-center">
                            <span>Daftar Transaksi / Sales Orders</span>
                            <span className="text-xs font-normal text-gray-400">Menampilkan 10 data per halaman</span>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 text-gray-700 uppercase text-xs">
                                    <tr>
                                        <th className="px-6 py-3">Order ID</th>
                                        <th className="px-6 py-3">Tanggal</th>
                                        <th className="px-6 py-3">Total Tagihan</th>
                                        <th className="px-6 py-3">Dibayar</th>
                                        <th className="px-6 py-3">Kurang (Piutang)</th>
                                        <th className="px-6 py-3">Status Invoice</th>
                                        <th className="px-6 py-3">Status Order</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {salesOrders?.data && salesOrders.data.length > 0 ? (
                                        salesOrders.data.map((order) => (
                                            <tr key={order.id} className="border-t border-gray-100 hover:bg-gray-50">
                                                <td className="px-6 py-4 font-medium">#{order.id}</td>
                                                <td className="px-6 py-4">{new Date(order.created_at).toLocaleDateString()}</td>
                                                <td className="px-6 py-4 font-semibold">Rp {Number(order.total_amount || 0).toLocaleString()}</td>
                                                <td className="px-6 py-4 text-emerald-600 font-medium">Rp {Number(order.paid_amount || 0).toLocaleString()}</td>
                                                <td className="px-6 py-4 text-red-600 font-medium">Rp {Number(order.remaining_amount || 0).toLocaleString()}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase ${
                                                        order.invoice_status === 'paid' 
                                                            ? 'bg-green-100 text-green-700' 
                                                            : order.invoice_status === 'partial' 
                                                            ? 'bg-amber-100 text-amber-700' 
                                                            : 'bg-gray-100 text-gray-600'
                                                    }`}>
                                                        {order.invoice_status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase ${
                                                        order.status === 'COMPLETED' 
                                                            ? 'bg-green-100 text-green-700' 
                                                            : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="px-6 py-8 text-center text-gray-400">
                                                Belum ada riwayat transaksi untuk pelanggan ini.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Tombol Navigasi Pagination */}
                        {salesOrders?.links && salesOrders.links.length > 3 && (
                            <div className="p-4 border-t border-gray-100 flex justify-center space-x-1">
                                {salesOrders.links.map((link, index) => (
                                    <Link
                                        key={index}
                                        href={link.url || '#'}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`px-3 py-1.5 text-xs rounded border transition ${
                                            link.active 
                                                ? 'bg-indigo-600 text-white border-indigo-600 font-semibold' 
                                                : link.url 
                                                    ? 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50' 
                                                    : 'bg-gray-50 text-gray-300 border-gray-200 cursor-not-allowed'
                                        }`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Konten Tab Catatan Internal */}
                {activeTab === 'catatan' && (
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h3 className="text-lg font-bold text-gray-800 mb-1">Catatan Internal Perusahaan</h3>
                        <p className="text-sm text-gray-500 mb-4">
                            Catatan ini bersifat rahasia dan hanya bisa dibaca oleh tim internal (Admin/Sales).
                        </p>

                        <form onSubmit={submitNotes}>
                            <textarea
                                rows="5"
                                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm p-3"
                                value={data.internal_notes}
                                onChange={(e) => setData('internal_notes', e.target.value)}
                                placeholder="Tulis catatan penting tentang pelanggan ini di sini..."
                            ></textarea>

                            <div className="mt-4 flex items-center justify-between">
                                {/* Indikator Pesan Sukses Lokal */}
                                {successMessage ? (
                                    <span className="text-sm font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 animate-fade-in">
                                        ✓ {successMessage}
                                    </span>
                                ) : (
                                    <div></div>
                                )}

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition shadow-sm disabled:opacity-50"
                                >
                                    {processing ? 'Menyimpan...' : 'Simpan Catatan'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

            </div>
        </AuthenticatedLayout>
    );
}