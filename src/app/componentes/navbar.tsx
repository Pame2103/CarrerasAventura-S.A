'use client'
import React from 'react'
import { FaRunning, FaInfoCircle, FaDumbbell, FaEnvelope, FaTrophy, FaFileAlt, FaHistory } from 'react-icons/fa';
import Link from 'next/link';


export default function Navbar() {
  return (
    <div>
     <nav className="bg-[#B1CEE3] dark:bg-gray-900 fixed w-full z-20 top-0 left-0 border-b border-gray-200 dark:border-gray-600">
      <div className="max-w-screen-xl flex items-center justify-between mx-auto p-4">
        <Link href="/" className="flex items-center">
          <img src="/Aventura.png" className="h-12 mr-3" alt="Carrera Aventura" />
          <img src="/CARRERAS.png" className="h-12 mr-3" alt="CARRERAS" />
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Carrera Aventura</span>
        </Link>
        <div className="flex md:order-2">
        <a href="/Login" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center mr-3 md:mr-0 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
          Iniciar Sesión
        </a>
        </div>
        <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-sticky">
          <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li>
            <Link href="/" className="flex items-center py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">
  <FaRunning className="mr-1" /> Inicio
</Link>
            </li>
            <li>
              <Link href="/Cliente/carreras" className="flex items-center py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">
                <FaInfoCircle className="mr-1" /> Carreras
              </Link>
            </li>
            <li>
              <Link href="/Cliente/inscripciones" className="flex items-center py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">
                <FaDumbbell className="mr-1" /> Inscripciones en línea
              </Link>
            </li>
            <li>
              <Link href="/Cliente/Historico" className="flex items-center py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">
                <FaTrophy className="mr-1" /> Histórico
              </Link>
            </li>
            
            <li>
              <Link href="/Cliente/Contact" className="flex items-center py-2 pl-3 pr-4 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">
                <FaEnvelope className="mr-1" /> Contacto
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>   
    </div>
  )
}
