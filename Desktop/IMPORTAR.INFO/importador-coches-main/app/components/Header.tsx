'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useRouter } from 'next/navigation';

export default function Header() {
    const { user, loading, signOut } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSignOut = async () => {
        setIsMenuOpen(false);
        await signOut();
        router.push('/');
        router.refresh();
    };

    return (
        <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${scrolled
            ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-lg shadow-gray-200/50 dark:shadow-gray-900/50 border-b border-gray-200/50 dark:border-gray-800/50'
            : 'bg-transparent'
            }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16 sm:h-20">
                    {/* Logo Section */}
                    <Link href="/" className="flex-shrink-0 flex items-center gap-2 sm:gap-3 group">
                        <div className="h-9 w-9 sm:h-11 sm:w-11 bg-gradient-to-br from-primary via-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-black text-lg sm:text-xl shadow-lg shadow-primary/30 group-hover:shadow-xl group-hover:shadow-primary/40 group-hover:scale-105 transition-all duration-300">
                            I
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-lg sm:text-xl tracking-tight text-gray-900 dark:text-white leading-tight">
                                Importar<span className="text-primary">.info</span>
                            </span>
                            <span className="text-[9px] sm:text-[10px] text-gray-400 font-medium uppercase tracking-widest hidden sm:block">
                                Calculadora de Importación
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-1">
                        <Link
                            href="/#how-it-works"
                            className="px-4 py-2 text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-white transition-colors text-sm font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                            Cómo Funciona
                        </Link>
                        <Link
                            href="/search"
                            className="px-4 py-2 text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-white transition-colors text-sm font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                            Calculadora
                        </Link>
                        {user && (
                            <Link
                                href="/history"
                                className="px-4 py-2 text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-white transition-colors text-sm font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                            >
                                Mis Cálculos
                            </Link>
                        )}
                    </nav>

                    {/* Auth Section + Theme Toggle */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        {/* Theme Toggle Button */}
                        <button
                            onClick={toggleTheme}
                            className="p-2 sm:p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-105"
                            aria-label={theme === 'light' ? 'Activar modo oscuro' : 'Activar modo claro'}
                        >
                            {theme === 'light' ? (
                                <span className="material-symbols-outlined text-lg sm:text-xl">dark_mode</span>
                            ) : (
                                <span className="material-symbols-outlined text-lg sm:text-xl">light_mode</span>
                            )}
                        </button>

                        {!loading && user ? (
                            <div className="relative" ref={menuRef}>
                                {/* User Dropdown Trigger */}
                                <button
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-3 pr-1.5 sm:pr-2 py-1.5 sm:py-2 rounded-full bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md"
                                >
                                    <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-gradient-to-br from-primary via-blue-500 to-purple-600 text-white flex items-center justify-center font-bold text-xs sm:text-sm shadow-inner">
                                        {user.email?.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="hidden sm:flex flex-col items-start">
                                        <span className="text-sm font-bold text-gray-700 dark:text-gray-200 leading-none">
                                            {user.user_metadata?.full_name || user.email?.split('@')[0]}
                                        </span>
                                        <span className="text-[10px] text-gray-400 font-medium flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                            Cuenta Activa
                                        </span>
                                    </div>
                                    <span className={`material-symbols-outlined text-gray-400 text-sm sm:text-base transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`}>
                                        expand_more
                                    </span>
                                </button>

                                {/* Dropdown Menu */}
                                {isMenuOpen && (
                                    <div className="absolute right-0 mt-3 w-56 sm:w-64 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                                        {/* User Info */}
                                        <div className="p-4 bg-gradient-to-br from-primary/5 to-purple-500/5 dark:from-primary/10 dark:to-purple-500/10 border-b border-gray-100 dark:border-gray-700">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-gradient-to-br from-primary to-purple-600 text-white flex items-center justify-center font-bold text-base sm:text-lg shadow-lg">
                                                    {user.email?.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900 dark:text-white text-sm sm:text-base">
                                                        {user.user_metadata?.full_name || user.email?.split('@')[0]}
                                                    </p>
                                                    <p className="text-xs text-gray-500 truncate max-w-[120px] sm:max-w-[150px]">{user.email}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Menu Items */}
                                        <div className="p-2">
                                            <Link
                                                href="/search"
                                                onClick={() => setIsMenuOpen(false)}
                                                className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl group transition-colors"
                                            >
                                                <span className="material-symbols-outlined text-gray-400 group-hover:text-primary transition-colors">add_circle</span>
                                                <span className="font-medium">Nueva Búsqueda</span>
                                            </Link>
                                            <Link
                                                href="/history"
                                                onClick={() => setIsMenuOpen(false)}
                                                className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl group transition-colors"
                                            >
                                                <span className="material-symbols-outlined text-gray-400 group-hover:text-primary transition-colors">history</span>
                                                <span className="font-medium">Mis Cálculos</span>
                                            </Link>
                                        </div>

                                        {/* Sign Out */}
                                        <div className="p-2 border-t border-gray-100 dark:border-gray-700">
                                            <button
                                                onClick={handleSignOut}
                                                className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors group"
                                            >
                                                <span className="material-symbols-outlined group-hover:text-red-600 transition-colors">logout</span>
                                                <span className="font-medium">Cerrar Sesión</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : !loading ? (
                            /* Public Auth Buttons */
                            <div className="flex items-center gap-1 sm:gap-2">
                                <Link
                                    href="/auth"
                                    className="hidden sm:inline-flex px-3 sm:px-4 py-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white text-sm font-medium transition-colors"
                                >
                                    Iniciar Sesión
                                </Link>
                                <Link
                                    href="/auth"
                                    className="inline-flex items-center justify-center gap-1 sm:gap-2 bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-primary text-white px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-primary/30 transition-all hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5"
                                >
                                    <span className="material-symbols-outlined text-base sm:text-lg">person_add</span>
                                    <span className="hidden xs:inline sm:inline">Registrarse</span>
                                </Link>
                            </div>
                        ) : (
                            /* Loading State */
                            <div className="h-8 w-20 sm:h-10 sm:w-28 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
