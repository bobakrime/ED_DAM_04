'use client';

import { useState } from 'react';
import { createClient } from '../utils/supabase-client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AuthPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const router = useRouter();
    const supabase = createClient();

    const envMissing = !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (envMissing) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-red-50 p-4">
                <div className="max-w-md bg-white p-8 rounded-xl shadow-2xl border-2 border-red-500 text-center">
                    <h1 className="text-3xl font-black text-red-600 mb-4">¡ERROR GRAVE!</h1>
                    <p className="text-gray-800 font-bold mb-4">No se han encontrado las variables de entorno de Supabase.</p>
                </div>
            </div>
        );
    }

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                window.location.href = '/search';
            } else {
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;

                if (data.session) {
                    window.location.href = '/search';
                } else if (data.user) {
                    setSuccessMessage(`¡Registro exitoso! Hemos enviado un email de confirmación a ${email}. Por favor revisa tu bandeja de entrada (y spam) y haz clic en el enlace para activar tu cuenta.`);
                    setEmail('');
                    setPassword('');
                } else {
                    throw new Error('Error inesperado durante el registro');
                }
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleAuth = async () => {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            }
        });

        if (error) {
            setError(`Error OAuth: ${error.message}`);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 -left-40 w-80 h-80 bg-primary/20 blur-[100px] rounded-full"></div>
                <div className="absolute bottom-0 -right-40 w-80 h-80 bg-purple-500/20 blur-[100px] rounded-full"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-primary/10 to-purple-500/10 blur-[120px] rounded-full animate-pulse"></div>
            </div>

            <div className="relative z-10 w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-3 group">
                        <div className="h-14 w-14 bg-gradient-to-br from-primary to-purple-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-primary/30 group-hover:scale-105 transition-transform">
                            I
                        </div>
                        <span className="text-3xl font-extrabold text-gray-900 dark:text-white">
                            Importar<span className="text-primary">.info</span>
                        </span>
                    </Link>
                </div>

                {/* Card */}
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 p-8 md:p-10">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            {isLogin ? 'Bienvenido de nuevo' : 'Crea tu cuenta gratis'}
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                            {isLogin ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
                            <button
                                onClick={() => { setIsLogin(!isLogin); setError(null); setSuccessMessage(null); }}
                                className="font-semibold text-primary hover:text-primary/80 transition-colors"
                            >
                                {isLogin ? 'Regístrate' : 'Inicia sesión'}
                            </button>
                        </p>
                    </div>

                    {/* Google Button */}
                    <button
                        onClick={handleGoogleAuth}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-3 py-3.5 px-4 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl font-semibold text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-gray-300 dark:hover:border-gray-500 transition-all shadow-sm disabled:opacity-50"
                    >
                        <svg className="h-5 w-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        <span>Continuar con Google</span>
                    </button>

                    {/* Divider */}
                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                        </div>
                        <div className="relative flex justify-center">
                            <span className="bg-white dark:bg-gray-800 px-4 text-sm text-gray-500 dark:text-gray-400">
                                o usa tu email
                            </span>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleAuth} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Correo electrónico
                            </label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">email</span>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="tu@email.com"
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Contraseña
                            </label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">lock</span>
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                />
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 text-sm">
                                <span className="material-symbols-outlined text-lg">error</span>
                                <span>{error}</span>
                            </div>
                        )}

                        {/* Success Message */}
                        {successMessage && (
                            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                                <div className="flex items-start gap-3">
                                    <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-xl">check_circle</span>
                                    <div>
                                        <p className="font-semibold text-green-700 dark:text-green-400 mb-1">¡Registro completado!</p>
                                        <p className="text-sm text-green-600 dark:text-green-300">{successMessage}</p>
                                        <button
                                            type="button"
                                            onClick={() => { setSuccessMessage(null); setIsLogin(true); }}
                                            className="mt-3 text-primary font-semibold text-sm hover:underline"
                                        >
                                            → Ir a Iniciar Sesión
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 px-4 bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white font-bold rounded-xl shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                                    <span>Procesando...</span>
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined">{isLogin ? 'login' : 'person_add'}</span>
                                    <span>{isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}</span>
                                </>
                            )}
                        </button>
                    </form>

                    {/* Benefits */}
                    {!isLogin && (
                        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">
                                Beneficios de registrarte
                            </p>
                            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                <li className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-green-500 text-base">check_circle</span>
                                    Guarda tu historial de cálculos
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-green-500 text-base">check_circle</span>
                                    Accede desde cualquier dispositivo
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-green-500 text-base">check_circle</span>
                                    100% gratis, sin compromiso
                                </li>
                            </ul>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <p className="text-center text-xs text-gray-400 mt-6">
                    Al continuar, aceptas nuestros{' '}
                    <Link href="/terms" className="underline hover:text-gray-600">Términos de Servicio</Link>
                    {' '}y{' '}
                    <Link href="/privacy" className="underline hover:text-gray-600">Política de Privacidad</Link>
                </p>
            </div>
        </div>
    );
}
