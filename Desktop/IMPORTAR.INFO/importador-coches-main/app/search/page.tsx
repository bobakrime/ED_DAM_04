"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../components/Header";
import { useAuth } from "../context/AuthContext";
import Link from "next/link";

export default function SearchPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [url, setUrl] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!url.trim()) return;

        setIsSubmitting(true);
        router.push(`/results?url=${encodeURIComponent(url)}`);
    };

    const exampleUrls = [
        { brand: "BMW", model: "Serie 3", price: "25.000€" },
        { brand: "Mercedes", model: "Clase C", price: "32.000€" },
        { brand: "Audi", model: "A4", price: "28.000€" },
    ];

    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-[#fafbfc] dark:bg-gray-950">
            <div className="layout-container flex h-full grow flex-col">
                <Header />

                <main className="flex-grow flex flex-col justify-center relative py-12">
                    {/* Animated Background */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-primary/20 via-blue-400/10 to-transparent blur-[100px] rounded-full"></div>
                        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-purple-600/15 via-pink-500/10 to-transparent blur-[100px] rounded-full"></div>
                    </div>

                    {/* Grid Pattern */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.015)_1px,transparent_1px)] bg-[size:40px_40px] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)]"></div>

                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
                        {/* Welcome Badge */}


                        {/* Main Heading */}
                        <div className="text-center mb-10">
                            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-gray-900 dark:text-white mb-4 leading-tight">
                                Calcula tu <span className="text-gradient">importación</span>
                            </h1>
                            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
                                Pega el enlace del coche que te interesa y obtén un presupuesto detallado en segundos
                            </p>
                        </div>

                        {/* Search Form Card */}
                        <div className={`bg-white dark:bg-gray-800/80 rounded-3xl shadow-2xl border-2 transition-all duration-300 ${isFocused
                            ? 'border-primary shadow-primary/20'
                            : 'border-gray-100 dark:border-gray-700'
                            } p-6 sm:p-8 md:p-10 backdrop-blur-xl`}>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* URL Input */}
                                <div>
                                    <label htmlFor="car-url" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary">link</span>
                                        URL del vehículo
                                    </label>
                                    <div className="relative group">
                                        <div className={`absolute inset-0 bg-gradient-to-r from-primary to-purple-600 rounded-2xl blur-lg opacity-0 group-hover:opacity-20 transition-opacity duration-300 ${isFocused ? 'opacity-30' : ''}`}></div>
                                        <input
                                            id="car-url"
                                            type="url"
                                            value={url}
                                            onChange={(e) => setUrl(e.target.value)}
                                            onFocus={() => setIsFocused(true)}
                                            onBlur={() => setIsFocused(false)}
                                            className="relative w-full bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-0 focus:border-primary px-5 py-5 text-lg transition-all"
                                            placeholder="https://www.mobile.de/..."
                                            required
                                        />
                                    </div>
                                    <p className="mt-3 text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-base text-primary">lightbulb</span>
                                        Copia el enlace completo desde mobile.de o AutoScout24
                                    </p>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isSubmitting || !url.trim()}
                                    className="w-full bg-gradient-to-r from-primary via-blue-500 to-primary bg-[length:200%_auto] hover:bg-right text-white px-8 py-5 rounded-2xl font-bold text-lg transition-all duration-500 shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-xl flex items-center justify-center gap-3 group"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <span className="h-6 w-6 animate-spin rounded-full border-3 border-white border-t-transparent"></span>
                                            <span>Analizando vehículo...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="material-symbols-outlined text-2xl">calculate</span>
                                            <span>Calcular Costes de Importación</span>
                                            <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                        </>
                                    )}
                                </button>
                            </form>

                            {/* Features */}
                            <div className="mt-10 pt-8 border-t border-gray-100 dark:border-gray-700">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {[
                                        { icon: "speed", text: "Resultado instantáneo" },
                                        { icon: "verified", text: "Datos precisos" },
                                        { icon: "euro", text: "Sin costes ocultos" },
                                        { icon: "download", text: "Exporta a PDF" },
                                    ].map((feature, idx) => (
                                        <div key={idx} className="flex flex-col items-center text-center p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                            <span className="material-symbols-outlined text-2xl text-primary mb-2">{feature.icon}</span>
                                            <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">{feature.text}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Example Cars */}
                        <div className="mt-12">
                            <p className="text-center text-sm text-gray-400 font-medium mb-6">
                                Coches populares que nuestros usuarios han calculado
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {exampleUrls.map((car, idx) => (
                                    <div
                                        key={idx}
                                        className="group p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-primary/30 hover:shadow-lg transition-all cursor-pointer"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="h-12 w-12 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                                <span className="material-symbols-outlined text-gray-400 group-hover:text-primary">directions_car</span>
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900 dark:text-white">{car.brand} {car.model}</p>
                                                <p className="text-sm text-gray-500">Desde {car.price}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
                            <Link
                                href="/history"
                                className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-medium border border-gray-200 dark:border-gray-700 hover:border-primary/50 hover:text-primary transition-all"
                            >
                                <span className="material-symbols-outlined">history</span>
                                Ver Historial
                            </Link>
                            <Link
                                href="/"
                                className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors text-sm font-medium"
                            >
                                <span className="material-symbols-outlined">home</span>
                                Volver al Inicio
                            </Link>
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 py-8 mt-auto">
                    <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-3">
                            <div className="h-9 w-9 bg-gradient-to-br from-primary to-purple-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">I</div>
                            <span className="font-bold text-gray-900 dark:text-white">Importar<span className="text-primary">.info</span></span>
                        </div>
                        <p className="text-sm text-gray-500">
                            © {new Date().getFullYear()} Importar.info - La calculadora de importación más precisa de España
                        </p>
                    </div>
                </footer>
            </div>
        </div>
    );
}
