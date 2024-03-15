
'use client'
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { db } from '../../../../firebase/firebase';
import { getFirestore, collection, onSnapshot, addDoc } from 'firebase/firestore';
import Layout from '@/app/layout';
import {
  faCog,
  faChartBar,
  faHistory,
  faMoneyCheckAlt,
  faEnvelope,
} from '@fortawesome/free-solid-svg-icons';

interface Participante {
  id: string;
  cedula: string;
  nombre: string;
  apellidos: string;
  evento: string;
}

function ListaParticipantes(): JSX.Element {
  const [eventoSeleccionado, setEventoSeleccionado] = useState<string>('Todos');
  const [participantes, setParticipantes] = useState<Participante[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const inscripcionesCollection = collection(db, 'listaparticipantes');
  
    const unsubscribe = onSnapshot(inscripcionesCollection, (snapshot) => {
      const inscripcionesData = snapshot.docs.map((doc) => doc.data() as Participante);
      setParticipantes(inscripcionesData);
      setLoading(false);
    });
  
    return () => unsubscribe();
  }, []);

  const eventos = Array.from(new Set(participantes.map(participante => participante.evento)) || []);

  const handleAprobar = async (id: string) => {
    const updatedParticipantes = participantes.map(participante => {
      if (participante.id === id) {
        return { ...participante, estado: 'Aprobado' };
      }
      return participante;
    });
    setParticipantes(updatedParticipantes);

    // Agregar lógica para cargar los datos actualizados a Firebase
    try {
      await addDoc(collection(db, 'listaparticipantes'), participantes.find(p => p.id === id));
      console.log('Datos actualizados en la colección listaparticpantes.');
    } catch (error) {
      console.error('Error al agregar datos a Firebase:', error);
    }
  };

  const handleRechazar = async (id: string) => {
    const updatedParticipantes = participantes.map(participante => {
      if (participante.id === id) {
        return { ...participante, estado: 'Rechazado' };
      }
      return participante;
    });
    setParticipantes(updatedParticipantes);

    // Agregar lógica para cargar los datos actualizados a Firebase
    try {
      await addDoc(collection(db, 'listaparticpantes'), participantes.find(p => p.id === id));
      console.log('Datos actualizados en la colección listaparticpantes.');
    } catch (error) {
      console.error('Error al agregar datos a Firebase:', error);
    }
  };

  return (
    <>
      <nav className="bg-blue-700 p-4">
        <div className="container mx-auto">
       
          <ul className="flex space-x-20">
            <li>
              <FontAwesomeIcon icon={faCog} className="text-white" />
              <a href="/administradorCarreras/administradorcarreras" className="text-white">Administrar carreras</a>
            </li>  
            <li>
                <FontAwesomeIcon icon={faCog} className="text-white" /><a href="/configuraciones/configuraciones" className="text-white">Configuraciones</a>
            </li>
            <li>
                <FontAwesomeIcon icon={faChartBar} className="text-white" /><a href="/resultados/resultados" className="text-white">Resultados</a>
            </li>
            <li>
                <FontAwesomeIcon icon={faHistory} className="text-white" /><a href="/historicosadmi/historicosadmi" className="text-white">Historicos</a>
            </li>
            <li>
                <FontAwesomeIcon icon={faHistory} className="text-white" /><a href="/administrarTiempos/administrarTiempos" className="text-white">Administrar tiempos</a>
            </li>
            <li>
                <FontAwesomeIcon icon={faMoneyCheckAlt} className="text-white" /><a href="/confirmacionesdepago/confirmaciones" className="text-white">Confirmacion de Pagos</a>
            </li> 
            <li>
                <FontAwesomeIcon icon={faEnvelope} className="text-white" /><a href="/listaParticipantes/listaParticipantes" className="text-white">Lista de Participantes </a>
            </li>
          </ul>
        </div>
      </nav>
      <div className="container mx-auto p-4">
      <h2 style={{ textAlign: 'center', fontSize: '2em', fontWeight: 'bold' }}>Comprobantes de Pago</h2>
        <div className="mb-4">
          <label htmlFor="evento">Seleccionar Evento:</label>
          <select 
            id="evento" 
            className="ml-2 p-2 border rounded" 
            value={eventoSeleccionado}
            onChange={(e) => setEventoSeleccionado(e.target.value)}
          >
            <option value="Todos">Todos</option>
            {eventos.map(evento => (
              <option key={evento} value={evento}>{evento}</option>
            ))}
          </select>
        </div>
        <table className="table-center w-full border-collapse border border-gray-300 shadow-lg rounded-center">
        <thead style={{ backgroundColor: '#B1CEE3' }} className="">
            <tr>
              <th className="border px-4 py-2">Cedula</th>
              <th className="border px-4 py-2">Nombre</th>
              <th className="border px-4 py-2">Apellidos</th>
              <th className="border px-4 py-2">Evento</th>
            </tr>
          </thead>
          <tbody>
          {participantes.length === 0 ? (
             <tr style={{ height: '600px' }}>
             <td colSpan={6} className="p-4 text-center" style={{ height: '600px' }}>
               No hay participantes .
             </td>
           </tr>
           
            ) : (
              participantes.map(participante => (
                <tr key={participante.id} className="hover:bg-gray-100">
                  <td className="border px-4 py-2">{participante.cedula}</td>
                  <td className="border px-4 py-2">{participante.nombre}</td>
                  <td className="border px-4 py-2">{participante.apellidos}</td>
                  <td className="border px-4 py-2">{participante.evento}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default ListaParticipantes;
