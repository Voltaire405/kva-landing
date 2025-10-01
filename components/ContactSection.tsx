'use client';

import { FormEvent } from 'react';

export default function ContactSection() {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    alert('Gracias por contactarnos. Nos comunicaremos con usted pronto.');
    e.currentTarget.reset();
  };

  return (
    <section id="contacto" className="py-20 bg-white">
      <div className="max-w-[1200px] mx-auto px-5">
        <h2 className="font-heading text-4xl font-bold text-center mb-[50px] text-primary relative after:content-[''] after:absolute after:bottom-[-15px] after:left-1/2 after:-translate-x-1/2 after:w-20 after:h-1 after:bg-primary">
          Contáctanos
        </h2>
        <div className="grid grid-cols-2 gap-[50px] mt-[60px]">
          <div className="flex flex-col justify-center">
            <div className="flex items-center mb-[25px]">
              <div className="text-2xl text-primary mr-[15px] bg-gray-medium w-[50px] h-[50px] rounded-full flex items-center justify-center">
                <i className="material-icons">phone</i>
              </div>
              <div>
                <h3 className="font-semibold">Teléfonos</h3>
                <p>324 385 8798</p>
                <p>304 203 2012</p>
              </div>
            </div>
            <div className="flex items-center mb-[25px]">
              <div className="text-2xl text-primary mr-[15px] bg-gray-medium w-[50px] h-[50px] rounded-full flex items-center justify-center">
                <i className="material-icons">email</i>
              </div>
              <div>
                <h3 className="font-semibold">Email</h3>
                <p>kvatelsoluciones@gmail.com</p>
              </div>
            </div>
            <div className="flex items-center mb-[25px]">
              <div className="text-2xl text-primary mr-[15px] bg-gray-medium w-[50px] h-[50px] rounded-full flex items-center justify-center">
                <i className="material-icons">location_on</i>
              </div>
              <div>
                <h3 className="font-semibold">Dirección</h3>
                <p>Calle Principal #123, Ciudad</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-light p-[30px] rounded-[10px] shadow-[0_5px_15px_rgba(0,0,0,0.05)]">
            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <label htmlFor="name" className="block mb-2 font-medium">
                  Nombre
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full py-3 px-[15px] border border-[#ddd] rounded-[5px] font-sans text-base transition-all duration-300 focus:outline-none focus:border-primary focus:shadow-[0_0_0_2px_rgba(10,36,99,0.2)]"
                />
              </div>
              <div className="mb-5">
                <label htmlFor="email" className="block mb-2 font-medium">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full py-3 px-[15px] border border-[#ddd] rounded-[5px] font-sans text-base transition-all duration-300 focus:outline-none focus:border-primary focus:shadow-[0_0_0_2px_rgba(10,36,99,0.2)]"
                />
              </div>
              <div className="mb-5">
                <label htmlFor="phone" className="block mb-2 font-medium">
                  Teléfono
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="w-full py-3 px-[15px] border border-[#ddd] rounded-[5px] font-sans text-base transition-all duration-300 focus:outline-none focus:border-primary focus:shadow-[0_0_0_2px_rgba(10,36,99,0.2)]"
                />
              </div>
              <div className="mb-5">
                <label htmlFor="message" className="block mb-2 font-medium">
                  Mensaje
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  className="w-full py-3 px-[15px] border border-[#ddd] rounded-[5px] font-sans text-base transition-all duration-300 resize-y min-h-[120px] focus:outline-none focus:border-primary focus:shadow-[0_0_0_2px_rgba(10,36,99,0.2)]"
                />
              </div>
              <button
                type="submit"
                className="bg-primary text-white border-none py-3 px-[30px] rounded-[5px] text-base font-semibold cursor-pointer transition-all duration-300 inline-block hover:bg-primary-dark hover:-translate-y-[2px] hover:shadow-[0_5px_15px_rgba(10,36,99,0.3)]"
              >
                Enviar mensaje
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
