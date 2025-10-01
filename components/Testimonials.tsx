interface TestimonialCardProps {
  text: string;
  authorInitials: string;
  authorName: string;
  authorRole: string;
}

function TestimonialCard({
  text,
  authorInitials,
  authorName,
  authorRole,
}: TestimonialCardProps) {
  return (
    <div className="bg-white rounded-[10px] p-5 sm:p-6 md:p-[30px] shadow-[0_5px_15px_rgba(0,0,0,0.05)] relative">
      <span className="absolute top-2 sm:top-[10px] left-4 sm:left-5 text-[48px] sm:text-[60px] text-primary opacity-20 font-heading pointer-events-none">
        &quot;
      </span>
      <p className="italic mb-4 sm:mb-5 relative z-[1] text-sm sm:text-base">{text}</p>
      <div className="flex items-center">
        <div className="w-10 h-10 sm:w-[50px] sm:h-[50px] rounded-full bg-primary text-white flex items-center justify-center font-semibold mr-3 sm:mr-[15px] text-sm sm:text-base">
          {authorInitials}
        </div>
        <div>
          <h4 className="font-heading text-sm sm:text-base mb-[3px]">{authorName}</h4>
          <p className="text-xs sm:text-sm text-text-secondary">{authorRole}</p>
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  const testimonials = [
    {
      text: 'KvaTel ha sido nuestro aliado estratégico en todos los proyectos eléctricos de nuestra planta. Su profesionalismo y calidad de trabajo son excepcionales.',
      authorInitials: 'JC',
      authorName: 'Juan Carlos Martínez',
      authorRole: 'Gerente de Operaciones, Industria Alimentaria S.A.',
    },
    {
      text: 'La implementación de nuestra red de telecomunicaciones fue impecable. El equipo de KvaTel cumplió con los plazos establecidos y superó nuestras expectativas.',
      authorInitials: 'MR',
      authorName: 'María Rodríguez',
      authorRole: 'Directora de TI, Tecnologías Avanzadas Ltda.',
    },
    {
      text: 'Recomiendo ampliamente los servicios de KvaTel. Su atención al detalle y conocimiento técnico nos han permitido optimizar nuestros sistemas eléctricos.',
      authorInitials: 'PL',
      authorName: 'Pedro López',
      authorRole: 'Administrador, Hospital Central',
    },
  ];

  return (
    <section id="testimonios" className="py-12 sm:py-16 md:py-20 bg-gray-light">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-5">
        <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-10 md:mb-[50px] text-primary relative after:content-[''] after:absolute after:bottom-[-10px] sm:after:bottom-[-15px] after:left-1/2 after:-translate-x-1/2 after:w-16 sm:after:w-20 after:h-1 after:bg-primary">
          Lo que dicen nuestros clientes
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-[30px] mt-10 sm:mt-12 md:mt-[60px]">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
}
