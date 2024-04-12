'use client'
import React from 'react'
import { FaRunning, FaInfoCircle, FaDumbbell, FaEnvelope, FaTrophy, FaFileAlt, FaHistory, FaSignInAlt } from 'react-icons/fa';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200 fixed w-full z-23 top-0 left-0 h-23"> {/* Ajustamos el alto del navbar */}
      <div className="max-w-screen-2xl mx-auto px-6 sm:px-7 lg:px-9"> {/* Cambiamos la clase max-w-7xl a max-w-screen-2xl para un ancho más grande */}
        <div className="flex items-center justify-between h-full"> {/* Ajustamos el alto del contenido del navbar */}
          <div className="flex items-center">
           
            <img src="/LogoC.png" className="h-20 w-auto" alt="Carrera Aventura" /> {/* Aumentamos el tamaño del logo */}
           
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link href="/" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center">
                  <FaRunning className="mr-1" /> Inicio
                </Link>
                <Link href="/Cliente/carreras" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center">
                  <FaInfoCircle className="mr-1" /> Carreras
                </Link>
                <Link href="/Cliente/Inscripciones" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center">
                  <FaDumbbell className="mr-1" /> Inscripciones
                </Link>
                <Link href="/Cliente/Historico" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center">
                  <FaTrophy className="mr-1" /> Histórico
                </Link>
                <Link href="/Cliente/resultados" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center">
                  <FaInfoCircle className="mr-1" /> Resultados
                </Link>
                <Link href="/Cliente/record" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center">
                  <FaTrophy className="mr-1" /> Records
                </Link>
                <Link href="/Cliente/Contact" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center">
                  <FaEnvelope className="mr-1" /> Contacto
                </Link>
              </div>
            </div>
          </div>
          <div className="flex">
            <a href="/Login" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium flex items-center">
              <FaSignInAlt className="mr-2" /> Ingresar
            </a>
          </div>
        </div>
        {/* Texto adicional dentro del navbar */}
        <div className="ml-10 text-gray-600 text-sm font-medium">¡Corre hacia tus metas con Carrera Aventura! ¡Cruzando la meta juntos!</div>
      </div>
    </nav>
  )
}
