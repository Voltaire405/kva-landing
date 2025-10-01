'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: '#servicios', label: 'Servicios' },
    { href: '#portafolio', label: 'Portafolio' },
    { href: '#clientes', label: 'Clientes' },
    { href: '#testimonios', label: 'Testimonios' },
    { href: '#contacto', label: 'Contacto' },
  ];

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-primary fixed w-full top-0 z-[1000] shadow-[0_2px_10px_rgba(0,0,0,0.1)]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-5 py-3 sm:py-[15px]">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center text-white">
            <div className="relative h-10 w-10 sm:h-12 sm:w-12 md:h-16 md:w-16">
              <Image
                src="/android-chrome-192x192.png"
                alt="KvaTel Logo"
                fill
                sizes="(max-width: 768px) 40px, (max-width: 1200px) 48px, 64px"
                className="object-contain"
                priority
              />
            </div>
            <div className="ml-2 sm:ml-[10px]">
              <div className="font-heading font-bold text-lg sm:text-xl md:text-2xl">
                KvaTel
              </div>
              <div className="text-[10px] sm:text-xs font-light -mt-[3px] sm:-mt-[5px] opacity-80">
                ENERGÍA Y TELECOMUNICACIONES
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <ul className="flex list-none">
              {navLinks.map((link) => (
                <li key={link.href} className="ml-6 lg:ml-[25px]">
                  <a
                    href={link.href}
                    className="text-white no-underline font-medium text-sm lg:text-base transition-all duration-300 pb-[5px] border-b-2 border-transparent hover:border-b-2 hover:border-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white p-2 focus:outline-none"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`md:hidden fixed inset-0 bg-primary z-[999] transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ top: '60px' }}
      >
        <nav className="flex flex-col items-center justify-center h-full">
          <ul className="flex flex-col items-center space-y-6">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={handleLinkClick}
                  className="text-white no-underline font-medium text-xl transition-all duration-300 hover:text-accent"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
