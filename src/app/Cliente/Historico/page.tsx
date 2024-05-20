'use client'
import React, { useState, useEffect } from 'react';
import { db } from '../../../../firebase/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import Navbar from '@/app/componentes/navbar';

export default function Historico() {
  interface Carrera {
    id: string;
    nombreAtleta: string;
    posicion: number;
    tiempo: string;
    categoria: string;
    carrera: string;
    fecha: string;
  }

  const [busqueda, setBusqueda] = useState('');
  const [carreras, setCarreras] = useState<Carrera[]>([]);
  const [resultados, setResultados] = useState<Carrera[]>([]);
  const [hayResultados, setHayResultados] = useState(true);

  useEffect(() => {
    const historicosCollection = collection(db, 'administradortiempos');

    const unsubscribe = onSnapshot(historicosCollection, (snapshot) => {
      const historicosData: Carrera[] = snapshot.docs.map((doc) => {
        return { id: doc.id, ...doc.data() } as Carrera;
      });
      setCarreras(historicosData);
    });

    return () => unsubscribe();
  }, []);

  const handleBusquedaChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setBusqueda(e.target.value);
    if (!e.target.value) {
      setResultados([]);
      setHayResultados(true);
    }
  };

  const handleSearch = () => {
    if (busqueda.trim() !== '') {
      const resultados = carreras.filter((carreraItem: Carrera) => {
        const { nombreAtleta, categoria, carrera, fecha } = carreraItem;
        const busquedaLowerCase = busqueda.toLowerCase();
        return (
          nombreAtleta.toLowerCase().includes(busquedaLowerCase) ||
          carrera.toLowerCase().includes(busquedaLowerCase) ||
          fecha.includes(busquedaLowerCase)
        );
      });

      setResultados(resultados);
      setHayResultados(resultados.length > 0);
    } else {
      setResultados([]);
      setHayResultados(true);
    }
  };

  const renderTablaPorCarrera = (carrera: string) => {
    const carrerasFiltradas =
      resultados.length > 0
        ? resultados.filter(
            (carreraItem) => carreraItem.carrera === carrera
          )
        : carreras.filter((carreraItem) => carreraItem.carrera === carrera);
    return (
      <div key={carrera} className="mb-8">
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-4">
          {carrera}
        </h2>
        {renderTablasPorCategoria(carrerasFiltradas)}
      </div>
    );
  };

  const renderTablasPorCategoria = (carrerasFiltradas: Carrera[]) => {
    const categorias = Array.from(
      new Set(carrerasFiltradas.map((carrera) => carrera.categoria))
    );
    return categorias.map((categoria) => (
      <div key={categoria} className="mb-8">
        <h3 className="text-lg font-bold text-center text-gray-700 mb-4">
          {categoria}
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full bg-white shadow-md rounded-lg border border-gray-200">
            <thead>
              <tr className="bg-blue-500 text-white">
                <th className="py-2 px-4 text-center">Nombre</th>
                <th className="py-2 px-4 text-center">Posición</th>
                <th className="py-2 px-4 text-center">Tiempo</th>
                <th className="py-2 px-4 text-center">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {carrerasFiltradas
                .filter((carrera) => carrera.categoria === categoria)
                .map((carrera, index) => (
                  <tr
                    key={carrera.id}
                    className={
                      index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-200'
                    }
                  >
                    <td className="py-2 px-4 border text-center">
                      {carrera.nombreAtleta}
                    </td>
                    <td className="py-2 px-4 border text-center">
                      {carrera.posicion}
                    </td>
                    <td className="py-2 px-4 border text-center">
                      {carrera.tiempo}
                    </td>
                    <td className="py-2 px-4 border text-center">
                      {carrera.fecha}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    ));
  };

  const renderTablasPorCarrera = () => {
    const carrerasPorCarrera = Array.from(
      new Set(carreras.map((carrera) => carrera.carrera))
    );
    return carrerasPorCarrera.map((carrera) =>
      renderTablaPorCarrera(carrera)
    );
  };

  return (
    <div>
      <Navbar />
      <div className="p-4">
      <br />
      <br />
      <br />
      <br />

        <h1 className="text-3xl font-bold text-center text-blue-700 mb-8">
          Histórico de Corredores
        </h1>
        <div className="mb-4 flex flex-col md:flex-row justify-center items-center">
          <input
            type="text"
            placeholder="Buscar por nombre, carrera"
            value={busqueda}
            onChange={handleBusquedaChange}
            className="p-2 border rounded mb-2 md:mr-2 md:mb-0"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Buscar
          </button>
        </div>
        {!hayResultados && (
          <div className="text-red-500 font-bold mb-4">
            No se encontraron resultados.
          </div>
        )}
        {hayResultados && renderTablasPorCarrera()}
      </div>
    </div>
  );
}
