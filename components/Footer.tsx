export default function Footer() {
  return (
    <footer className="bg-primary text-white py-6 sm:py-8 md:py-[30px] text-center">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-5">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
          <div className="order-2 sm:order-1">
            <p className="text-xs sm:text-sm md:text-base">
              &copy; 2025 KvaTel - Energía y Telecomunicaciones. Todos los
              derechos reservados.
            </p>
          </div>
          <div className="flex gap-3 sm:gap-0 order-1 sm:order-2">
            <a
              href="#"
              className="text-white sm:ml-[15px] text-lg sm:text-xl transition-all duration-300 hover:text-accent hover:-translate-y-[3px]"
            >
              <i className="material-icons">facebook</i>
            </a>
            <a
              href="#"
              className="text-white sm:ml-[15px] text-lg sm:text-xl transition-all duration-300 hover:text-accent hover:-translate-y-[3px]"
            >
              <i className="material-icons">alternate_email</i>
            </a>
            <a
              href="#"
              className="text-white sm:ml-[15px] text-lg sm:text-xl transition-all duration-300 hover:text-accent hover:-translate-y-[3px]"
            >
              <i className="material-icons">language</i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
