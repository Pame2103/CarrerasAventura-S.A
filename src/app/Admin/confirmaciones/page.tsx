'use client'
import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc, deleteDoc, doc, setDoc } from 'firebase/firestore';
import { db } from '../../../../firebase/firebase';
import Link from 'next/link';
import { FaRunning, FaInfoCircle, FaDumbbell, FaEnvelope, FaTrophy, FaSignInAlt } from 'react-icons/fa';

interface Participante {
  id: string;
  nombre: string;
  apellidos: string;
  evento: string;
  codigoComprobante: string;
  cedula: number;
}

function Confirmacionespago(): JSX.Element {
  const [participantes, setParticipantes] = useState<Participante[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const handleAprobar = async (id: string): Promise<void> => {
    console.log('Botón Aprobar clickeado. ID:', id);

    const participanteAprobado = participantes.find((participante) => participante.id === id);
    console.log('Participante encontrado:', participanteAprobado);

    if (participanteAprobado) {
      try {
        // Guarda el ID del documento antes de agregarlo
        const docId = id;
        
        await setDoc(doc(db, 'listaparticipantes', docId), participanteAprobado);
        console.log('Participante agregado a listaparticipantes. Document ID:', docId); // Utiliza el ID guardado
        
        await deleteDoc(doc(db, 'Inscripciones', id));
        console.log('Participante eliminado de Inscripciones.');

        setParticipantes(prevParticipantes => prevParticipantes.filter(participante => participante.id !== id));

      } catch (error) {
        console.error('Error al aprobar el participante:', error);
      }
    }
  };

  const handleRechazar = async (id: string): Promise<void> => {
    try {
      // Eliminar el participante de la base de datos
      await deleteDoc(doc(db, 'Inscripciones', id));
      console.log('Participante eliminado de la base de datos.');

      // Filtrar al participante de la lista
      setParticipantes(prevParticipantes => prevParticipantes.filter(participante => participante.id !== id));
    } catch (error) {
      console.error('Error al rechazar el participante:', error);
    }
  };

  useEffect(() => {
    const inscripcionesCollection = collection(db, 'Inscripciones');

    const unsubscribe = onSnapshot(inscripcionesCollection, (snapshot) => {
      const inscripcionesData = snapshot.docs.map((doc) => {
        const { id, nombre, apellidos, costo, evento, codigoComprobante, cedula } = doc.data();
        return { id: doc.id, nombre, apellidos, evento, codigoComprobante, cedula };
      });

      setParticipantes(inscripcionesData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const thStyle: React.CSSProperties = {
    backgroundColor: '#B1CEE3',
    fontWeight: 'bold',
    padding: '8px',
    border: '1px solid #ccc',
  };

  return (
    <div>
      <nav className="bg-white border-b border-gray-200 fixed w-full z-23 top-0 left-0 h-23">
        <div className="max-w-screen-2xl mx-auto px-6 sm:px-7 lg:px-9">
          <div className="flex items-center justify-between h-full">
            <div className="flex items-center">
              <Link href="/">
                <img src="/LogoC.png" className="h-20 w-auto" alt="Carrera Aventura" />
              </Link>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  <Link href="/Admin/administradorCarreras">
                    <span className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center">
                      <FaRunning className="mr-1" /> Administrar Carreras
                    </span>
                  </Link>
                  <Link href="/Admin/administrarTiempos">
                    <span className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center">
                      <FaInfoCircle className="mr-1" /> Administrar Tiempos
                    </span>
                  </Link>
                  <Link href="/Admin/carreras">
                    <span className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center">
                      <FaDumbbell className="mr-1" /> Carreras
                    </span>
                  </Link>
                  <Link href="/Admin/confirmaciones">
                    <span className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center">
                      <FaTrophy className="mr-1" /> Confirmación de Pagos
                    </span>
                  </Link>
                  <Link href="/Admin/historicosadmin">
                    <span className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center">
                      <FaInfoCircle className="mr-1" /> Históricos
                    </span>
                  </Link>
                  <Link href="/Admin/listaParticipantes">
                    <span className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center">
                      <FaTrophy className="mr-1" /> Lista de Participantes
                    </span>
                  </Link>
                  <Link href="/Admin/record">
                    <span className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center">
                      <FaEnvelope className="mr-1" /> Records
                    </span>
                  </Link>
                  <Link href="/Admin/resultados">
                    <span className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center">
                      <FaEnvelope className="mr-1" /> Resultados
                    </span>
                  </Link>
                </div>
              </div>
            </div>
            <div className="flex">
              <Link href="/Login" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium flex items-center">
                <FaSignInAlt className="mr-2" /> Cerrar sesión
              </Link>
            </div>
          </div>
          <div className="ml-10 text-gray-600 text-sm font-medium">¡Corre hacia tus metas con Carrera Aventura! ¡Cruzando la meta juntos!</div>
        </div>
      </nav>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '2rem', color: '#333', textAlign: 'center' }}>Comprobantes de Pago</h1>
      
      <img src="/SE.gif" alt="Descripción de la imagen" className="mx-auto mb-8" style={{ width: '250px', height: '200px' }} />
      <div className="white-container">
        <div className="table-container">
          <table className="w-full border-collapse border border-gray-300 shadow-lg rounded-center">
            <thead style={{ backgroundColor: '#B1CEE3' }} className="">
              <tr>
                <th style={thStyle}>Codigo Comprobante</th>
                <th style={thStyle}>Nombre</th>
                <th style={thStyle}>Apellidos</th>
                <th style={thStyle}>Cedula</th>
                <th style={thStyle}>Evento</th>
                <th style={thStyle}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {participantes.length === 0 ? (
                <tr style={{ height: '600px' }}>
                  <td colSpan={5} className="p-4 text-center" style={{ height: '600px' }}>
                    No hay participantes disponibles.
                  </td>
                </tr>
              ) : (
                participantes.map((participante) => (
                  <tr key={participante.id} className="hover:bg-gray-50">
                    <td className="border px-4 py-2">{participante.codigoComprobante}</td>
                    <td className="border px-4 py-2">{participante.nombre}</td>
                    <td className="border px-4 py-2">{participante.apellidos}</td>
                    <td className="border px-4 py-2">{participante.cedula}</td>
                    <td className="border px-4 py-2">{participante.evento}</td>
                    <td className="border px-4 py-2">
                      <button
                        onClick={() => handleAprobar(participante.id)}
                        style={{ backgroundColor: 'blue', color: 'white', marginRight: '5px' }}
                      >
                        Aprobar
                      </button>
                      <button
                        onClick={() => handleRechazar(participante.id)}
                        style={{ backgroundColor: 'red', color: 'white' }}
                      >
                        Rechazar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Confirmacionespago;
