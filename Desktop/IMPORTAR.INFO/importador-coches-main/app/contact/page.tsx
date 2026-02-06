import Link from "next/link";

export default function Contact() {
    return (
        <div className="relative flex min-h-screen w-full flex-col group/design-root overflow-x-hidden">
            <div className="layout-container flex h-full grow flex-col">
                <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-gray-200 dark:border-b-gray-800 px-6 sm:px-10 py-3 bg-white dark:bg-background-dark sticky top-0 z-10">
                    <div className="flex items-center gap-4 text-gray-900 dark:text-white">
                        <div className="size-6 text-primary">
                            <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><path d="M6 6H42L36 24L42 42H6L12 24L6 6Z"></path></svg>
                        </div>
                        <h2 className="text-lg font-bold tracking-tight">CarImport</h2>
                    </div>
                    <div className="hidden md:flex flex-1 justify-end gap-8">
                        <div className="flex items-center gap-9">
                            <Link className="text-sm font-medium text-gray-800 dark:text-gray-300 hover:text-primary dark:hover:text-primary" href="/">Home</Link>
                            <Link className="text-sm font-medium text-gray-800 dark:text-gray-300 hover:text-primary dark:hover:text-primary" href="/results">Calculadora</Link>
                            <a className="text-sm font-medium text-gray-800 dark:text-gray-300 hover:text-primary dark:hover:text-primary" href="#">Servicios</a>
                            <Link className="text-sm font-medium text-gray-800 dark:text-gray-300 hover:text-primary dark:hover:text-primary" href="/contact">Contacto</Link>
                        </div>
                        <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-wide hover:bg-primary/90 transition-colors">
                            <span className="truncate">Mi Cuenta</span>
                        </button>
                    </div>
                </header>
                <main className="flex-1 px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex flex-col gap-6 mb-12">
                            <h1 className="text-gray-900 dark:text-white text-4xl font-black tracking-tighter">Contacto y Próximos Pasos</h1>
                            <p className="text-gray-600 dark:text-gray-400 text-lg font-normal leading-normal max-w-3xl">
                                Resuelve tus dudas y conoce cómo podemos ayudarte a importar el coche de tus sueños desde Alemania.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
                            <div className="lg:col-span-2">
                                <h2 className="text-gray-900 dark:text-white text-2xl font-bold tracking-tight mb-2">¿Listo para importar tu coche?</h2>
                                <p className="text-gray-600 dark:text-gray-400 text-base font-normal leading-normal mb-8">Sigue estos pasos para poner en marcha el proceso. Nuestro equipo te guiará en cada etapa.</p>
                                <div className="grid grid-cols-[auto_1fr] gap-x-4">
                                    <div className="flex flex-col items-center gap-2 pt-1.5">
                                        <div className="flex items-center justify-center size-8 rounded-full bg-primary/20 text-primary">
                                            <span className="material-symbols-outlined !text-xl">search</span>
                                        </div>
                                        <div className="w-px bg-gray-300 dark:bg-gray-700 grow"></div>
                                    </div>
                                    <div className="flex flex-1 flex-col pb-8">
                                        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Paso 1</p>
                                        <p className="text-gray-800 dark:text-gray-200 text-base font-medium leading-normal">Consulta Inicial y Búsqueda</p>
                                    </div>
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-px bg-gray-300 dark:bg-gray-700 h-2"></div>
                                        <div className="flex items-center justify-center size-8 rounded-full bg-primary/20 text-primary">
                                            <span className="material-symbols-outlined !text-xl">manage_search</span>
                                        </div>
                                        <div className="w-px bg-gray-300 dark:bg-gray-700 grow"></div>
                                    </div>
                                    <div className="flex flex-1 flex-col pb-8">
                                        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Paso 2</p>
                                        <p className="text-gray-800 dark:text-gray-200 text-base font-medium leading-normal">Inspección y Gestión de Compra</p>
                                    </div>
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-px bg-gray-300 dark:bg-gray-700 h-2"></div>
                                        <div className="flex items-center justify-center size-8 rounded-full bg-primary/20 text-primary">
                                            <span className="material-symbols-outlined !text-xl">local_shipping</span>
                                        </div>
                                        <div className="w-px bg-gray-300 dark:bg-gray-700 grow"></div>
                                    </div>
                                    <div className="flex flex-1 flex-col pb-8">
                                        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Paso 3</p>
                                        <p className="text-gray-800 dark:text-gray-200 text-base font-medium leading-normal">Transporte Seguro a España</p>
                                    </div>
                                    <div className="flex flex-col items-center gap-2">
                                        <div className="w-px bg-gray-300 dark:bg-gray-700 h-2"></div>
                                        <div className="flex items-center justify-center size-8 rounded-full bg-primary/20 text-primary">
                                            <span className="material-symbols-outlined !text-xl">gavel</span>
                                        </div>
                                        <div className="w-px bg-gray-300 dark:bg-gray-700 grow"></div>
                                    </div>
                                    <div className="flex flex-1 flex-col pb-8">
                                        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Paso 4</p>
                                        <p className="text-gray-800 dark:text-gray-200 text-base font-medium leading-normal">Aduanas, Homologación e ITV</p>
                                    </div>
                                    <div className="flex flex-col items-center gap-2 pb-1.5">
                                        <div className="w-px bg-gray-300 dark:bg-gray-700 h-2"></div>
                                        <div className="flex items-center justify-center size-8 rounded-full bg-primary/20 text-primary">
                                            <span className="material-symbols-outlined !text-xl">vpn_key</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-1 flex-col">
                                        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Paso 5</p>
                                        <p className="text-gray-800 dark:text-gray-200 text-base font-medium leading-normal">Entrega del Vehículo</p>
                                    </div>
                                </div>
                            </div>
                            <div className="lg:col-span-3">
                                <div className="bg-white dark:bg-background-dark/80 p-8 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
                                    <h2 className="text-gray-900 dark:text-white text-2xl font-bold tracking-tight">Solicita más información</h2>
                                    <p className="text-gray-600 dark:text-gray-400 text-base font-normal leading-normal mt-2 mb-6">Rellena el formulario y nuestro equipo se pondrá en contacto contigo para ofrecerte un presupuesto personalizado y resolver todas tus dudas.</p>
                                    <form className="space-y-6">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5" htmlFor="name">Nombre</label>
                                                <input className="block w-full rounded-lg border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-gray-200 shadow-sm focus:border-primary focus:ring-primary sm:text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500" id="name" name="name" placeholder="Tu nombre completo" type="text" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5" htmlFor="email">Email</label>
                                                <input className="block w-full rounded-lg border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-gray-200 shadow-sm focus:border-primary focus:ring-primary sm:text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500" id="email" name="email" placeholder="tu.email@ejemplo.com" type="email" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5" htmlFor="phone">Teléfono <span className="text-gray-500 dark:text-gray-400">(Opcional)</span></label>
                                            <input className="block w-full rounded-lg border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-gray-200 shadow-sm focus:border-primary focus:ring-primary sm:text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500" id="phone" name="phone" placeholder="+34 600 000 000" type="tel" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5" htmlFor="message">Mensaje</label>
                                            <textarea className="block w-full rounded-lg border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-gray-900 dark:text-gray-200 shadow-sm focus:border-primary focus:ring-primary sm:text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500" id="message" name="message" placeholder="Escribe aquí tu consulta..." rows={4}></textarea>
                                        </div>
                                        <div className="flex items-start">
                                            <div className="flex h-5 items-center">
                                                <input className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-primary focus:ring-primary bg-gray-100 dark:bg-gray-700" id="terms" name="terms" type="checkbox" />
                                            </div>
                                            <div className="ml-3 text-sm">
                                                <label className="text-gray-600 dark:text-gray-400" htmlFor="terms">Acepto la <a className="font-medium text-primary hover:underline" href="#">política de privacidad</a> y los <a className="font-medium text-primary hover:underline" href="#">términos de servicio</a>.</label>
                                            </div>
                                        </div>
                                        <div>
                                            <button className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors" type="submit">
                                                Enviar Consulta
                                            </button>
                                        </div>
                                    </form>
                                    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800 text-center">
                                        <p className="text-sm text-gray-600 dark:text-gray-400">¿Prefieres otro método? Contáctanos directamente:</p>
                                        <div className="mt-3 flex justify-center items-center gap-6 text-sm text-gray-800 dark:text-gray-300">
                                            <a className="flex items-center gap-2 hover:text-primary dark:hover:text-primary transition-colors" href="mailto:info@carimport.com">
                                                <span className="material-symbols-outlined !text-base">email</span>
                                                info@carimport.com
                                            </a>
                                            <a className="flex items-center gap-2 hover:text-primary dark:hover:text-primary transition-colors" href="tel:+34900123456">
                                                <span className="material-symbols-outlined !text-base">phone</span>
                                                900 123 456
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
