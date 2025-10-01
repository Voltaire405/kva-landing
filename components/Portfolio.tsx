import Image from 'next/image';

interface PortfolioItemProps {
  image: string;
  title: string;
  description: string;
}

function PortfolioItem({ image, title, description }: PortfolioItemProps) {
  return (
    <div className="relative rounded-[10px] overflow-hidden shadow-[0_5px_15px_rgba(0,0,0,0.1)] transition-all duration-300 h-[200px] sm:h-[220px] md:h-[250px] group hover:scale-[1.03] hover:shadow-[0_10px_25px_rgba(0,0,0,0.15)]">
      <Image
        src={image}
        alt={title}
        fill
        className="object-cover transition-all duration-500 group-hover:scale-110"
      />
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[rgba(10,36,99,0.9)] to-transparent p-3 sm:p-4 md:p-5 text-white translate-y-full transition-all duration-300 group-hover:translate-y-0">
        <h3 className="font-heading text-base sm:text-lg mb-1 sm:mb-[5px]">{title}</h3>
        <p className="text-xs sm:text-sm">{description}</p>
      </div>
    </div>
  );
}

export default function Portfolio() {
  const portfolioItems = [
    {
      image: 'https://sfile.chatglm.cn/images-ppt/971ace48ce9a.jpg',
      title: 'Instalación Eléctrica Industrial',
      description: 'Proyecto completo para planta de manufactura',
    },
    {
      image: 'https://sfile.chatglm.cn/images-ppt/17f0a54b1b55.jpg',
      title: 'Mantenimiento Eléctrico Comercial',
      description: 'Actualización de sistema eléctrico en centro comercial',
    },
    {
      image: 'https://sfile.chatglm.cn/images-ppt/f0bcaaf5d0e6.jpg',
      title: 'Red de Datos Empresarial',
      description: 'Implementación de red estructurada para corporativo',
    },
    {
      image: 'https://sfile.chatglm.cn/images-ppt/e169658367d4.jpg',
      title: 'Instalación de Fibra Óptica',
      description: 'Conectividad de alta velocidad para edificio de oficinas',
    },
  ];

  return (
    <section id="portafolio" className="py-12 sm:py-16 md:py-20 bg-gray-light">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-5">
        <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-10 md:mb-[50px] text-primary relative after:content-[''] after:absolute after:bottom-[-10px] sm:after:bottom-[-15px] after:left-1/2 after:-translate-x-1/2 after:w-16 sm:after:w-20 after:h-1 after:bg-primary">
          Nuestros Trabajos
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-[25px] mt-10 sm:mt-12 md:mt-[60px]">
          {portfolioItems.map((item, index) => (
            <PortfolioItem key={index} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}
