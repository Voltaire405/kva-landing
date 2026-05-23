export const defaultServices = [
  {
    icon: 'home',
    title: 'Instalaciones Eléctricas Residenciales',
    description:
      'Soluciones eléctricas seguras y eficientes para el hogar, con personal calificado y materiales de calidad.',
    sortOrder: 0,
  },
  {
    icon: 'business',
    title: 'Instalaciones Eléctricas Comerciales e Industriales',
    description:
      'Proyectos eléctricos a gran escala para empresas e industrias, cumpliendo con todas las normativas vigentes.',
    sortOrder: 1,
  },
  {
    icon: 'router',
    title: 'Redes de Telecomunicaciones',
    description:
      'Diseño, instalación y mantenimiento de redes de telecomunicaciones para garantizar conectividad óptima.',
    sortOrder: 2,
  },
];

export const defaultPortfolioItems = [
  {
    imageUrl: 'https://sfile.chatglm.cn/images-ppt/971ace48ce9a.jpg',
    title: 'Instalación Eléctrica Industrial',
    description: 'Proyecto completo para planta de manufactura',
    sortOrder: 0,
  },
  {
    imageUrl: 'https://sfile.chatglm.cn/images-ppt/17f0a54b1b55.jpg',
    title: 'Mantenimiento Eléctrico Comercial',
    description: 'Actualización de sistema eléctrico en centro comercial',
    sortOrder: 1,
  },
  {
    imageUrl: 'https://sfile.chatglm.cn/images-ppt/f0bcaaf5d0e6.jpg',
    title: 'Red de Datos Empresarial',
    description: 'Implementación de red estructurada para corporativo',
    sortOrder: 2,
  },
  {
    imageUrl: 'https://sfile.chatglm.cn/images-ppt/e169658367d4.jpg',
    title: 'Instalación de Fibra Óptica',
    description: 'Conectividad de alta velocidad para edificio de oficinas',
    sortOrder: 3,
  },
];

export const defaultClients = [
  { name: 'Industria Alimentaria S.A.', sortOrder: 0 },
  { name: 'Constructora del Norte', sortOrder: 1 },
  { name: 'Hospital Central', sortOrder: 2 },
  { name: 'Tecnologías Avanzadas Ltda.', sortOrder: 3 },
  { name: 'Centro Comercial Plaza Mayor', sortOrder: 4 },
];

export const defaultTestimonials = [
  {
    quote:
      'KvaTel ha sido nuestro aliado estratégico en todos los proyectos eléctricos de nuestra planta. Su profesionalismo y calidad de trabajo son excepcionales.',
    authorName: 'Juan Carlos Martínez',
    authorRole: 'Gerente de Operaciones, Industria Alimentaria S.A.',
    sortOrder: 0,
  },
  {
    quote:
      'La implementación de nuestra red de telecomunicaciones fue impecable. El equipo de KvaTel cumplió con los plazos establecidos y superó nuestras expectativas.',
    authorName: 'María Rodríguez',
    authorRole: 'Directora de TI, Tecnologías Avanzadas Ltda.',
    sortOrder: 1,
  },
  {
    quote:
      'Recomiendo ampliamente los servicios de KvaTel. Su atención al detalle y conocimiento técnico nos han permitido optimizar nuestros sistemas eléctricos.',
    authorName: 'Pedro López',
    authorRole: 'Administrador, Hospital Central',
    sortOrder: 2,
  },
];

export const defaultContactInfo = {
  id: 1,
  phone: '324 385 8798\n304 203 2012',
  email: 'kvatelsoluciones@gmail.com',
  address: 'Calle Principal #123, Ciudad',
  updatedAt: new Date().toISOString(),
};

export function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}
