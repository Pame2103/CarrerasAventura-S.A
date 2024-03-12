import React from 'react'

export default function Fotter() {
  return (
    <div>
        <footer style={{ backgroundColor: '#B1CEE3', width: '1530px' }} className="rounded-lg shadow dark:bg-gray-900 m-4">
        <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
          <div className="sm:flex sm:items-center sm:justify-between">
            <a href="/acercade/acercade" className="flex items-center mb-4 sm:mb-0">
              <img src="/Aventura.png" className="h-12 mr-3" alt="/Aventura" />
              <img src="/CARRERAS.png" className="h-12 mr-3" alt="CARRERAS" />
              <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Carrera Aventura</span>
            </a>
            <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400">
              <li>
                <a href="/acercade/acercade" className="mr-4 hover:underline md:mr-6">Acerca de</a>
              </li>
            </ul>
          </div>
          <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
          <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2023 <a href="" className="hover:underline">CarrerasChirripo™</a>.Todos los derechos reservados.</span>
        </div>
      </footer>
    </div>
  )
}
