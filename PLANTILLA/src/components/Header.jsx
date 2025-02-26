import React, { useState, useEffect } from "react";

const Header = () => {
  const [scrolling, setScrolling] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolling(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolling
          ? "bg-charcoal bg-opacity-95 shadow-lg"
          : "bg-white bg-opacity-10 backdrop-blur-md"
      }`}
    >
      <div className="flex justify-between items-center px-6 md:px-12 py-4">
        {/* Logo */}
        <h1 className="text-2xl md:text-4xl font-serif font-bold text-mustard tracking-wider">
          Beauty Luxe
        </h1>

        {/* Navigation */}
        <nav>
          <ul className="flex space-x-4 md:space-x-8 items-center">
            {["Inicio", "Servicios", "Productos", "Contacto"].map((item) => (
              <li key={item}>
                <a
                  href={`#${item.toLowerCase()}`}
                  className="text-lightGray uppercase text-sm md:text-base tracking-wider hover:text-mustard transition-colors duration-300"
                >
                  {item}
                </a>
              </li>
            ))}
            {/* Botones de autenticación */}
            <li>
              <button className="text-lightGray border border-mustard px-3 md:px-4 py-1 md:py-2 rounded-lg text-sm md:text-base hover:bg-mustard hover:text-jetBlack transition-all duration-300">
                Iniciar sesión
              </button>
            </li>
            <li>
              <button className="text-lightGray bg-mustard px-3 md:px-4 py-1 md:py-2 rounded-lg text-sm md:text-base hover:bg-bronze transition-all duration-300">
                Registrarse
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
