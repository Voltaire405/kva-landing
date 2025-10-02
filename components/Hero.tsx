import Image from 'next/image';

export default function Hero() {
  return (
    <section className="bg-gradient-to-br from-primary to-primary-light text-white pt-24 sm:pt-28 md:pt-32 lg:pt-36 xl:pt-[150px] pb-12 sm:pb-16 md:pb-20 lg:pb-[100px] text-center relative">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-5">
        <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-5 leading-tight">
          Soluciones Integrales en Energía y Telecomunicaciones
        </h1>
        <p className="text-sm sm:text-base md:text-lg lg:text-xl max-w-[700px] mx-auto mb-6 sm:mb-8 md:mb-10 opacity-90 px-2">
          Especialistas en instalaciones eléctricas residenciales, comerciales e industriales y redes de telecomunicaciones
        </p>
        
        <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 mx-auto mb-6 sm:mb-8 opacity-80">
          <Image
            src="/kvatel-logo.png"
            alt="KvaTel Logo"
            fill
            sizes="(max-width: 640px) 128px, (max-width: 768px) 160px, 192px"
            className="object-contain"
            priority
          />
        </div>

        <a
          href="#contacto"
          className="inline-block bg-white text-primary py-3 px-6 sm:py-[15px] sm:px-[30px] rounded-[30px] no-underline text-sm sm:text-base font-semibold transition-all duration-300 shadow-[0_5px_15px_rgba(0,0,0,0.1)] hover:-translate-y-[3px] hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)]"
        >
          Contáctanos
        </a>
      </div>
    </section>
  );
}
