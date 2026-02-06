'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import Header from "../components/Header";
import LeadCapture from "../components/LeadCapture";
import { calculateImportCosts, CarData, CostBreakdown } from "../utils/calculator";
import { lookupCO2Emissions, parseCarTitle, CO2LookupResult } from "../utils/co2-lookup";

interface ResultsClientProps {
    initialCarData: CarData;
    initialScrapedInfo: {
        title: string;
        imgUrl: string;
        error?: string;
    };
    searchUrl?: string;
}

// Extended car data with additional fields for CO2 lookup
interface ExtendedCarData extends CarData {
    brand?: string;
    model?: string;
    fuelType?: string;
}

// Comprehensive database of car brands and models for suggestions
const CAR_DATABASE: Record<string, string[]> = {
    "Mercedes": ["Clase A", "Clase B", "Clase C", "Clase E", "Clase S", "CLA", "CLS", "GLA", "GLB", "GLC", "GLE", "GLS", "Clase G", "SL", "AMG GT", "EQA", "EQB", "EQC", "EQE", "EQS"],
    "BMW": ["Serie 1", "Serie 2", "Serie 3", "Serie 4", "Serie 5", "Serie 6", "Serie 7", "Serie 8", "X1", "X2", "X3", "X4", "X5", "X6", "X7", "Z4", "i3", "i4", "iX", "iX1", "iX3"],
    "Audi": ["A1", "A3", "A4", "A5", "A6", "A7", "A8", "Q2", "Q3", "Q4 e-tron", "Q5", "Q7", "Q8", "TT", "R8", "e-tron", "e-tron GT"],
    "Volkswagen": ["Golf", "Polo", "Passat", "Tiguan", "Touareg", "T-Roc", "T-Cross", "Arteon", "Touran", "ID.3", "ID.4", "ID.5", "ID.Buzz", "Caddy", "Multivan"],
    "Seat": ["Ibiza", "Leon", "Arona", "Ateca", "Tarraco"],
    "Cupra": ["Formentor", "Leon", "Ateca", "Born", "Tavascan"],
    "Skoda": ["Fabia", "Scala", "Octavia", "Superb", "Kamiq", "Karoq", "Kodiaq", "Enyaq"],
    "Porsche": ["911", "Cayenne", "Macan", "Panamera", "Taycan", "718 Boxster", "718 Cayman"],
    "Toyota": ["Yaris", "Corolla", "C-HR", "RAV4", "Land Cruiser", "Hilux", "Prius", "Supra", "Aygo X", "bZ4X"],
    "Ford": ["Fiesta", "Focus", "Puma", "Kuga", "Mustang Mach-E", "Mustang", "Explorer", "Ranger", "Tourneo"],
    "Hyundai": ["i10", "i20", "i30", "Kona", "Tucson", "Santa Fe", "IONIQ 5", "IONIQ 6", "Bayon"],
    "Kia": ["Picanto", "Rio", "Ceed", "XCeed", "Niro", "Sportage", "Sorento", "EV6", "Stonic"],
    "Renault": ["Clio", "Captur", "Arkana", "Austral", "Megane", "Espace", "Rafale", "Zoe", "Megane E-Tech"],
    "Peugeot": ["208", "2008", "308", "3008", "408", "508", "5008", "Rifter"],
    "Citroen": ["C3", "C3 Aircross", "C4", "C4 X", "C5 Aircross", "C5 X", "Berlingo"],
    "Volvo": ["XC40", "XC60", "XC90", "C40", "S60", "S90", "V60", "V90", "EX30", "EX90"],
    "Land Rover": ["Defender", "Discovery", "Discovery Sport", "Range Rover", "Range Rover Sport", "Range Rover Velar", "Range Rover Evoque"],
    "Mini": ["Cooper", "Countryman", "Clubman", "Aceman"],
    "Tesla": ["Model 3", "Model Y", "Model S", "Model X"],
    "Fiat": ["500", "500e", "Panda", "Tipo", "600"],
    "Nissan": ["Juke", "Qashqai", "X-Trail", "Ariya", "Leaf"]
};

export default function ResultsClient({ initialCarData, initialScrapedInfo, searchUrl }: ResultsClientProps) {
    const [carData, setCarData] = useState<ExtendedCarData>({
        ...initialCarData,
        firstRegistrationDate: new Date(initialCarData.firstRegistrationDate),
        brand: '',
        model: '',
        fuelType: 'gasoline'
    });
    const [scrapedInfo, setScrapedInfo] = useState(initialScrapedInfo);
    const [costs, setCosts] = useState<CostBreakdown | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [co2LookupResult, setCo2LookupResult] = useState<CO2LookupResult | null>(null);
    const [isLookingUpCO2, setIsLookingUpCO2] = useState(false);

    // Check if we have enough data to show results initially
    const [showMissingDataModal, setShowMissingDataModal] = useState(() => {
        return !(initialCarData.price > 0 && !isNaN(new Date(initialCarData.firstRegistrationDate).getTime()));
    });

    // Try to parse brand/model from title on mount
    useEffect(() => {
        if (scrapedInfo.title && !carData.brand) {
            const parsed = parseCarTitle(scrapedInfo.title);
            if (parsed) {
                setCarData(prev => ({
                    ...prev,
                    brand: parsed.brand,
                    model: parsed.model
                }));
            }
        }
    }, [scrapedInfo.title]);

    // Lookup CO2 automatically when brand, model, year, and fuel type are available
    useEffect(() => {
        const lookupCO2 = async () => {
            if (carData.brand && carData.model && !isNaN(carData.firstRegistrationDate.getTime())) {
                setIsLookingUpCO2(true);
                try {
                    const year = carData.firstRegistrationDate.getFullYear();
                    const result = await lookupCO2Emissions(
                        carData.brand,
                        carData.model,
                        year,
                        carData.fuelType || 'gasoline'
                    );

                    if (result) {
                        setCo2LookupResult(result);
                        // Only auto-fill if we don't already have CO2 data
                        if (!carData.co2Emissions || carData.co2Emissions === 0) {
                            setCarData(prev => ({ ...prev, co2Emissions: result.co2 }));
                        }
                    }
                } catch (error) {
                    console.error('CO2 lookup failed:', error);
                }
                setIsLookingUpCO2(false);
            }
        };

        lookupCO2();
    }, [carData.brand, carData.model, carData.firstRegistrationDate, carData.fuelType]);

    useEffect(() => {
        if (carData.price > 0 && !isNaN(carData.firstRegistrationDate.getTime())) {
            setCosts(calculateImportCosts(carData));
        }
    }, [carData]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        setCarData(prev => {
            const newData = { ...prev };
            if (name === 'price') newData.price = parseFloat(value) || 0;
            if (name === 'co2Emissions') newData.co2Emissions = parseFloat(value) || 0;
            if (name === 'firstRegistrationDate') newData.firstRegistrationDate = new Date(value);
            if (name === 'isProfessionalSeller') newData.isProfessionalSeller = value === 'true';
            if (name === 'brand') newData.brand = value;
            if (name === 'model') newData.model = value;
            if (name === 'fuelType') newData.fuelType = value;
            return newData;
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(amount);
    };

    const formatDate = (date: Date) => {
        if (isNaN(date.getTime())) return '';
        return date.toISOString().slice(0, 7); // YYYY-MM
    };

    const formatDateDisplay = (date: Date) => {
        if (isNaN(date.getTime())) return '';
        return date.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' }); // MM/YYYY
    };

    const getDisplayImage = () => {
        if (scrapedInfo.imgUrl && !scrapedInfo.imgUrl.includes('undefined') && scrapedInfo.imgUrl.startsWith('http')) {
            return scrapedInfo.imgUrl;
        }
        return "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1000&auto=format&fit=crop";
    };



    if (showMissingDataModal) {
        // Find models for current brand (case-insensitive)
        const currentBrandKey = Object.keys(CAR_DATABASE).find(key =>
            key.toLowerCase() === carData.brand?.toLowerCase() ||
            (carData.brand?.toLowerCase().includes(key.toLowerCase()) && key.length > 2)
        );
        const availableModels = currentBrandKey ? CAR_DATABASE[currentBrandKey] : [];

        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden my-4">
                    <div className="bg-gradient-to-r from-primary to-blue-600 p-4 sm:p-6">
                        <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">Completa los datos</h2>
                        <p className="text-white/80 text-sm sm:text-base">
                            Introduce los datos del vehículo para calcular el presupuesto
                        </p>
                    </div>

                    <div className="p-4 sm:p-6 max-h-[70vh] overflow-y-auto">
                        {scrapedInfo.title && (
                            <div className="mb-4 sm:mb-6 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                                <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Vehículo Detectado</p>
                                <p className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">{scrapedInfo.title}</p>
                            </div>
                        )}

                        <div className="space-y-4">
                            {/* Brand & Model Row */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Marca *
                                    </label>
                                    <input
                                        type="text"
                                        name="brand"
                                        value={carData.brand || ''}
                                        onChange={handleInputChange}
                                        placeholder="Ej: BMW"
                                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                                        list="brands-list"
                                    />
                                    <datalist id="brands-list">
                                        <option value="Audi" />
                                        <option value="BMW" />
                                        <option value="Mercedes" />
                                        <option value="Volkswagen" />
                                        <option value="Seat" />
                                        <option value="Skoda" />
                                        <option value="Peugeot" />
                                        <option value="Renault" />
                                        <option value="Toyota" />
                                        <option value="Ford" />
                                        <option value="Hyundai" />
                                        <option value="Kia" />
                                        <option value="Mazda" />
                                        <option value="Volvo" />
                                        <option value="Porsche" />
                                        <option value="Tesla" />
                                        <option value="Nissan" />
                                        <option value="Honda" />
                                        <option value="Fiat" />
                                        <option value="Mini" />
                                    </datalist>
                                </div>
                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Modelo *
                                    </label>
                                    <input
                                        type="text"
                                        name="model"
                                        value={carData.model || ''}
                                        onChange={handleInputChange}
                                        placeholder={availableModels.length > 0 ? `Ej: ${availableModels[0]}` : "Ej: Serie 3"}
                                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                                        list="models-list"
                                    />
                                    <datalist id="models-list">
                                        {availableModels.map((model) => (
                                            <option key={model} value={model} />
                                        ))}
                                    </datalist>
                                </div>
                            </div>

                            {/* Price */}
                            <div>
                                <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Precio en Origen (€) *
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">€</span>
                                    <input
                                        type="number"
                                        name="price"
                                        value={carData.price || ''}
                                        onChange={handleInputChange}
                                        placeholder="25000"
                                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 pl-8 pr-3 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                                    />
                                </div>
                            </div>

                            {/* Registration Date & Fuel Type Row */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Matriculación *
                                    </label>
                                    <input
                                        type="month"
                                        name="firstRegistrationDate"
                                        value={formatDate(carData.firstRegistrationDate)}
                                        max={new Date().toISOString().slice(0, 7)}
                                        onChange={handleInputChange}
                                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Combustible *
                                    </label>
                                    <select
                                        name="fuelType"
                                        value={carData.fuelType || 'gasoline'}
                                        onChange={handleInputChange}
                                        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                                    >
                                        <option value="gasoline">Gasolina</option>
                                        <option value="diesel">Diésel</option>
                                        <option value="hybrid">Híbrido</option>
                                        <option value="electric">Eléctrico</option>
                                    </select>
                                </div>
                            </div>

                            {/* Seller Type */}
                            <div>
                                <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Tipo de Vendedor
                                </label>
                                <select
                                    name="isProfessionalSeller"
                                    value={carData.isProfessionalSeller ? 'true' : 'false'}
                                    onChange={handleInputChange}
                                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                                >
                                    <option value="true">Profesional (Concesionario)</option>
                                    <option value="false">Particular</option>
                                </select>
                            </div>

                            {/* CO2 Info Box - Automatic Lookup Result */}
                            <div className="p-3 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl border border-green-200 dark:border-green-800">
                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5">
                                        {isLookingUpCO2 ? (
                                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                                        ) : co2LookupResult ? (
                                            <span className={`material-symbols-outlined text-xl ${co2LookupResult.confidence === 'high' ? 'text-green-600' :
                                                co2LookupResult.confidence === 'medium' ? 'text-yellow-600' : 'text-orange-600'
                                                }`}>
                                                {co2LookupResult.confidence === 'high' ? 'verified' : 'info'}
                                            </span>
                                        ) : (
                                            <span className="material-symbols-outlined text-xl text-gray-400">eco</span>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-1">
                                            Emisiones CO2
                                        </p>
                                        {isLookingUpCO2 ? (
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Buscando emisiones...</p>
                                        ) : co2LookupResult ? (
                                            <>
                                                <p className="text-lg font-bold text-gray-900 dark:text-white">
                                                    {carData.co2Emissions || co2LookupResult.co2} g/km
                                                </p>
                                                <p className="text-xs text-gray-500 mt-0.5">
                                                    {co2LookupResult.source}
                                                </p>
                                            </>
                                        ) : carData.brand && carData.model ? (
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                Completa marca y modelo para autodetectar
                                            </p>
                                        ) : (
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                Las emisiones se calcularán automáticamente
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            onClick={() => {
                                if (carData.price > 0 && !isNaN(carData.firstRegistrationDate.getTime()) && carData.brand && carData.model) {
                                    // Ensure we have CO2 data
                                    if (!carData.co2Emissions || carData.co2Emissions === 0) {
                                        if (co2LookupResult) {
                                            setCarData(prev => ({ ...prev, co2Emissions: co2LookupResult.co2 }));
                                        } else {
                                            // Default fallback
                                            setCarData(prev => ({ ...prev, co2Emissions: 150 }));
                                        }
                                    }

                                    // Update title if not set
                                    if (!scrapedInfo.title && carData.brand && carData.model) {
                                        setScrapedInfo(prev => ({
                                            ...prev,
                                            title: `${carData.brand?.charAt(0).toUpperCase()}${carData.brand?.slice(1)} ${carData.model?.charAt(0).toUpperCase()}${carData.model?.slice(1)}`
                                        }));
                                    }

                                    setShowMissingDataModal(false);
                                }
                            }}
                            disabled={carData.price <= 0 || isNaN(carData.firstRegistrationDate.getTime()) || !carData.brand || !carData.model}
                            className="mt-6 w-full py-3 sm:py-4 px-4 bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-primary disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-lg shadow-primary/30 hover:shadow-xl flex items-center justify-center gap-2"
                        >
                            <span className="material-symbols-outlined">calculate</span>
                            Calcular Importación
                        </button>

                        {/* Back Link */}
                        <Link
                            href="/search"
                            className="mt-4 block text-center text-sm text-gray-500 hover:text-primary transition-colors"
                        >
                            ← Volver a la búsqueda
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (!costs) return null;

    return (
        <div className="relative flex h-auto min-h-screen w-full flex-col group/design-root overflow-x-hidden">
            <div className="layout-container flex h-full grow flex-col">
                <Header />
                <main className="flex flex-1 justify-center py-5 sm:py-10 px-4">
                    <div className="layout-content-container flex flex-col w-full max-w-6xl flex-1">
                        {/* PageHeading */}
                        <div className="flex flex-wrap justify-between gap-3 p-4">
                            <div className="flex min-w-72 flex-col gap-3">
                                <p className="text-gray-900 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">Detalles del Coche y Desglose</p>
                                {scrapedInfo.error && (
                                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                                        <strong className="font-bold">Aviso: </strong>
                                        <span className="block sm:inline">{scrapedInfo.error}</span>
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center">
                                <button
                                    onClick={() => setIsEditing(!isEditing)}
                                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    <span className="material-symbols-outlined">{isEditing ? 'check' : 'edit'}</span>
                                    {isEditing ? 'Finalizar Edición' : 'Editar Datos'}
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mt-8">
                            {/* Left Column: Car Details */}
                            <div className="lg:col-span-2 flex flex-col gap-8">
                                <div className="bg-white dark:bg-gray-900/50 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                                    <div className="w-full bg-center bg-no-repeat bg-cover flex flex-col justify-end overflow-hidden min-h-60"
                                        style={{ backgroundImage: `url("${getDisplayImage()}")` }}>
                                    </div>
                                    <div className="p-6 grid grid-cols-1 gap-y-4">
                                        <div className="flex flex-col gap-1 border-b border-gray-100 dark:border-gray-700 pb-4">
                                            <p className="text-gray-500 text-xs uppercase font-bold">Vehículo</p>
                                            <p className="font-bold text-gray-900 dark:text-gray-100">{scrapedInfo.title || 'Sin título'}</p>
                                        </div>
                                        <div className="flex flex-col gap-1 border-b border-gray-100 dark:border-gray-700 pb-4">
                                            <label className="text-gray-500 text-xs uppercase font-bold">Precio Origen</label>
                                            {isEditing ? (
                                                <input
                                                    type="number"
                                                    name="price"
                                                    value={carData.price}
                                                    onChange={handleInputChange}
                                                    className="form-input rounded-md border-gray-300 dark:bg-gray-800 text-gray-900 dark:text-white w-full"
                                                />
                                            ) : (
                                                <p className="font-medium text-gray-900 dark:text-gray-100">{formatCurrency(carData.price)}</p>
                                            )}
                                        </div>
                                        <div className="flex flex-col gap-1 border-b border-gray-100 dark:border-gray-700 pb-4">
                                            <label className="text-gray-500 text-xs uppercase font-bold">Matriculación</label>
                                            {isEditing ? (
                                                <input
                                                    type="month"
                                                    name="firstRegistrationDate"
                                                    value={formatDate(carData.firstRegistrationDate)}
                                                    max={new Date().toISOString().slice(0, 7)}
                                                    onChange={handleInputChange}
                                                    className="form-input rounded-md border-gray-300 dark:bg-gray-800 text-gray-900 dark:text-white w-full"
                                                />
                                            ) : (
                                                <p className="font-medium text-gray-900 dark:text-gray-100">{formatDateDisplay(carData.firstRegistrationDate)}</p>
                                            )}
                                        </div>
                                        <div className="flex flex-col gap-1 border-b border-gray-100 dark:border-gray-700 pb-4">
                                            <label className="text-gray-500 text-xs uppercase font-bold">CO2</label>
                                            {isEditing ? (
                                                <input
                                                    type="number"
                                                    name="co2Emissions"
                                                    value={carData.co2Emissions}
                                                    onChange={handleInputChange}
                                                    className="form-input rounded-md border-gray-300 dark:bg-gray-800 text-gray-900 dark:text-white w-full"
                                                />
                                            ) : (
                                                <p className="font-medium text-gray-900 dark:text-gray-100">{carData.co2Emissions} g/km</p>
                                            )}
                                        </div>
                                        <div className="flex flex-col gap-1 pb-4">
                                            <label className="text-gray-500 text-xs uppercase font-bold">Vendedor</label>
                                            {isEditing ? (
                                                <select
                                                    name="isProfessionalSeller"
                                                    value={carData.isProfessionalSeller.toString()}
                                                    onChange={handleInputChange}
                                                    className="form-select rounded-md border-gray-300 dark:bg-gray-800 text-gray-900 dark:text-white w-full"
                                                >
                                                    <option value="true">Profesional (Factura)</option>
                                                    <option value="false">Particular</option>
                                                </select>
                                            ) : (
                                                <p className="font-medium text-gray-900 dark:text-gray-100">{carData.isProfessionalSeller ? 'Profesional' : 'Particular'}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Breakdown */}
                            <div className="lg:col-span-3 flex flex-col gap-8">
                                <div className="bg-white dark:bg-gray-900/50 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-6">
                                    <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Desglose de Costes</h2>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                                            <span className="text-gray-600 dark:text-gray-400">Precio Vehículo</span>
                                            <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(costs.vehiclePrice)}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                                            <span className="text-gray-600 dark:text-gray-400">Impuesto Matriculación</span>
                                            <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(costs.registrationTax)}</span>
                                        </div>
                                        {costs.vat > 0 && (
                                            <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                                                <span className="text-gray-600 dark:text-gray-400">IVA (21%)</span>
                                                <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(costs.vat)}</span>
                                            </div>
                                        )}
                                        {costs.itp > 0 && (
                                            <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                                                <span className="text-gray-600 dark:text-gray-400">ITP (4%)</span>
                                                <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(costs.itp)}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                                            <span className="text-gray-600 dark:text-gray-400">Gastos Gestión (Estimado)</span>
                                            <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(costs.agencyFee + costs.itvFee + costs.trafficFee + costs.platesFee)}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700">
                                            <span className="text-gray-600 dark:text-gray-400">Transporte (Estimado)</span>
                                            <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(costs.transportCost)}</span>
                                        </div>
                                        <div className="mt-6 flex justify-between items-center p-4 bg-primary/10 rounded-xl">
                                            <span className="text-xl font-bold text-gray-900 dark:text-white">Total Estimado</span>
                                            <span className="text-3xl font-black text-primary">{formatCurrency(costs.total)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="w-full mt-12 mb-8">
                            <LeadCapture initialCarUrl={searchUrl} />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
