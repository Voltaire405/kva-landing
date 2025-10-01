interface ServiceCardProps {
  icon: string;
  title: string;
  description: string;
}

function ServiceCard({ icon, title, description }: ServiceCardProps) {
  return (
    <div className="bg-gray-light rounded-[10px] p-[30px] text-center transition-all duration-300 shadow-[0_5px_15px_rgba(0,0,0,0.05)] hover:-translate-y-[10px] hover:shadow-[0_15px_30px_rgba(0,0,0,0.1)]">
      <i className="material-icons text-[48px] text-primary mb-5">{icon}</i>
      <h3 className="font-heading text-[22px] mb-[15px] text-primary">
        {title}
      </h3>
      <p>{description}</p>
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
    <section id="servicios" className="py-20 bg-white">
      <div className="max-w-[1200px] mx-auto px-5">
        <h2 className="font-heading text-4xl font-bold text-center mb-[50px] text-primary relative after:content-[''] after:absolute after:bottom-[-15px] after:left-1/2 after:-translate-x-1/2 after:w-20 after:h-1 after:bg-primary">
          Nuestros Servicios
        </h2>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-[30px] mt-[60px]">
          {services.map((service, index) => (
            <ServiceCard key={index} {...service} />
          ))}
        </div>
      </div>
    </section>
  );
}
