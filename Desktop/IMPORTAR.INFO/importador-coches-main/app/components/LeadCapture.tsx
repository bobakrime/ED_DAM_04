'use client';

import { useState } from 'react';

import { submitLead } from '../actions/submit-lead';

interface LeadCaptureProps {
    initialCarUrl?: string;
}

export default function LeadCapture({ initialCarUrl }: LeadCaptureProps) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        carUrl: initialCarUrl || '',
        budget: '',
        message: '',
        contactPreference: 'whatsapp'
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
            const result = await submitLead(formData);
            if (result.success) {
                console.log('Lead submitted:', formData);
                setIsSubmitted(true);
            } else {
                throw new Error(result.error);
            }
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Hubo un error al enviar el formulario.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-8 text-center my-8 border border-green-100 dark:border-green-800">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-500/30">
                    <span className="material-symbols-outlined text-3xl text-white">check</span>
                </div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">¡Solicitud Enviada!</h3>
                <p className="text-gray-600 dark:text-gray-300">
                    Te contactaremos en breve para asesorarte personalmente.
                </p>
            </div>
        );
    }

    return (
        <section className="py-6 sm:py-10 w-full px-4 sm:px-0">
            <div className="w-full max-w-4xl mx-auto">
                <div className="text-center mb-6 sm:mb-8">
                    <h2 className="text-xl sm:text-3xl font-black text-gray-900 dark:text-white mb-2 leading-tight">
                        ¿Necesitas ayuda con la importación?
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-xl mx-auto">
                        Nuestro equipo de gestores expertos se encarga de todo el papeleo, transporte y matriculación.
                    </p>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 sm:p-8 shadow-xl border border-gray-100 dark:border-gray-800">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Name */}
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                                    Nombre
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    placeholder="Tu nombre completo"
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                                />
                            </div>

                            {/* Email */}
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="tu@email.com"
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                                />
                            </div>

                            {/* Phone */}
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                                    Teléfono
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    placeholder="+34 600..."
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                                />
                            </div>

                            {/* Budget */}
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                                    Presupuesto
                                </label>
                                <select
                                    name="budget"
                                    value={formData.budget}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                                >
                                    <option value="">Selecciona rango...</option>
                                    <option value="10000-20000">10.000€ - 20.000€</option>
                                    <option value="20000-30000">20.000€ - 30.000€</option>
                                    <option value="30000-50000">30.000€ - 50.000€</option>
                                    <option value="50000+">Más de 50.000€</option>
                                </select>
                            </div>
                        </div>

                        {/* Message */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                                Mensaje (Opcional)
                            </label>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                rows={2}
                                placeholder="Dudas sobre el proceso, modelo específico..."
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none resize-none"
                            />
                        </div>

                        {/* Contact Preference */}
                        <div className="pt-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-2">
                                Preferencia de contacto
                            </label>
                            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                                {[
                                    { value: 'whatsapp', label: 'WhatsApp', icon: 'chat' },
                                    { value: 'phone', label: 'Llamada', icon: 'call' },
                                    { value: 'email', label: 'Email', icon: 'mail' },
                                ].map(option => (
                                    <label
                                        key={option.value}
                                        className={`flex-1 min-w-[100px] flex items-center justify-center gap-2 px-3 py-3 rounded-xl border cursor-pointer transition-all ${formData.contactPreference === option.value
                                            ? 'border-primary bg-primary text-white shadow-md'
                                            : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
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
                                        <span className={`material-symbols-outlined text-lg ${formData.contactPreference === option.value ? '' : 'text-gray-500'}`}>{option.icon}</span>
                                        <span className={`text-sm font-bold ${formData.contactPreference === option.value ? '' : 'text-gray-600 dark:text-gray-300'}`}>{option.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-4 mt-2 bg-gradient-to-r from-gray-900 to-gray-800 dark:from-white dark:to-gray-200 hover:from-black hover:to-gray-900 rounded-xl text-white dark:text-gray-900 font-bold shadow-lg transform active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <span className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined">send</span>
                                    Solicitar Asesoramiento Gratuito
                                </>
                            )}
                        </button>
                        <p className="text-center text-xs text-gray-400 mt-2">
                            Tus datos están protegidos. Sin compromiso.
                        </p>
                    </form>
                </div>
            </div>
        </section>
    );
}
