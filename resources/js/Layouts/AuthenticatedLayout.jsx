import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Helper untuk mengecek active state link
    const isActive = (urlPattern) => route().current(urlPattern);

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* 1. SIDEBAR (Kiri - Ala SAP/Odoo) */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
                sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}>
                {/* Logo & Brand */}
                <div className="flex h-16 items-center justify-between px-6 bg-slate-950">
                    <Link href={route('dashboard')} className="flex items-center space-x-3">
                        <ApplicationLogo className="block h-8 w-auto fill-current text-indigo-400" />
                        <span className="font-bold text-white tracking-wider text-lg">Enterprise ERP</span>
                    </Link>
                    {/* Close button for mobile */}
                    <button 
                        onClick={() => setSidebarOpen(false)} 
                        className="lg:hidden text-slate-400 hover:text-white focus:outline-none"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Sidebar Navigation Links */}
                <div className="px-4 py-4 space-y-6 overflow-y-auto h-[calc(100vh-4rem)]">
                    
                    {/* Main Menu */}
                    <div>
                        <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                            Main
                        </div>
                        <Link
                            href={route('dashboard')}
                            className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                isActive('dashboard') 
                                    ? 'bg-indigo-600 text-white' 
                                    : 'hover:bg-slate-800 hover:text-white'
                            }`}
                        >
                            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                            Dashboard
                        </Link>
                    </div>

                    {/* Modul: Inventory & Stock */}
                    <div>
                        <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                            Inventory Management
                        </div>
                        <div className="space-y-1">
                            <Link
                                href={route('products.index')}
                                className={`flex items-center px-3 py-2 rounded-lg text-sm transition-colors ${isActive('products.*') ? 'bg-indigo-600 text-white font-medium' : 'hover:bg-slate-800 hover:text-white'}`}
                            >
                                Products & Stock
                            </Link>
                            <Link
            href={route('delivery-orders.index')}
            className={`flex items-center px-3 py-2 rounded-lg text-sm transition-colors ${isActive('delivery-orders.*') ? 'bg-indigo-600 text-white font-medium' : 'hover:bg-slate-800 hover:text-white'}`}
        >
            Delivery Orders
        </Link>
                            <Link
                                href={route('goods-receipts.index')}
                                className={`flex items-center px-3 py-2 rounded-lg text-sm transition-colors ${isActive('goods-receipts.*') ? 'bg-indigo-600 text-white font-medium' : 'hover:bg-slate-800 hover:text-white'}`}
                            >
                                Goods Receipts
                            </Link>
                            <Link
                                href={route('stock-movements.index')}
                                className={`flex items-center px-3 py-2 rounded-lg text-sm transition-colors ${isActive('stock-movements.*') ? 'bg-indigo-600 text-white font-medium' : 'hover:bg-slate-800 hover:text-white'}`}
                            >
                                Stock Movements
                            </Link>
                        </div>
                    </div>

                    {/* Modul: Purchasing */}
                    <div>
                        <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                            Purchasing & Supply
                        </div>
                        <div className="space-y-1">
                            <Link
                                href={route('purchase-orders.index')}
                                className={`flex items-center px-3 py-2 rounded-lg text-sm transition-colors ${isActive('purchase-orders.*') ? 'bg-indigo-600 text-white font-medium' : 'hover:bg-slate-800 hover:text-white'}`}
                            >
                                Purchase Orders
                            </Link>
                            <Link
                                href={route('purchase-invoices.index')}
                                className={`flex items-center px-3 py-2 rounded-lg text-sm transition-colors ${isActive('purchase-invoices.*') ? 'bg-indigo-600 text-white font-medium' : 'hover:bg-slate-800 hover:text-white'}`}
                            >
                                Purchase Invoices
                            </Link>
                            <Link
                                href={route('suppliers.index')}
                                className={`flex items-center px-3 py-2 rounded-lg text-sm transition-colors ${isActive('suppliers.*') ? 'bg-indigo-600 text-white font-medium' : 'hover:bg-slate-800 hover:text-white'}`}
                            >
                                Suppliers
                            </Link>
                        </div>
                    </div>

                    {/* Modul: Sales & CRM */}
                    <div>
                        <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                            Sales & CRM
                        </div>
                        <div className="space-y-1">
                            <Link
                                href={route('sales-orders.index')}
                                className={`flex items-center px-3 py-2 rounded-lg text-sm transition-colors ${isActive('sales-orders.*') ? 'bg-indigo-600 text-white font-medium' : 'hover:bg-slate-800 hover:text-white'}`}
                            >
                                Sales Orders
                            </Link>
                            <Link
                                href={route('customers.index')}
                                className={`flex items-center px-3 py-2 rounded-lg text-sm transition-colors ${isActive('customers.*') ? 'bg-indigo-600 text-white font-medium' : 'hover:bg-slate-800 hover:text-white'}`}
                            >
                                Customers
                            </Link>
                        </div>
                    </div>

                    {/* Modul: Financial Reports */}
                    <div>
                        <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                            Finance & Accounting
                        </div>
                        <div className="space-y-1">
                            <Link
                                href={route('reports.accounts-payable')}
                                className={`flex items-center px-3 py-2 rounded-lg text-sm transition-colors ${isActive('reports.accounts-payable') ? 'bg-indigo-600 text-white font-medium' : 'hover:bg-slate-800 hover:text-white'}`}
                            >
                                Laporan Utang Usaha
                            </Link>
                            <Link
                                href={route('reports.profit-and-loss')}
                                className={`flex items-center px-3 py-2 rounded-lg text-sm transition-colors ${isActive('reports.profit-and-loss') ? 'bg-indigo-600 text-white font-medium' : 'hover:bg-slate-800 hover:text-white'}`}
                            >
                                Laporan Laba Rugi
                            </Link>
                            
<Link href="/sales-invoices" className={`flex items-center px-3 py-2 rounded-lg text-sm transition-colors ${isActive('reports.profit-and-loss') ? 'bg-indigo-600 text-white font-medium' : 'hover:bg-slate-800 hover:text-white'}`}>
    Sales Invoices
</Link>
                        </div>
                    </div>

                </div>
            </aside>

            {/* 2. MAIN CONTENT AREA (Kanan) */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top Navbar Minimalis (Hanya untuk Hamburger HP & Profil User) */}
                <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 sticky top-0 z-40 shadow-sm">
                    <div className="flex items-center">
                        {/* Hamburger Button untuk layar kecil */}
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="lg:hidden text-gray-500 hover:text-gray-700 focus:outline-none mr-4"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        {/* Judul Halaman / Breadcrumb ringkas */}
                        <h1 className="text-lg font-semibold text-gray-800 truncate">
                            {header ? header : 'Dashboard ERP'}
                        </h1>
                    </div>

                    {/* User Profile Dropdown di pojok kanan atas */}
                    <div className="flex items-center">
                        <Dropdown>
                            <Dropdown.Trigger>
                                <button className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg transition">
                                    <span className="mr-2 font-semibold">{user.name}</span>
                                    <svg className="w-4 h-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </Dropdown.Trigger>
                            <Dropdown.Content>
                                <Dropdown.Link href={route('profile.edit')}>Profile Settings</Dropdown.Link>
                                <Dropdown.Link href={route('logout')} method="post" as="button">
                                    Log Out
                                </Dropdown.Link>
                            </Dropdown.Content>
                        </Dropdown>
                    </div>
                </header>

                {/* Konten Halaman */}
                <main className="flex-1 p-6 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}