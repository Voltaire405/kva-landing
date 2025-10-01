'use client';

export default function Header() {
  return (
    <header className="bg-primary fixed w-full top-0 z-[1000] shadow-[0_2px_10px_rgba(0,0,0,0.1)]">
      <div className="max-w-[1200px] mx-auto px-5 py-[15px]">
        <div className="flex justify-between items-center">
          <div className="flex items-center text-white">
            <i className="material-icons text-[36px]">electrical_services</i>
            <div className="ml-[10px]">
              <div className="font-heading font-bold text-2xl">KvaTel</div>
              <div className="text-xs font-light -mt-[5px] opacity-80">
                ENERGÍA Y TELECOMUNICACIONES
              </div>
            </div>
          </div>
          <nav>
            <ul className="flex list-none">
              <li className="ml-[25px]">
                <a
                  href="#servicios"
                  className="text-white no-underline font-medium transition-all duration-300 pb-[5px] border-b-2 border-transparent hover:border-b-2 hover:border-white"
                >
                  Servicios
                </a>
              </li>
              <li className="ml-[25px]">
                <a
                  href="#portafolio"
                  className="text-white no-underline font-medium transition-all duration-300 pb-[5px] border-b-2 border-transparent hover:border-b-2 hover:border-white"
                >
                  Portafolio
                </a>
              </li>
              <li className="ml-[25px]">
                <a
                  href="#clientes"
                  className="text-white no-underline font-medium transition-all duration-300 pb-[5px] border-b-2 border-transparent hover:border-b-2 hover:border-white"
                >
                  Clientes
                </a>
              </li>
              <li className="ml-[25px]">
                <a
                  href="#testimonios"
                  className="text-white no-underline font-medium transition-all duration-300 pb-[5px] border-b-2 border-transparent hover:border-b-2 hover:border-white"
                >
                  Testimonios
                </a>
              </li>
              <li className="ml-[25px]">
                <a
                  href="#contacto"
                  className="text-white no-underline font-medium transition-all duration-300 pb-[5px] border-b-2 border-transparent hover:border-b-2 hover:border-white"
                >
                  Contacto
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
