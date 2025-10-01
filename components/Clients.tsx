interface ClientItemProps {
  name: string;
}

function ClientItem({ name }: ClientItemProps) {
  return (
    <div className="bg-gray-light py-5 px-10 rounded-[10px] shadow-[0_5px_15px_rgba(0,0,0,0.05)] transition-all duration-300 min-w-[180px] text-center hover:-translate-y-[5px] hover:shadow-[0_10px_20px_rgba(0,0,0,0.1)]">
      <h3 className="font-heading text-lg text-primary">{name}</h3>
    </div>
  );
}

export default function Clients() {
  const clients = [
    'Industria Alimentaria S.A.',
    'Constructora del Norte',
    'Hospital Central',
    'Tecnologías Avanzadas Ltda.',
    'Centro Comercial Plaza Mayor',
  ];

  return (
    <section id="clientes" className="py-20 bg-white">
      <div className="max-w-[1200px] mx-auto px-5">
        <h2 className="font-heading text-4xl font-bold text-center mb-[50px] text-primary relative after:content-[''] after:absolute after:bottom-[-15px] after:left-1/2 after:-translate-x-1/2 after:w-20 after:h-1 after:bg-primary">
          Nuestros Clientes
        </h2>
        <div className="flex flex-wrap justify-center items-center gap-10 mt-[60px]">
          {clients.map((client, index) => (
            <ClientItem key={index} name={client} />
          ))}
        </div>
      </div>
    </section>
  );
}
