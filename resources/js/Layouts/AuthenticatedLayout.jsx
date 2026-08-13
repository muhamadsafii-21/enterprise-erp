import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const isActive = (urlPattern) => route().current(urlPattern);

    // Helper singkat untuk cek role (Super Admin bebas akses apa saja)
    const hasRole = (roleName) => {
        if (!user.roles) return false;
        return user.roles.includes('super-admin') || user.roles.includes(roleName);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex">
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 transition-transform duration-300 ease-in-out lg:sticky lg:top-0 lg:translate-x-0 h-screen flex flex-col ${
                sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}>
                <div className="flex h-16 items-center justify-between px-6 bg-slate-950 shrink-0">
                    <Link href={route('dashboard')} className="flex items-center space-x-3 focus:outline-none">
                        <ApplicationLogo className="block h-8 w-auto fill-current text-indigo-400" />
                        <span className="font-bold text-white tracking-wider text-lg">Enterprise ERP</span>
                    </Link>
                    <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white focus:outline-none">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="px-4 py-4 space-y-6 overflow-y-auto flex-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-slate-700 [&::-webkit-scrollbar-thumb]:rounded-full">
                    
                    {/* Main Menu (Semua bisa akses) */}
                    <div>
                        <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Main</div>
                        <Link
                            href={route('dashboard')}
                            className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors outline-none focus:outline-none ${
                                isActive('dashboard') ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800 hover:text-white'
                            }`}
                        >
                            Dashboard
                        </Link>
                    </div>

                    {/* Modul: Inventory & Stock (Hanya Inventory & Super Admin) */}
                    {hasRole('inventory') && (
                        <div>
                            <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Inventory Management</div>
                            <div className="space-y-1">
                                <Link href={route('products.index')} className={`flex items-center px-3 py-2 rounded-lg text-sm transition-colors outline-none focus:outline-none ${isActive('products.*') ? 'bg-indigo-600 text-white font-medium' : 'hover:bg-slate-800 hover:text-white'}`}>Products & Stock</Link>
                                <Link href={route('delivery-orders.index')} className={`flex items-center px-3 py-2 rounded-lg text-sm transition-colors outline-none focus:outline-none ${isActive('delivery-orders.*') ? 'bg-indigo-600 text-white font-medium' : 'hover:bg-slate-800 hover:text-white'}`}>Delivery Orders</Link>
                                <Link href={route('goods-receipts.index')} className={`flex items-center px-3 py-2 rounded-lg text-sm transition-colors outline-none focus:outline-none ${isActive('goods-receipts.*') ? 'bg-indigo-600 text-white font-medium' : 'hover:bg-slate-800 hover:text-white'}`}>Goods Receipts</Link>
                                <Link href={route('stock-movements.index')} className={`flex items-center px-3 py-2 rounded-lg text-sm transition-colors outline-none focus:outline-none ${isActive('stock-movements.*') ? 'bg-indigo-600 text-white font-medium' : 'hover:bg-slate-800 hover:text-white'}`}>Stock Movements</Link>
                            </div>
                        </div>
                    )}

                    {/* Modul: Purchasing (Hanya Purchasing/Inventory & Super Admin) */}
                    {hasRole('inventory') && (
                        <div>
                            <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Purchasing & Supply</div>
                            <div className="space-y-1">
                                <Link href={route('purchase-orders.index')} className={`flex items-center px-3 py-2 rounded-lg text-sm transition-colors outline-none focus:outline-none ${isActive('purchase-orders.*') ? 'bg-indigo-600 text-white font-medium' : 'hover:bg-slate-800 hover:text-white'}`}>Purchase Orders</Link>
                                <Link href={route('purchase-invoices.index')} className={`flex items-center px-3 py-2 rounded-lg text-sm transition-colors outline-none focus:outline-none ${isActive('purchase-invoices.*') ? 'bg-indigo-600 text-white font-medium' : 'hover:bg-slate-800 hover:text-white'}`}>Purchase Invoices</Link>
                                <Link href={route('suppliers.index')} className={`flex items-center px-3 py-2 rounded-lg text-sm transition-colors outline-none focus:outline-none ${isActive('suppliers.*') ? 'bg-indigo-600 text-white font-medium' : 'hover:bg-slate-800 hover:text-white'}`}>Suppliers</Link>
                                <Link href={route('purchase-returns.index')} className={`flex items-center px-3 py-2 rounded-lg text-sm transition-colors outline-none focus:outline-none ${isActive('purchase-returns.*') ? 'bg-indigo-600 text-white font-medium' : 'hover:bg-slate-800 hover:text-white'}`}>Purchase Returns</Link>
                            </div>
                        </div>
                    )}

                    {/* Modul: Sales & CRM (Hanya Sales & Super Admin) */}
                    {hasRole('sales') && (
                        <div>
                            <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Sales & CRM</div>
                            <div className="space-y-1">
                                <Link href={route('sales-orders.index')} className={`flex items-center px-3 py-2 rounded-lg text-sm transition-colors outline-none focus:outline-none ${isActive('sales-orders.*') ? 'bg-indigo-600 text-white font-medium' : 'hover:bg-slate-800 hover:text-white'}`}>Sales Orders</Link>
                                <Link href={route('sales-returns.index')} className={`flex items-center px-3 py-2 rounded-lg text-sm transition-colors outline-none focus:outline-none ${isActive('sales-returns.*') ? 'bg-indigo-600 text-white font-medium' : 'hover:bg-slate-800 hover:text-white'}`}>Sales Returns</Link>
                                <Link href={route('sales-invoices.index')} className={`flex items-center px-3 py-2 rounded-lg text-sm transition-colors outline-none focus:outline-none ${isActive('sales-invoices.*') ? 'bg-indigo-600 text-white font-medium' : 'hover:bg-slate-800 hover:text-white'}`}>Sales Invoices (Faktur)</Link>
                                <Link href={route('customers.index')} className={`flex items-center px-3 py-2 rounded-lg text-sm transition-colors outline-none focus:outline-none ${isActive('customers.*') ? 'bg-indigo-600 text-white font-medium' : 'hover:bg-slate-800 hover:text-white'}`}>Customers</Link>
                            </div>
                        </div>
                    )}

                    {/* Modul: Finance & Accounting (Hanya Finance & Super Admin) */}
                    {hasRole('finance') && (
                        <div>
                            <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Finance & Accounting</div>
                            <div className="space-y-1">
                                <Link href={route('reports.accounts-payable')} className={`flex items-center px-3 py-2 rounded-lg text-sm transition-colors outline-none focus:outline-none ${isActive('reports.accounts-payable') ? 'bg-indigo-600 text-white font-medium' : 'hover:bg-slate-800 hover:text-white'}`}>Laporan Utang Usaha</Link>
                                <Link href={route('reports.profit-and-loss')} className={`flex items-center px-3 py-2 rounded-lg text-sm transition-colors outline-none focus:outline-none ${isActive('reports.profit-and-loss') ? 'bg-indigo-600 text-white font-medium' : 'hover:bg-slate-800 hover:text-white'}`}>Laporan Laba Rugi</Link>
                                <Link href={route('expenses.index')} className={`flex items-center px-3 py-2 rounded-lg text-sm transition-colors outline-none focus:outline-none ${isActive('expenses.*') ? 'bg-indigo-600 text-white font-medium' : 'hover:bg-slate-800 hover:text-white'}`}>Operational Expenses</Link>
                            </div>
                        </div>
                    )}

                    {/* Modul: Administration (Hanya Super Admin / Sesuai Role Super Admin) */}
                    {hasRole('super-admin') && (
                        <div>
                            <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Administration</div>
                            <div className="space-y-1">
                                <Link 
                                    href={route('users.index')} 
                                    className={`flex items-center px-3 py-2 rounded-lg text-sm transition-colors outline-none focus:outline-none ${
                                        isActive('users.*') ? 'bg-indigo-600 text-white font-medium' : 'hover:bg-slate-800 hover:text-white'
                                    }`}
                                >
                                    Manajemen User
                                </Link>
                                <Link 
                                    href={route('employees.index')} 
                                    className={`flex items-center px-3 py-2 rounded-lg text-sm transition-colors outline-none focus:outline-none ${
                                        isActive('employees.*') ? 'bg-indigo-600 text-white font-medium' : 'hover:bg-slate-800 hover:text-white'
                                  }`}
                                >
                                    Daftar Karyawan
                                </Link>
                            </div>
                        </div>
                    )}

                </div>
            </aside>

            <div className="flex-1 flex flex-col min-w-0">
                <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 sticky top-0 z-40 shadow-sm">
                    <div className="flex items-center">
                        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden text-gray-500 hover:text-gray-700 focus:outline-none mr-4">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <div className="text-lg font-semibold text-gray-800 truncate">{header ? header : 'Dashboard ERP'}</div>
                    </div>

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
                                <Dropdown.Link href={route('logout')} method="post" as="button">Log Out</Dropdown.Link>
                            </Dropdown.Content>
                        </Dropdown>
                    </div>
                </header>

                <main className="flex-1 p-6 overflow-y-auto">{children}</main>
            </div>
        </div>
    );
}