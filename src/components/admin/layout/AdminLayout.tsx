import { useState } from 'react';

type AdminTab = 'services' | 'products' | 'combos';

interface AdminLayoutProps {
    activeTab: AdminTab;
    onTabChange: (tab: AdminTab) => void;
    children: React.ReactNode;
    onLogout: () => void;
}

export default function AdminLayout({ activeTab, onTabChange, children, onLogout }: AdminLayoutProps) {
    return (
        <div className="min-h-screen bg-brand-ink text-brand-light font-sans selection:bg-brand-amber/30">
            {/* Top Bar / Header */}
            <header className="sticky top-0 z-40 border-b border-brand-stone/50 bg-brand-ink/95 backdrop-blur-xl">
                <div className="flex items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-amber/10 text-brand-amber ring-1 ring-brand-amber/50">
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-xl font-black uppercase tracking-wider text-brand-light">
                                Panel <span className="text-brand-amber">Upper</span>
                            </h1>
                            <p className="text-[10px] uppercase tracking-[0.2em] text-brand-light/50 animate-pulse">
                                Modo Edición
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={onLogout}
                        className="group flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-red-400 transition-all hover:border-red-500 hover:bg-red-500 hover:text-white"
                    >
                        <span>Salir</span>
                        <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                    </button>
                </div>

                {/* Navigation Tabs */}
                <nav className="flex gap-1 overflow-x-auto border-t border-brand-stone/30 px-6 py-2">
                    <TabButton
                        active={activeTab === 'services'}
                        onClick={() => onTabChange('services')}
                        icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 15.536c-1.171 1.952-3.07 1.952-4.242 0-1.172-1.953-1.172-5.119 0-7.072 1.171-1.952 3.07-1.952 4.242 0M8 10.5h4m-4 3h4m9-1.5a9 9 0 11-18 0 9 9 0 0118 0z" />}
                    >
                        Servicios
                    </TabButton>

                    <TabButton
                        active={activeTab === 'products'}
                        onClick={() => onTabChange('products')}
                        icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />}
                    >
                        Productos
                    </TabButton>

                    <TabButton
                        active={activeTab === 'combos'}
                        onClick={() => onTabChange('combos')}
                        icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />}
                    >
                        Combos
                    </TabButton>
                </nav>
            </header>

            {/* Main Content Area */}
            <main className="p-6">
                <div className="mx-auto max-w-7xl animate-fade-in">
                    {children}
                </div>
            </main>
        </div>
    );
}

function TabButton({ active, onClick, children, icon }: { active: boolean; onClick: () => void; children: React.ReactNode; icon: React.ReactNode }) {
    return (
        <button
            onClick={onClick}
            className={`
        group flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all
        ${active
                    ? 'bg-brand-amber text-brand-ink shadow-[0_0_20px_rgba(247,148,31,0.4)] scale-105'
                    : 'text-brand-light/60 hover:bg-brand-stone/40 hover:text-brand-light'
                }
      `}
        >
            <svg className={`h-4 w-4 ${active ? 'text-brand-ink' : 'text-brand-light/60 group-hover:text-brand-light'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {icon}
            </svg>
            {children}
        </button>
    );
}
