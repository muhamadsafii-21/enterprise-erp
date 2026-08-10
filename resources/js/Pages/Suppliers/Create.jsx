import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';

export default function Create({ auth, autoCode }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        phone: '',
        address: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('suppliers.store'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-slate-800 leading-tight">Tambah Supplier Baru</h2>}
        >
            <Head title="Tambah Supplier" />

            <div className="py-8 bg-slate-50 min-h-screen">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
                        <div className="flex justify-between items-center pb-4 mb-2 border-b border-slate-200">
                            <h1 className="text-lg font-bold text-slate-800">Form Supplier</h1>
                            <Link href={route('suppliers.index')} className="text-sm text-slate-500 hover:text-slate-700">
                                &larr; Kembali
                            </Link>
                        </div>

                        {/* Info Kode Otomatis */}
                        <div>
                            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Kode Supplier (Otomatis)</label>
                            <input
                                type="text"
                                value={autoCode}
                                disabled
                                className="w-full bg-slate-100 text-slate-500 border-slate-300 rounded-lg shadow-sm text-sm cursor-not-allowed font-mono"
                            />
                            <p className="text-xs text-slate-400 mt-1">Kode dibuat secara otomatis oleh sistem.</p>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Nama Perusahaan / Supplier</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Contoh: PT. Sumber Makmur Jaya"
                                className="w-full border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                                required
                            />
                            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">No. Telepon</label>
                            <input
                                type="text"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                placeholder="Contoh: 081234567890"
                                className="w-full border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                            />
                            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Alamat Lengkap</label>
                            <textarea
                                rows="3"
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                                placeholder="Contoh: Jl. Industri Raya No. 10, Jakarta"
                                className="w-full border-slate-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                            ></textarea>
                            {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-semibold py-2.5 rounded-lg shadow transition duration-150 text-sm cursor-pointer"
                            >
                                {processing ? 'Menyimpan...' : 'Simpan Supplier'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}