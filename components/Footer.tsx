export default function Footer() {
  return (
    <footer className="bg-primary text-white py-[30px] text-center">
      <div className="max-w-[1200px] mx-auto px-5">
        <div className="flex justify-between items-center">
          <div>
            <p>
              &copy; 2025 KvaTel - Energía y Telecomunicaciones. Todos los
              derechos reservados.
            </p>
          </div>
          <div className="flex">
            <a
              href="#"
              className="text-white ml-[15px] text-xl transition-all duration-300 hover:text-accent hover:-translate-y-[3px]"
            >
              <i className="material-icons">facebook</i>
            </a>
            <a
              href="#"
              className="text-white ml-[15px] text-xl transition-all duration-300 hover:text-accent hover:-translate-y-[3px]"
            >
              <i className="material-icons">alternate_email</i>
            </a>
            <a
              href="#"
              className="text-white ml-[15px] text-xl transition-all duration-300 hover:text-accent hover:-translate-y-[3px]"
            >
              <i className="material-icons">language</i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
