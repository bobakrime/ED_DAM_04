'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

function AuthCodeErrorContent() {
    const searchParams = useSearchParams();
    const error = searchParams.get('error');

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4">
            <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center shadow-lg dark:bg-red-900/20 dark:border-red-800">
                <span className="material-symbols-outlined mb-4 text-4xl text-red-600">error</span>
                <h1 className="mb-2 text-2xl font-bold text-red-700 dark:text-red-400">Error de Autenticación</h1>
                <p className="mb-6 text-gray-600 dark:text-gray-300">
                    Ocurrió un problema al intentar iniciar sesión con Google.
                </p>

                {error && (
                    <div className="mb-6 rounded bg-white p-3 font-mono text-xs text-red-600 shadow-sm dark:bg-black/20">
                        {error}
                    </div>
                )}

                <Link
                    href="/auth"
                    className="inline-block rounded-lg bg-red-600 px-6 py-2 font-bold text-white hover:bg-red-700 active:transform active:scale-95 transition-all"
                >
                    Volver a intentar
                </Link>
            </div>
        </div>
    );
}

export default function AuthCodeErrorPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Cargando...</div>}>
            <AuthCodeErrorContent />
        </Suspense>
    );
}
