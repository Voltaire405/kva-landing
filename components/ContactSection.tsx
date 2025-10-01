'use client';

import { FormEvent, useState } from 'react';

export default function ContactSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      message: formData.get('message') as string,
    };

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus({
          type: 'success',
          message: '¡Mensaje enviado correctamente! Nos comunicaremos contigo pronto.',
        });
        e.currentTarget.reset();
      } else {
        console.error('Error del servidor:', result);
        setSubmitStatus({
          type: 'error',
          message: result.error || 'Error al enviar el mensaje. Por favor intenta nuevamente.',
        });
      }
    } catch (err) {
      console.error('Error en el fetch:', err);
      setSubmitStatus({
        type: 'error',
        message: `Error de conexión: ${err instanceof Error ? err.message : 'Por favor verifica tu conexión a internet e intenta nuevamente.'}`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contacto" className="py-12 sm:py-16 md:py-20 bg-white">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-5">
        <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-10 md:mb-[50px] text-primary relative after:content-[''] after:absolute after:bottom-[-10px] sm:after:bottom-[-15px] after:left-1/2 after:-translate-x-1/2 after:w-16 sm:after:w-20 after:h-1 after:bg-primary">
          Contáctanos
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 lg:gap-[50px] mt-10 sm:mt-12 md:mt-[60px]">
          {/* Contact Info */}
          <div className="flex flex-col justify-center">
            <div className="flex items-center mb-5 sm:mb-6 md:mb-[25px]">
              <div className="text-xl sm:text-2xl text-primary mr-3 sm:mr-[15px] bg-gray-medium w-[45px] h-[45px] sm:w-[50px] sm:h-[50px] rounded-full flex items-center justify-center flex-shrink-0">
                <i className="material-icons">phone</i>
              </div>
              <div>
                <h3 className="font-semibold text-sm sm:text-base">Teléfonos</h3>
                <p className="text-sm sm:text-base">324 385 8798</p>
                <p className="text-sm sm:text-base">304 203 2012</p>
              </div>
            </div>
            <div className="flex items-center mb-5 sm:mb-6 md:mb-[25px]">
              <div className="text-xl sm:text-2xl text-primary mr-3 sm:mr-[15px] bg-gray-medium w-[45px] h-[45px] sm:w-[50px] sm:h-[50px] rounded-full flex items-center justify-center flex-shrink-0">
                <i className="material-icons">email</i>
              </div>
              <div>
                <h3 className="font-semibold text-sm sm:text-base">Email</h3>
                <p className="text-sm sm:text-base break-all">kvatelsoluciones@gmail.com</p>
              </div>
            </div>
            <div className="flex items-center mb-5 sm:mb-6 md:mb-[25px]">
              <div className="text-xl sm:text-2xl text-primary mr-3 sm:mr-[15px] bg-gray-medium w-[45px] h-[45px] sm:w-[50px] sm:h-[50px] rounded-full flex items-center justify-center flex-shrink-0">
                <i className="material-icons">location_on</i>
              </div>
              <div>
                <h3 className="font-semibold text-sm sm:text-base">Dirección</h3>
                <p className="text-sm sm:text-base">Calle Principal #123, Ciudad</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-gray-light p-5 sm:p-6 md:p-[30px] rounded-[10px] shadow-[0_5px_15px_rgba(0,0,0,0.05)]">
            {submitStatus.type && (
              <div
                className={`mb-5 p-4 rounded-[5px] ${
                  submitStatus.type === 'success'
                    ? 'bg-green-50 border border-green-200 text-green-800'
                    : 'bg-red-50 border border-red-200 text-red-800'
                }`}
              >
                <p className="text-sm sm:text-base">{submitStatus.message}</p>
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="mb-4 sm:mb-5">
                <label htmlFor="name" className="block mb-2 font-medium text-sm sm:text-base">
                  Nombre
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full py-2.5 sm:py-3 px-3 sm:px-[15px] border border-[#ddd] rounded-[5px] font-sans text-sm sm:text-base transition-all duration-300 focus:outline-none focus:border-primary focus:shadow-[0_0_0_2px_rgba(10,36,99,0.2)]"
                />
              </div>
              <div className="mb-4 sm:mb-5">
                <label htmlFor="email" className="block mb-2 font-medium text-sm sm:text-base">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full py-2.5 sm:py-3 px-3 sm:px-[15px] border border-[#ddd] rounded-[5px] font-sans text-sm sm:text-base transition-all duration-300 focus:outline-none focus:border-primary focus:shadow-[0_0_0_2px_rgba(10,36,99,0.2)]"
                />
              </div>
              <div className="mb-4 sm:mb-5">
                <label htmlFor="phone" className="block mb-2 font-medium text-sm sm:text-base">
                  Teléfono
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="w-full py-2.5 sm:py-3 px-3 sm:px-[15px] border border-[#ddd] rounded-[5px] font-sans text-sm sm:text-base transition-all duration-300 focus:outline-none focus:border-primary focus:shadow-[0_0_0_2px_rgba(10,36,99,0.2)]"
                />
              </div>
              <div className="mb-4 sm:mb-5">
                <label htmlFor="message" className="block mb-2 font-medium text-sm sm:text-base">
                  Mensaje
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  className="w-full py-2.5 sm:py-3 px-3 sm:px-[15px] border border-[#ddd] rounded-[5px] font-sans text-sm sm:text-base transition-all duration-300 resize-y min-h-[100px] sm:min-h-[120px] focus:outline-none focus:border-primary focus:shadow-[0_0_0_2px_rgba(10,36,99,0.2)]"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary text-white border-none py-2.5 sm:py-3 px-6 sm:px-[30px] rounded-[5px] text-sm sm:text-base font-semibold cursor-pointer transition-all duration-300 inline-block w-full sm:w-auto hover:bg-primary-dark hover:-translate-y-[2px] hover:shadow-[0_5px_15px_rgba(10,36,99,0.3)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none disabled:hover:shadow-none"
              >
                {isSubmitting ? 'Enviando...' : 'Enviar mensaje'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
