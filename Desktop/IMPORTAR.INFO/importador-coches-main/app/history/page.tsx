'use client';

import { useEffect, useState } from 'react';
import { createClient } from '../utils/supabase-client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import { getHistory, deleteFromHistory } from '../utils/history';
import { useAuth } from '../context/AuthContext';

interface CalculationHistory {
    id: string;
    car_name?: string;
    import_price?: number;
    total_cost?: number;
    calculation_date?: string;
    details?: {
        title: string;
        imgUrl: string;
        carData?: {
            price: number;
            firstRegistrationDate: string | Date;
            co2Emissions: number;
            isProfessionalSeller: boolean;
        };
        costs: any;
    };
    created_at?: string;
    url?: string;
}

export default function HistoryPage() {
    const router = useRouter();
    const [history, setHistory] = useState<CalculationHistory[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const supabase = createClient();

    useEffect(() => {
        const fetchHistory = async () => {
            console.log('[History] Starting fetchHistory...');

            // Always try local storage first as a fallback
            const localHistory = getHistory();
            console.log('[History] Local storage has', localHistory.length, 'items');

            const { data: { session } } = await supabase.auth.getSession();
            console.log('[History] Session:', session ? 'LOGGED IN as ' + session.user.id : 'NOT LOGGED IN');

            if (session) {
                // Fetch from Supabase
                const { data, error } = await supabase
                    .from('imports')
                    .select('*')
                    .eq('user_id', session.user.id)
                    .order('created_at', { ascending: false });

                console.log('[History] Supabase query result - data:', data?.length || 0, 'items, error:', error);

                if (data && data.length > 0) {
                    setHistory(data.map((item: any) => ({
                        id: item.id,
                        car_name: item.details?.title || 'Vehículo',
                        import_price: item.details?.carData?.price || 0,
                        total_cost: item.details?.costs?.total || 0,
                        calculation_date: item.created_at,
                        details: item.details,
                        url: item.url
                    })));
                } else if (localHistory.length > 0) {
                    // Fallback to local storage if Supabase is empty
                    console.log('[History] Supabase empty, using localStorage');
                    setHistory(localHistory.map(item => ({
                        id: item.id,
                        car_name: item.title,
                        import_price: item.carData.price,
                        total_cost: item.costs.total,
                        calculation_date: item.date,
                        details: {
                            title: item.title,
                            imgUrl: item.imgUrl,
                            carData: item.carData,
                            costs: item.costs,
                        },
                        url: (item as any).url
                    })));
                }
            } else {
                // Not logged in, use local storage
                console.log('[History] Not logged in, using localStorage');
                if (localHistory.length > 0) {
                    setHistory(localHistory.map(item => ({
                        id: item.id,
                        car_name: item.title,
                        import_price: item.carData.price,
                        total_cost: item.costs.total,
                        calculation_date: item.date,
                        details: {
                            title: item.title,
                            imgUrl: item.imgUrl,
                            carData: item.carData,
                            costs: item.costs,
                        },
                        url: (item as any).url
                    })));
                }
            }
            setLoading(false);
        };

        fetchHistory();
    }, [user]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            month: 'short',
            year: 'numeric',
        });
    };

    const handleDelete = async (id: string) => {
        if (!confirm('¿Eliminar este cálculo del historial?')) return;

        if (user) {
            // Delete from Supabase
            await supabase.from('imports').delete().eq('id', id);
        }
        // Delete from local storage
        deleteFromHistory(id);
        setHistory(prev => prev.filter(item => item.id !== id));
    };

    const getDetailsUrl = (item: CalculationHistory) => {
        const params = new URLSearchParams();
        const details = (item.details || {}) as any;
        const cData = (details.carData || {}) as any;

        // Price
        if (cData.price) params.set('price', cData.price.toString());
        else if (item.import_price) params.set('price', item.import_price.toString());

        // Date
        if (cData.firstRegistrationDate) {
            const d = typeof cData.firstRegistrationDate === 'string'
                ? cData.firstRegistrationDate
                : new Date(cData.firstRegistrationDate).toISOString();
            params.set('date', d);
        } else {
            params.set('date', new Date().toISOString());
        }

        // CO2 & Pro
        if (cData.co2Emissions) params.set('co2', cData.co2Emissions.toString());
        if (cData.isProfessionalSeller !== undefined) params.set('pro', cData.isProfessionalSeller.toString());

        // Title & Image
        if (details.title) params.set('title', details.title);
        else if (item.car_name) params.set('title', item.car_name);

        if (details.imgUrl) params.set('img', details.imgUrl);

        // Original URL
        if (item.url) params.set('url', item.url);

        const url = `/results?${params.toString()}`;
        console.log('[History] Generated URL for Ver Detalles:', url);
        return url;
    };

    return (
        <div className="min-h-screen bg-[#fafbfc] dark:bg-gray-950 flex flex-col">
            <Header />

            {/* Hero Section */}
            <div className="bg-gradient-to-br from-primary via-blue-600 to-purple-700 text-white">
                <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12 lg:py-16 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6">
                        <div>
                            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-1 sm:mb-2">
                                Mis Cálculos
                            </h1>
                            <p className="text-white/80 text-sm sm:text-base lg:text-lg">
                                Revisa y compara tus presupuestos de importación
                            </p>
                        </div>
                        <Link
                            href="/search"
                            className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-white text-primary font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all text-sm sm:text-base"
                        >
                            <span className="material-symbols-outlined text-lg sm:text-xl">add</span>
                            Nueva Búsqueda
                        </Link>
                    </div>

                    {/* Stats */}
                    {history.length > 0 && (
                        <div className="mt-6 sm:mt-8 lg:mt-10 grid grid-cols-3 gap-2 sm:gap-4 lg:gap-6">
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4">
                                <p className="text-xl sm:text-2xl lg:text-3xl font-black">{history.length}</p>
                                <p className="text-[10px] sm:text-xs lg:text-sm text-white/70">Cálculos guardados</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4">
                                <p className="text-lg sm:text-xl lg:text-3xl font-black truncate">
                                    {formatCurrency(history.reduce((sum, item) => sum + (item.total_cost || 0), 0) / history.length)}
                                </p>
                                <p className="text-[10px] sm:text-xs lg:text-sm text-white/70">Coste promedio</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-3 sm:p-4">
                                <p className="text-lg sm:text-xl lg:text-3xl font-black truncate">
                                    {formatCurrency(Math.min(...history.map(item => item.total_cost || Infinity)))}
                                </p>
                                <p className="text-[10px] sm:text-xs lg:text-sm text-white/70">Mejor oferta</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 py-6 sm:py-8 lg:py-10 sm:px-6 lg:px-8 flex-grow w-full">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-16 sm:py-20">
                        <div className="relative">
                            <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full border-4 border-gray-200 dark:border-gray-700"></div>
                            <div className="absolute inset-0 h-12 w-12 sm:h-16 sm:w-16 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                        </div>
                        <p className="mt-4 text-gray-500 text-sm sm:text-base">Cargando historial...</p>
                    </div>
                ) : history.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
                        {history.map((item, idx) => (
                            <div
                                key={item.id}
                                className="group bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:-translate-y-1"
                                style={{ animationDelay: `${idx * 50}ms` }}
                            >
                                {/* Image */}
                                <div className="relative h-32 sm:h-36 lg:h-40 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600">
                                    {item.details?.imgUrl ? (
                                        <img
                                            src={item.details.imgUrl}
                                            alt={item.car_name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <span className="material-symbols-outlined text-4xl sm:text-5xl lg:text-6xl text-gray-300 dark:text-gray-500">directions_car</span>
                                        </div>
                                    )}
                                    {/* Delete Button */}
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="absolute top-2 right-2 sm:top-3 sm:right-3 p-1.5 sm:p-2 bg-white/90 dark:bg-gray-800/90 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 dark:hover:bg-red-900/30 text-gray-400 hover:text-red-500"
                                    >
                                        <span className="material-symbols-outlined text-base sm:text-lg">delete</span>
                                    </button>
                                    {/* Date Badge */}
                                    <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 px-2 sm:px-3 py-0.5 sm:py-1 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg text-[10px] sm:text-xs font-medium text-gray-600 dark:text-gray-300">
                                        {formatDate(item.calculation_date || new Date().toISOString())}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-4 sm:p-5">
                                    <h3 className="font-bold text-gray-900 dark:text-white text-sm sm:text-base lg:text-lg mb-2 sm:mb-3 line-clamp-2">
                                        {item.car_name || 'Vehículo'}
                                    </h3>

                                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                                        <div>
                                            <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wide">Precio base</p>
                                            <p className="font-semibold text-gray-700 dark:text-gray-300 text-xs sm:text-sm lg:text-base">
                                                {formatCurrency(item.import_price || 0)}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wide">Coste total</p>
                                            <p className="font-black text-base sm:text-lg lg:text-xl text-primary">
                                                {formatCurrency(item.total_cost || 0)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* View Details Button */}
                                    <button
                                        onClick={() => {
                                            const url = getDetailsUrl(item);
                                            console.log('[History] Navigating to:', url);
                                            window.location.href = url;
                                        }}
                                        className="block w-full py-2.5 sm:py-3 px-3 sm:px-4 bg-gray-100 dark:bg-gray-700 hover:bg-primary hover:text-white text-gray-700 dark:text-gray-300 rounded-lg sm:rounded-xl font-medium transition-all text-center cursor-pointer text-sm sm:text-base"
                                    >
                                        Ver Detalles →
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 sm:p-10 lg:p-12 text-center max-w-lg mx-auto">
                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                            <span className="material-symbols-outlined text-3xl sm:text-4xl lg:text-5xl text-primary">calculate</span>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2 sm:mb-3">
                            Sin cálculos todavía
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-6 sm:mb-8 text-sm sm:text-base">
                            Empieza a calcular importaciones para ver tu historial aquí. Podrás comparar opciones y tomar la mejor decisión.
                        </p>
                        <Link
                            href="/search"
                            className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-primary to-blue-600 text-white font-bold rounded-xl shadow-lg shadow-primary/30 hover:shadow-xl hover:-translate-y-0.5 transition-all text-sm sm:text-base"
                        >
                            <span className="material-symbols-outlined text-lg sm:text-xl">search</span>
                            Hacer mi Primera Búsqueda
                        </Link>

                        {!user && (
                            <p className="mt-4 sm:mt-6 text-xs sm:text-sm text-gray-400">
                                <Link href="/auth" className="text-primary font-medium hover:underline">Regístrate</Link> para guardar tu historial en la nube
                            </p>
                        )}
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 py-6 sm:py-8 mt-auto">
                <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="h-7 w-7 sm:h-9 sm:w-9 bg-gradient-to-br from-primary to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center text-white font-bold text-sm sm:text-base shadow-lg">I</div>
                        <span className="font-bold text-gray-900 dark:text-white text-sm sm:text-base">Importar<span className="text-primary">.info</span></span>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-500 text-center sm:text-left">
                        © {new Date().getFullYear()} Importar.info - Todos los derechos reservados
                    </p>
                </div>
            </footer>
        </div>
    );
}
