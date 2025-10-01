interface ServiceCardProps {
  icon: string;
  title: string;
  description: string;
}

function ServiceCard({ icon, title, description }: ServiceCardProps) {
  return (
    <div className="bg-gray-light rounded-[10px] p-5 sm:p-6 md:p-[30px] text-center transition-all duration-300 shadow-[0_5px_15px_rgba(0,0,0,0.05)] hover:-translate-y-[10px] hover:shadow-[0_15px_30px_rgba(0,0,0,0.1)]">
      <i className="material-icons text-[40px] sm:text-[48px] text-primary mb-4 sm:mb-5">{icon}</i>
      <h3 className="font-heading text-lg sm:text-xl md:text-[22px] mb-3 sm:mb-[15px] text-primary">
        {title}
      </h3>
      <p className="text-sm sm:text-base">{description}</p>
    </div>
  );
}

export default function Services() {
  const services = [
    {
      icon: 'home',
      title: 'Instalaciones Eléctricas Residenciales',
      description:
        'Soluciones eléctricas seguras y eficientes para el hogar, con personal calificado y materiales de calidad.',
    },
    {
      icon: 'business',
      title: 'Instalaciones Eléctricas Comerciales e Industriales',
      description:
        'Proyectos eléctricos a gran escala para empresas e industrias, cumpliendo con todas las normativas vigentes.',
    },
    {
      icon: 'router',
      title: 'Redes de Telecomunicaciones',
      description:
        'Diseño, instalación y mantenimiento de redes de telecomunicaciones para garantizar conectividad óptima.',
    },
  ];

  return (
    <section id="servicios" className="py-12 sm:py-16 md:py-20 bg-white">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-5">
        <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-10 md:mb-[50px] text-primary relative after:content-[''] after:absolute after:bottom-[-10px] sm:after:bottom-[-15px] after:left-1/2 after:-translate-x-1/2 after:w-16 sm:after:w-20 after:h-1 after:bg-primary">
          Nuestros Servicios
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-[30px] mt-10 sm:mt-12 md:mt-[60px]">
          {services.map((service, index) => (
            <ServiceCard key={index} {...service} />
          ))}
        </div>
      </div>
    </section>
  );
}
