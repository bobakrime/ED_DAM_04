'use client';

import { useEffect, useState } from 'react';
import { createClient } from '../../utils/supabase-client';
import Link from 'next/link';

export default function AuthCallbackPage() {
    const [status, setStatus] = useState('Verificando credenciales');
    const [step, setStep] = useState(1);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const supabase = createClient();

        // Progress simulation for better UX
        const progressSteps = [
            { step: 1, text: 'Verificando credenciales', delay: 500 },
            { step: 2, text: 'Estableciendo sesión segura', delay: 1200 },
            { step: 3, text: 'Preparando tu cuenta', delay: 2000 },
        ];

        progressSteps.forEach(({ step: s, text, delay }) => {
            setTimeout(() => {
                if (!error) {
                    setStep(s);
                    setStatus(text);
                }
            }, delay);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            console.log('[Callback] Auth state change:', event, session?.user?.email);

            if (event === 'SIGNED_IN' && session) {
                setStep(4);
                setStatus('¡Bienvenido! Redirigiendo...');
                setTimeout(() => {
                    window.location.href = '/search';
                }, 800);
            } else if (event === 'SIGNED_OUT') {
                setError('La sesión ha expirado');
            }
        });

        const checkSession = async () => {
            await new Promise(resolve => setTimeout(resolve, 1500));

            const { data: { session }, error: sessionError } = await supabase.auth.getSession();

            if (sessionError) {
                console.error('[Callback] Session error:', sessionError);
                setError(sessionError.message);
                return;
            }

            if (session) {
                console.log('[Callback] Session found:', session.user.email);
                setStep(4);
                setStatus('¡Bienvenido! Redirigiendo...');
                window.location.href = '/search';
            } else {
                const urlParams = new URLSearchParams(window.location.search);
                const code = urlParams.get('code');
                const errorParam = urlParams.get('error');

                if (errorParam) {
                    setError(urlParams.get('error_description') || errorParam);
                } else if (code) {
                    await new Promise(resolve => setTimeout(resolve, 2500));
                    const { data: { session: retrySession } } = await supabase.auth.getSession();
                    if (retrySession) {
                        setStep(4);
                        setStatus('¡Bienvenido! Redirigiendo...');
                        window.location.href = '/search';
                    } else {
                        setError('No se pudo establecer la sesión. Por favor, intenta de nuevo.');
                    }
                } else {
                    setError('No se recibieron parámetros de autenticación');
                }
            }
        };

        checkSession();

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const steps = [
        { id: 1, label: 'Verificación', icon: 'shield' },
        { id: 2, label: 'Conexión', icon: 'lock' },
        { id: 3, label: 'Preparación', icon: 'tune' },
        { id: 4, label: 'Listo', icon: 'check_circle' },
    ];

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -left-20 w-96 h-96 bg-primary/30 blur-[120px] rounded-full animate-pulse"></div>
                <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-500/30 blur-[120px] rounded-full animate-pulse animation-delay-2000"></div>
            </div>

            <div className="relative z-10 w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-3">
                        <div className="h-14 w-14 bg-gradient-to-br from-primary to-purple-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-primary/30">
                            I
                        </div>
                        <span className="text-3xl font-extrabold text-gray-900 dark:text-white">
                            Importar<span className="text-primary">.info</span>
                        </span>
                    </Link>
                </div>

                {/* Card */}
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 p-8 md:p-10">
                    {!error ? (
                        <>
                            {/* Animated Loading Icon */}
                            <div className="relative mx-auto mb-8 w-24 h-24">
                                <div className="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-gray-700"></div>
                                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin"></div>
                                <div className="absolute inset-2 rounded-full bg-gradient-to-br from-primary/10 to-purple-500/10 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-4xl text-primary animate-pulse">
                                        {step === 4 ? 'check_circle' : 'fingerprint'}
                                    </span>
                                </div>
                            </div>

                            {/* Status */}
                            <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-2">
                                {status}
                            </h2>
                            <p className="text-center text-gray-500 dark:text-gray-400 text-sm mb-8">
                                Esto solo tomará un momento
                            </p>

                            {/* Progress Steps */}
                            <div className="flex justify-between items-center mb-6 px-2">
                                {steps.map((s, index) => (
                                    <div key={s.id} className="flex flex-col items-center relative">
                                        {/* Connector Line */}
                                        {index < steps.length - 1 && (
                                            <div className={`absolute top-4 left-1/2 w-full h-0.5 transition-colors duration-500 ${step > s.id ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
                                        )}

                                        {/* Step Circle */}
                                        <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${step > s.id
                                                ? 'bg-primary text-white'
                                                : step === s.id
                                                    ? 'bg-primary/20 text-primary ring-4 ring-primary/30'
                                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-400'
                                            }`}>
                                            <span className="material-symbols-outlined text-sm">
                                                {step > s.id ? 'check' : s.icon}
                                            </span>
                                        </div>

                                        {/* Label */}
                                        <span className={`text-xs mt-2 font-medium transition-colors ${step >= s.id ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400'
                                            }`}>
                                            {s.label}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Security Badge */}
                            <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                                <span className="material-symbols-outlined text-sm text-green-500">verified_user</span>
                                Conexión segura con SSL
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Error State */}
                            <div className="mx-auto mb-6 w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                                <span className="material-symbols-outlined text-5xl text-red-500">error_outline</span>
                            </div>

                            <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-2">
                                Error de autenticación
                            </h2>

                            <p className="text-center text-gray-600 dark:text-gray-400 mb-6 text-sm bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-200 dark:border-red-800">
                                {error}
                            </p>

                            <div className="flex flex-col gap-3">
                                <Link
                                    href="/auth"
                                    className="w-full py-3 px-4 bg-gradient-to-r from-primary to-primary-dark text-white rounded-xl font-semibold text-center hover:shadow-lg hover:shadow-primary/30 transition-all"
                                >
                                    Volver a intentar
                                </Link>
                                <Link
                                    href="/"
                                    className="w-full py-3 px-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold text-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                                >
                                    Ir al inicio
                                </Link>
                            </div>
                        </>
                    )}
                </div>

                {/* Footer */}
                <p className="text-center text-xs text-gray-400 mt-6">
                    © {new Date().getFullYear()} Importar.info - Todos los derechos reservados
                </p>
            </div>
        </div>
    );
}
