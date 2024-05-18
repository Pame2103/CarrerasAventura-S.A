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

  const handleBusquedaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBusqueda(e.target.value);
    if (!e.target.value) {
      setResultados([]);
      setHayResultados(true);
    }
  };

  useEffect(() => {
    const historicosCollection = collection(db, 'administradortiempos');

    const unsubscribe = onSnapshot(historicosCollection, (snapshot) => {
      const historicosData: Carrera[] = snapshot.docs.map((doc) => {
        return { id: doc.id,...doc.data() } as Carrera;
      });
      setCarreras(historicosData);
    });

    
    return () => unsubscribe();
  }, []);

  const handleSearch = () => {
    if (busqueda.trim()!== '') {
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

  const carouselImages = [
    "\Carre.gif",
    "\Carreras Aventura (1).gif",
    "\Ca(1).gif",
  ];
  <div className="flex justify-center mb-8">
  {carouselImages.map((image, index) => (
    <img
      key={index}
      src={image}
      alt={`Descripción de la imagen ${index + 1}`}
      className="shadow-lg transition-transform hover:scale-110 carousel-image"
      style={{ width: '350px', height: '250px', borderRadius: '15px', marginRight: '25px' }}
    />
  ))}
</div>
  const renderFilas = () => {
    let filas;
    if (resultados.length > 0) {
      filas = [...resultados].sort((a, b) => a.posicion - b.posicion);
    } else {
      filas = [...carreras];
    }

    return filas.map(carrera => (
      <tr key={carrera.id}>
        <td className="p-2 border text-center">{carrera.nombreAtleta}</td>
        <td className="p-2 border text-center">{carrera.posicion}</td>
        <td className="p-2 border text-center">{carrera.tiempo}</td>
        <td className="p-2 border text-center">{carrera.categoria}</td>
        <td className="p-2 border text-center">{carrera.fecha}</td>
        <td className="p-2 border text-center">{carrera.carrera}</td>
      </tr>
    ));
  };

  return (
    <div>
      <Navbar />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <div className="p-4">

        <h2 style={{ textAlign: 'center', fontSize: '2em', fontWeight: 'bold', backgroundColor: '#3B79D8', color: 'white' }}>Histórico de Corredores</h2>
                <br/>
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
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border" >
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="p-2 text-center">Nombre</th>
                <th className="p-2 text-center">Posición</th>
                <th className="p-2 text-center">Tiempo</th>
                <th className="p-2 text-center">Categoría</th>
                <th className="p-2 text-center">Fecha</th>
                <th className="p-2 text-center">Carrera</th>
              </tr>
            </thead>
            <tbody>
              {renderFilas()}
            </tbody>
          </table>
        </div>
      </div>   
    </div>
  );
}
