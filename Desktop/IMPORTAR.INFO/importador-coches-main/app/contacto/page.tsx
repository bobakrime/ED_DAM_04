'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '../components/Header';

export default function LeadsPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        carUrl: '',
        budget: '',
        message: '',
        contactPreference: 'email'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            // Simulate form submission - In production, send to your backend/CRM
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Log for now - replace with actual API call
            console.log('Lead submitted:', formData);

            setIsSubmitted(true);
        } catch (err) {
            setError('Hubo un error al enviar el formulario. Por favor, inténtalo de nuevo.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const benefits = [
        {
            icon: 'support_agent',
            title: 'Asesoramiento Personalizado',
            description: 'Un experto te guía durante todo el proceso de importación'
        },
        {
            icon: 'savings',
            title: 'Ahorra Hasta 30%',
            description: 'Negociamos el mejor precio en origen y optimizamos impuestos'
        },
        {
            icon: 'verified',
            title: 'Garantía Total',
            description: 'Verificación del vehículo, historial completo y garantía mecánica'
        },
        {
            icon: 'local_shipping',
            title: 'Transporte Incluido',
            description: 'Recogemos el coche en Alemania y lo entregamos en tu puerta'
        },
        {
            icon: 'description',
            title: 'Gestión Completa',
            description: 'Nos encargamos de toda la documentación y matriculación'
        },
        {
            icon: 'schedule',
            title: 'En 2-3 Semanas',
            description: 'Tu coche listo para circular con matrícula española'
        }
    ];

    const testimonials = [
        {
            name: 'Carlos M.',
            location: 'Madrid',
            text: 'Importé un BMW Serie 5 y me ahorré más de 8.000€. El proceso fue impecable.',
            rating: 5
        },
        {
            name: 'Laura S.',
            location: 'Barcelona',
            text: 'Tenía miedo de las complicaciones pero me lo pusieron todo muy fácil. 100% recomendable.',
            rating: 5
        },
        {
            name: 'Miguel Á.',
            location: 'Valencia',
            text: 'Mercedes Clase C prácticamente nuevo por el precio de uno de 5 años aquí. Increíble.',
            rating: 5
        }
    ];

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-[#fafbfc] dark:bg-gray-950 flex flex-col">
                <Header />
                <main className="flex-grow flex items-center justify-center px-4 py-16">
                    <div className="max-w-md text-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30">
                            <span className="material-symbols-outlined text-4xl text-white">check</span>
                        </div>
                        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-4">
                            ¡Solicitud Recibida!
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mb-8">
                            Un especialista en importación te contactará en menos de 24 horas para asesorarte sin compromiso.
                        </p>
                        <div className="space-y-3">
                            <Link
                                href="/search"
                                className="block w-full py-3 px-6 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/30"
                            >
                                Calcular Otra Importación
                            </Link>
                            <Link
                                href="/"
                                className="block w-full py-3 px-6 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                            >
                                Volver al Inicio
                            </Link>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fafbfc] dark:bg-gray-950 flex flex-col">
            <Header />

            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-gray-900 via-primary to-blue-800 text-white overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00ek0xNiAxNmMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6bTAgMzZjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00em0zNi0zNmMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')]"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 py-16 sm:py-20 lg:py-24 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <span className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
                                🚗 Servicio Premium de Importación
                            </span>
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight mb-6">
                                Importamos tu coche ideal de Alemania
                                <span className="block text-yellow-300">sin complicaciones</span>
                            </h1>
                            <p className="text-lg text-white/80 mb-8 max-w-xl">
                                Más de <strong>500 clientes satisfechos</strong> han ahorrado una media de <strong>6.000€</strong> importando su coche con nosotros. Tú podrías ser el siguiente.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <a
                                    href="#formulario"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                                >
                                    <span className="material-symbols-outlined">send</span>
                                    Solicitar Presupuesto Gratis
                                </a>
                                <a
                                    href="#beneficios"
                                    className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm text-white font-medium rounded-xl border border-white/20 hover:bg-white/20 transition-all"
                                >
                                    Ver Cómo Funciona
                                </a>
                            </div>
                        </div>
                        <div className="hidden lg:block relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/50 to-purple-500/50 rounded-3xl blur-3xl"></div>
                            <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20">
                                <div className="text-center mb-6">
                                    <p className="text-5xl font-black mb-2">6.247€</p>
                                    <p className="text-white/70">Ahorro medio por importación</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-center">
                                    <div className="bg-white/10 rounded-xl p-4">
                                        <p className="text-2xl font-bold">500+</p>
                                        <p className="text-sm text-white/70">Coches importados</p>
                                    </div>
                                    <div className="bg-white/10 rounded-xl p-4">
                                        <p className="text-2xl font-bold">98%</p>
                                        <p className="text-sm text-white/70">Clientes satisfechos</p>
                                    </div>
                                    <div className="bg-white/10 rounded-xl p-4">
                                        <p className="text-2xl font-bold">15 días</p>
                                        <p className="text-sm text-white/70">Tiempo medio</p>
                                    </div>
                                    <div className="bg-white/10 rounded-xl p-4">
                                        <p className="text-2xl font-bold">24/7</p>
                                        <p className="text-sm text-white/70">Soporte continuo</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section id="beneficios" className="py-16 sm:py-20 lg:py-24 bg-white dark:bg-gray-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12 lg:mb-16">
                        <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white mb-4">
                            ¿Por qué elegirnos?
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                            Nos encargamos de todo el proceso para que tú solo tengas que disfrutar de tu nuevo coche
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                        {benefits.map((benefit, idx) => (
                            <div
                                key={idx}
                                className="group p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl hover:bg-primary hover:shadow-xl hover:shadow-primary/20 transition-all duration-300"
                            >
                                <div className="w-14 h-14 bg-primary/10 group-hover:bg-white/20 rounded-xl flex items-center justify-center mb-4 transition-colors">
                                    <span className="material-symbols-outlined text-3xl text-primary group-hover:text-white transition-colors">
                                        {benefit.icon}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-white mb-2 transition-colors">
                                    {benefit.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 group-hover:text-white/80 transition-colors">
                                    {benefit.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-16 sm:py-20 bg-gray-50 dark:bg-gray-950">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white mb-4">
                            Lo que dicen nuestros clientes
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {testimonials.map((testimonial, idx) => (
                            <div
                                key={idx}
                                className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700"
                            >
                                <div className="flex gap-1 mb-4">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <span key={i} className="material-symbols-outlined text-yellow-400 text-xl">star</span>
                                    ))}
                                </div>
                                <p className="text-gray-700 dark:text-gray-300 mb-4 italic">
                                    "{testimonial.text}"
                                </p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                                        {testimonial.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 dark:text-white">{testimonial.name}</p>
                                        <p className="text-sm text-gray-500">{testimonial.location}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Form */}
            <section id="formulario" className="py-16 sm:py-20 lg:py-24 bg-white dark:bg-gray-900">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white mb-4">
                            Solicita tu presupuesto gratuito
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400">
                            Sin compromiso. Te contactamos en menos de 24 horas.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="bg-gray-50 dark:bg-gray-800 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl border border-gray-100 dark:border-gray-700">
                        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Nombre completo *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    placeholder="Tu nombre"
                                    className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="tu@email.com"
                                    className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                                />
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Teléfono *
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    placeholder="+34 600 000 000"
                                    className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                                />
                            </div>

                            {/* Budget */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Presupuesto aproximado
                                </label>
                                <select
                                    name="budget"
                                    value={formData.budget}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                                >
                                    <option value="">Selecciona...</option>
                                    <option value="10000-20000">10.000€ - 20.000€</option>
                                    <option value="20000-30000">20.000€ - 30.000€</option>
                                    <option value="30000-50000">30.000€ - 50.000€</option>
                                    <option value="50000+">Más de 50.000€</option>
                                </select>
                            </div>

                            {/* Car URL */}
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    URL del coche que te interesa (opcional)
                                </label>
                                <input
                                    type="url"
                                    name="carUrl"
                                    value={formData.carUrl}
                                    onChange={handleChange}
                                    placeholder="https://www.mobile.de/..."
                                    className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                                />
                            </div>

                            {/* Message */}
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    ¿Qué tipo de coche buscas? (opcional)
                                </label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows={4}
                                    placeholder="Cuéntanos qué marca, modelo, año, kilómetros... o cualquier otro detalle"
                                    className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all resize-none"
                                />
                            </div>

                            {/* Contact Preference */}
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                    ¿Cómo prefieres que te contactemos?
                                </label>
                                <div className="flex flex-wrap gap-4">
                                    {[
                                        { value: 'email', label: 'Email', icon: 'mail' },
                                        { value: 'phone', label: 'Teléfono', icon: 'call' },
                                        { value: 'whatsapp', label: 'WhatsApp', icon: 'chat' }
                                    ].map(option => (
                                        <label
                                            key={option.value}
                                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 cursor-pointer transition-all ${formData.contactPreference === option.value
                                                    ? 'border-primary bg-primary/10 text-primary'
                                                    : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name="contactPreference"
                                                value={option.value}
                                                checked={formData.contactPreference === option.value}
                                                onChange={handleChange}
                                                className="sr-only"
                                            />
                                            <span className="material-symbols-outlined text-lg">{option.icon}</span>
                                            <span className="font-medium">{option.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="mt-8 w-full py-4 px-6 bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-primary text-white font-bold text-lg rounded-xl shadow-lg shadow-primary/30 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                                    Enviando...
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined">send</span>
                                    Solicitar Presupuesto Gratis
                                </>
                            )}
                        </button>

                        <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
                            Al enviar este formulario aceptas nuestra política de privacidad. No compartimos tus datos con terceros.
                        </p>
                    </form>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-12 sm:py-16 bg-gradient-to-r from-primary via-blue-600 to-purple-700 text-white">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-2xl sm:text-3xl font-black mb-4">
                        ¿Tienes dudas? Llámanos sin compromiso
                    </h2>
                    <p className="text-white/80 mb-6">
                        Estamos aquí para ayudarte a encontrar el coche perfecto
                    </p>
                    <a
                        href="tel:+34900000000"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary font-bold text-lg rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                    >
                        <span className="material-symbols-outlined text-2xl">call</span>
                        900 000 000
                    </a>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-gradient-to-br from-primary to-purple-600 rounded-xl flex items-center justify-center font-black text-lg shadow-lg">I</div>
                            <span className="font-bold text-xl">Importar<span className="text-primary">.info</span></span>
                        </div>
                        <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
                            <Link href="/" className="hover:text-white transition-colors">Inicio</Link>
                            <Link href="/search" className="hover:text-white transition-colors">Calculadora</Link>
                            <Link href="/contacto" className="hover:text-white transition-colors">Contacto</Link>
                            <Link href="/privacidad" className="hover:text-white transition-colors">Privacidad</Link>
                        </div>
                        <p className="text-sm text-gray-500">
                            © {new Date().getFullYear()} Importar.info
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
