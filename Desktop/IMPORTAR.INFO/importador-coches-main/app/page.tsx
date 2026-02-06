"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "./components/Header";
import { useAuth } from "./context/AuthContext";
import { useEffect, useState, Suspense } from "react";

function AuthCallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get('code');
    if (code) {
      console.log("Detected auth code on Home page, forwarding to callback...");
      router.push(`/auth/callback?code=${code}`);
    }
  }, [searchParams, router]);

  return null;
}

export default function Home() {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const features = [
    {
      icon: "link",
      title: "Pega el Enlace",
      desc: "Copia la URL de tu coche favorito de mobile.de o AutoScout24.",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: "calculate",
      title: "Cálculo Instantáneo",
      desc: "Obtenemos precio, IVA, ITP, matriculación y todos los gastos en segundos.",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: "savings",
      title: "Ahorra Miles de €",
      desc: "Conoce el coste real antes de comprar. Sin sorpresas ni costes ocultos.",
      gradient: "from-amber-500 to-orange-500"
    },
  ];

  const stats = [
    { value: "10K+", label: "Cálculos realizados" },
    { value: "€2.5M", label: "Ahorro estimado" },
    { value: "98%", label: "Precisión" },
  ];

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-[#fafbfc] dark:bg-gray-950">
      <Suspense fallback={null}>
        <AuthCallbackHandler />
      </Suspense>

      <div className="layout-container flex h-full grow flex-col">
        <Header />

        {/* Hero Section */}
        <main className="flex-grow relative">
          {/* Animated Background Gradients */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-[40%] -right-[20%] w-[80%] h-[80%] bg-gradient-to-br from-primary/30 via-blue-400/20 to-transparent blur-[100px] rounded-full animate-pulse-slow"></div>
            <div className="absolute top-[50%] -left-[20%] w-[60%] h-[60%] bg-gradient-to-tr from-purple-600/20 via-pink-500/10 to-transparent blur-[100px] rounded-full animate-pulse-slow animation-delay-2000"></div>
            <div className="absolute bottom-0 right-[30%] w-[40%] h-[40%] bg-gradient-to-t from-cyan-400/15 to-transparent blur-[80px] rounded-full animate-pulse-slow animation-delay-4000"></div>
          </div>

          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:50px_50px] dark:bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)]"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 relative z-10">


            {/* Main Heading */}
            <div className={`text-center max-w-4xl mx-auto ${mounted ? 'animate-slide-up' : 'opacity-0'}`}>
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-gray-900 dark:text-white mb-6 leading-[1.1]">
                Importa tu coche
                <br />
                <span className="relative">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-500 to-purple-600 bg-[length:200%_auto] animate-gradient">
                    sin complicaciones
                  </span>
                </span>
              </h1>

              <p className="mt-6 text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
                La calculadora más precisa de España para importar coches de Alemania.
                <span className="text-primary font-semibold"> Calcula impuestos, matriculación y transporte</span> en segundos.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className={`mt-10 flex flex-col sm:flex-row justify-center items-center gap-4 ${mounted ? 'animate-slide-up' : 'opacity-0'}`} style={{ animationDelay: '0.1s' }}>
              <Link
                href={user ? "/search" : "/auth"}
                className="group w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-primary text-white rounded-2xl font-bold text-lg shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3"
              >
                <span className="material-symbols-outlined text-xl">rocket_launch</span>
                <span>{user ? "Nueva Búsqueda" : "Empezar Gratis"}</span>
                <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </Link>
              <Link
                href="/search"
                className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-white border-2 border-gray-200 dark:border-gray-700 rounded-2xl font-bold text-lg hover:border-primary/50 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">calculate</span>
                <span>Probar Calculadora</span>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className={`mt-12 flex flex-wrap justify-center items-center gap-6 ${mounted ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-green-500">verified</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">100% Gratis</span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-gray-300 dark:bg-gray-600"></div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-green-500">lock</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">Datos seguros</span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-gray-300 dark:bg-gray-600"></div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-green-500">speed</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">Resultado instantáneo</span>
              </div>
            </div>

            {/* Platform Logos */}
            <div className={`mt-16 ${mounted ? 'animate-fade-in' : 'opacity-0'}`} style={{ animationDelay: '0.3s' }}>
              <p className="text-center text-xs text-gray-400 font-semibold uppercase tracking-widest mb-6">Compatible con los principales portales</p>
              <div className="flex justify-center items-center gap-8 opacity-75 hover:opacity-100 transition-opacity filter grayscale hover:grayscale-0 duration-300">
                {/* mobile.de */}
                <div className="flex items-baseline tracking-tighter select-none">
                  <span className="text-3xl font-black text-gray-800 dark:text-gray-100">mobile</span>
                  <span className="text-3xl font-black text-[#ff6600]">.de</span>
                </div>

                {/* Separator */}
                <div className="w-px h-8 bg-gray-300 dark:bg-gray-700 hidden sm:block"></div>

                {/* AutoScout24 */}
                <div className="flex items-baseline tracking-tight select-none">
                  <span className="text-2xl font-black text-gray-800 dark:text-gray-100">AutoScout</span>
                  <span className="ml-0.5 px-1.5 py-0.5 bg-[#F2BF00] text-gray-900 text-sm font-bold rounded shadow-sm">24</span>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Stats Section */}
        <section className="py-12 bg-white dark:bg-gray-900 border-y border-gray-200 dark:border-gray-800 relative z-10">
          <div className="max-w-5xl mx-auto px-4">
            <div className="grid grid-cols-3 gap-8">
              {stats.map((stat, idx) => (
                <div key={idx} className="text-center">
                  <p className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">{stat.value}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">¿Cómo funciona?</span>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
                Tan simple como <span className="text-gradient">1, 2, 3</span>
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Olvídate de hojas de cálculo complicadas. Nosotros hacemos los números por ti.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, idx) => (
                <div
                  key={idx}
                  className="group relative p-8 rounded-3xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                >
                  {/* Step Number */}
                  <div className="absolute -top-4 -left-4 w-10 h-10 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl flex items-center justify-center font-black text-lg shadow-lg">
                    {idx + 1}
                  </div>

                  {/* Icon */}
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}>
                    <span className="material-symbols-outlined text-3xl">{feature.icon}</span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{feature.desc}</p>

                  {/* Decorative Arrow */}
                  {idx < features.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-4 transform translate-x-full -translate-y-1/2 text-gray-300 dark:text-gray-600">
                      <span className="material-symbols-outlined text-3xl">chevron_right</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 relative overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-blue-600 to-purple-700"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yIDItNCAyLTRzLTItMi00LTJoLTRjLTIgMC00IDItNCAyczIgNCAyIDRoNGMyIDAgNC0yIDQtMnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30"></div>

          <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              ¿Listo para importar tu coche?
            </h2>
            <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
              Únete a miles de usuarios que ya han calculado el coste de importar su vehículo con Importar.info
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/search"
                className="px-10 py-5 bg-white text-primary rounded-2xl font-bold text-lg shadow-2xl hover:shadow-white/30 hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">calculate</span>
                Calcular Ahora
              </Link>
              {!user && (
                <Link
                  href="/auth"
                  className="px-10 py-5 bg-white/10 text-white border-2 border-white/30 rounded-2xl font-bold text-lg hover:bg-white/20 transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined">person_add</span>
                  Crear Cuenta Gratis
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white pt-16 pb-8">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
              {/* Brand */}
              <div className="md:col-span-2">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 bg-gradient-to-br from-primary to-purple-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg">
                    I
                  </div>
                  <span className="text-2xl font-bold">
                    Importar<span className="text-primary">.info</span>
                  </span>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed max-w-md">
                  La calculadora más precisa de España para importar vehículos de Alemania. Calcula impuestos, matriculación y todos los gastos en segundos.
                </p>
              </div>

              {/* Links */}
              <div>
                <h4 className="font-bold text-sm uppercase tracking-wider mb-4 text-gray-400">Producto</h4>
                <ul className="space-y-3 text-sm">
                  <li><Link href="/search" className="text-gray-300 hover:text-white transition-colors">Calculadora</Link></li>
                  <li><Link href="/#how-it-works" className="text-gray-300 hover:text-white transition-colors">Cómo Funciona</Link></li>
                  <li><Link href="/auth" className="text-gray-300 hover:text-white transition-colors">Crear Cuenta</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-sm uppercase tracking-wider mb-4 text-gray-400">Legal</h4>
                <ul className="space-y-3 text-sm">
                  <li><Link href="/privacy" className="text-gray-300 hover:text-white transition-colors">Privacidad</Link></li>
                  <li><Link href="/terms" className="text-gray-300 hover:text-white transition-colors">Términos</Link></li>
                  <li><Link href="/contact" className="text-gray-300 hover:text-white transition-colors">Contacto</Link></li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-gray-500">
                © {new Date().getFullYear()} Importar.info. Todos los derechos reservados.
              </p>
              <div className="flex items-center gap-4">
                <span className="text-xs text-gray-600">Hecho con ❤️ en España</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
