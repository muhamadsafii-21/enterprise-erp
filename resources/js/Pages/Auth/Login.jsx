import React from 'react';
import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    // Fungsi khusus untuk Demo Instant Login (Portofolio)
    const handleDemoLogin = (role) => {
        let demoEmail = 'admin@erp.com';
        let demoPass = 'password123';

        if (role === 'staff') {
            demoEmail = 'staff@erp.com'; // Sesuaikan jika ada akun staff
        }

        data.email = demoEmail;
        data.password = demoPass;

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Log in - Enterprise ERP Portfolio" />

            <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-slate-900">
                
                {/* KOLOM KIRI: Branding & Portofolio Info */}
                <div className="hidden lg:flex lg:col-span-7 relative bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 p-12 flex-col justify-between overflow-hidden border-r border-slate-800">
                    <div className="absolute -top-32 -left-32 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
                    <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>

                    <div className="relative z-10 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-500/30">
                            E
                        </div>
                        <div>
                            <span className="text-white font-extrabold tracking-wider text-lg">Enterprise ERP</span>
                            <span className="block text-[10px] text-indigo-400 font-medium tracking-widest uppercase">Portfolio Showcase System</span>
                        </div>
                    </div>

                    <div className="relative z-10 my-auto max-w-lg space-y-6">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                            Live Portfolio Demo v2.0
                        </span>
                        <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                            Sistem Kendali Operasional <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">Bisnis & Inventaris</span>.
                        </h1>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Aplikasi ERP full-stack yang dirancang untuk mengelola rantai pasok, transaksi penjualan (Sales Order), hingga monitoring stok secara real-time. Silakan gunakan tombol demo di samping untuk menguji sistem.
                        </p>
                    </div>

                    <div className="relative z-10 text-xs text-slate-500 flex items-center justify-between">
                        <p>&copy; {new Date().getFullYear()} Enterprise ERP Portfolio.</p>
                        <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            System Online
                        </span>
                    </div>
                </div>

                {/* KOLOM KANAN: Form Login + Tombol Demo Portofolio */}
                <div className="col-span-1 lg:col-span-5 flex flex-col justify-center px-6 py-12 lg:px-16 bg-white">
                    <div className="w-full max-w-sm mx-auto space-y-6">
                        
                        <div className="lg:hidden flex items-center gap-3 mb-2">
                            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-lg">
                                E
                            </div>
                            <span className="text-slate-900 font-extrabold text-lg">Enterprise ERP</span>
                        </div>

                        <div>
                            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Masuk Sistem</h2>
                            <p className="text-xs text-slate-500 mt-1">Akses panel kontrol manajemen perusahaan.</p>
                        </div>

                        {status && (
                            <div className="mb-4 text-xs font-medium text-emerald-600 bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                                {status}
                            </div>
                        )}

                        {/* FITUR TOMBOL DEMO INSTAN UNTUK RECRUITER */}
                        <div className="bg-indigo-50/70 border border-indigo-100 p-4 rounded-2xl space-y-2">
                            <p className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                                ⚡ Akses Cepat Portofolio (Demo Mode)
                            </p>
                            <p className="text-[11px] text-indigo-700/80 leading-relaxed">
                                Penilai/Recruiter dapat langsung masuk tanpa harus mengetik akun:
                            </p>
                            <button
                                type="button"
                                onClick={() => handleDemoLogin('admin')}
                                disabled={processing}
                                className="w-full mt-1 py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
                            >
                                🚀 Login Instan sebagai Admin ERP
                            </button>
                        </div>

                        <div className="relative flex py-1 items-center">
                            <div className="flex-grow border-t border-slate-200"></div>
                            <span className="flex-shrink mx-4 text-[10px] text-slate-400 uppercase tracking-widest font-bold">Atau Manual</span>
                            <div className="flex-grow border-t border-slate-200"></div>
                        </div>

                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <InputLabel htmlFor="email" value="Email" className="text-xs font-bold text-slate-700 uppercase tracking-wider" />
                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="mt-1 block w-full rounded-xl border-slate-300 focus:border-indigo-500 focus:ring-indigo-500 text-sm py-2 shadow-sm"
                                    autoComplete="username"
                                    isFocused={true}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="nama@perusahaan.com"
                                />
                                <InputError message={errors.email} className="mt-2 text-xs" />
                            </div>

                            <div>
                                <InputLabel htmlFor="password" value="Kata Sandi" className="text-xs font-bold text-slate-700 uppercase tracking-wider" />
                                <TextInput
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="mt-1 block w-full rounded-xl border-slate-300 focus:border-indigo-500 focus:ring-indigo-500 text-sm py-2 shadow-sm"
                                    autoComplete="current-password"
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="••••••••"
                                />
                                <InputError message={errors.password} className="mt-2 text-xs" />
                            </div>

                            <div className="flex items-center justify-between">
                                <label className="flex items-center">
                                    <Checkbox
                                        name="remember"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span className="ml-2 text-xs text-slate-600 font-medium">Ingat saya</span>
                                </label>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full inline-flex justify-center items-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 focus:outline-none transition-all"
                                >
                                    Masuk Manual
                                </button>
                            </div>
                        </form>

                    </div>
                </div>

            </div>
        </>
    );
}