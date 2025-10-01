export default function Hero() {
  return (
    <section className="bg-gradient-to-br from-primary to-primary-light text-white pt-[150px] pb-[100px] text-center">
      <div className="max-w-[1200px] mx-auto px-5">
        <h1 className="font-heading text-5xl font-bold mb-5">
          Soluciones Integrales en Energía y Telecomunicaciones
        </h1>
        <p className="text-xl max-w-[700px] mx-auto mb-10 opacity-90">
          Especialistas en instalaciones eléctricas residenciales, comerciales e industriales y redes de telecomunicaciones
        </p>
        <a
          href="#contacto"
          className="inline-block bg-white text-primary py-[15px] px-[30px] rounded-[30px] no-underline font-semibold transition-all duration-300 shadow-[0_5px_15px_rgba(0,0,0,0.1)] hover:-translate-y-[3px] hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)]"
        >
          Contáctanos
        </a>
      </div>
    </section>
  );
}
