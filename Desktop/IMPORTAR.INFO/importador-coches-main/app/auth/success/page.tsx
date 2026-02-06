'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '../../utils/supabase-client';

export default function AuthSuccessPage() {
    const router = useRouter();
    const supabase = createClient();
    const [status, setStatus] = useState<string>('Verificando sesión...');
    const [debugInfo, setDebugInfo] = useState<string>('');

    useEffect(() => {
        const checkSession = async () => {
            try {
                // 1. Get Session
                const { data, error } = await supabase.auth.getSession();

                if (error) {
                    setStatus('Error al verificar sesión');
                    setDebugInfo(error.message);
                    return;
                }

                if (data.session) {
                    setStatus('¡Sesión confirmada! Redirigiendo...');
                    setDebugInfo(`Usuario: ${data.session.user.email}`);

                    // 2. Force refresh to propagate cookies
                    router.refresh();

                    // 3. Redirect forcing full reload
                    setTimeout(() => {
                        window.location.href = '/search';
                    }, 1000);
                } else {
                    setStatus('No se encontró sesión activa.');
                    setDebugInfo('El servidor no devolvió una sesión válida. Intenta iniciar sesión de nuevo.');
                    // Optional: Try refreshing session again after a delay
                }
            } catch (err: any) {
                setStatus('Excepción crítica');
                setDebugInfo(err.toString());
            }
        };

        checkSession();
    }, [router, supabase]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
            <div className="w-full max-w-md text-center p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 animate-fade-in">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                    <span className="material-symbols-outlined text-4xl text-blue-600 dark:text-blue-400 animate-pulse">sync</span>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{status}</h2>

                {debugInfo && (
                    <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-900 rounded text-xs font-mono text-left break-all text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
                        {debugInfo}
                    </div>
                )}

                <div className="mt-6 flex justify-center">
                    <div className="h-2 w-24 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 animate-progress"></div>
                    </div>
                </div>

                <div className="mt-6">
                    <button
                        onClick={() => router.push('/auth')}
                        className="text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white underline"
                    >
                        ¿Atascado? Volver al login
                    </button>
                </div>
            </div>
            <style jsx>{`
                @keyframes progress {
                    0% { width: 0%; }
                    100% { width: 100%; }
                }
                .animate-progress {
                    animation: progress 2s ease-out infinite;
                }
                .animate-fade-in {
                    animation: fadeIn 0.5s ease-out;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}
