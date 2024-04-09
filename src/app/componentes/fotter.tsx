import React from 'react';
import { FaFacebook, FaWhatsapp, FaPhone, FaInstagram } from 'react-icons/fa';

export default function Footer() {
  return (
    <div>
      <footer style={{ backgroundColor: '#ffffff', width: '1530px' }} className="rounded-lg shadow dark:bg-gray-900 m-4">
        <div className="w-full max-w-screen-xl mx-auto p-4 md:py-1">
          <div className="sm:flex sm:items-center sm:justify-between">
            <a href="/acercade/acercade" className="flex items-center mb-4 sm:mb-0">
              <img src="/LogoC.png" className="h-28 mr-6" alt="/Aventura" />
              <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Carrera Aventura</span>
            </a>
            <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400">
              <li>
                <a href="/acercade/acercade" className="mr-4 hover:underline md:mr-6 text-lg">Acerca de</a>
              </li>
              {/* Agrega íconos de redes sociales */}
              <li><FaFacebook className="mr-4 text-3xl text-gray-500 hover:text-blue-500" /></li>
              <li><FaWhatsapp className="mr-4 text-3xl text-gray-500 hover:text-green-500" /></li>
              <li><FaPhone className="mr-4 text-3xl text-gray-500 hover:text-gray-900" /></li>
              <li><FaInstagram className="mr-4 text-3xl text-gray-500 hover:text-purple-500" /></li>
            </ul>
          </div>
          <div className="ml-10 text-gray-600 text-sm font-medium">¡Corre hacia tus metas con Carrera Aventura! ¡Cruzando la meta juntos!</div>
          <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
          <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2024 <a href="" className="hover:underline">Carreras Aventura™</a>.Todos los derechos reservados.</span>
        </div>
      </footer>
    </div>
  )
}
