'use client'

import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../../../firebase/firebase';

interface Participante {
  id: string;
  nombre: string;
  apellidos: string;
  evento: string;
  codigoComprobante: string;
  cedula : number;
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
        const docRef = await addDoc(collection(db, 'listaparticipantes'), participanteAprobado);
        console.log('Participante agregado a listaparticipantes. Document ID:', docRef.id);

        await deleteDoc(doc(db, 'Inscripciones', id));
        console.log('Participante eliminado de Inscripciones.');

        const updatedParticipantes = participantes.filter((participante) => participante.id !== id);
        setParticipantes(updatedParticipantes); // Actualiza el estado de participantes eliminando al participante aprobado

      } catch (error) {
        console.error('Error al aprobar el participante:', error);
      }
    }
  };

  const handleRechazar = (id: string): void => {
    const updatedParticipantes = participantes.filter((participante) => participante.id !== id);
    setParticipantes(updatedParticipantes); // Actualiza el estado de participantes eliminando al participante rechazado
  };

  useEffect(() => {
    const inscripcionesCollection = collection(db, 'Inscripciones');

    const unsubscribe = onSnapshot(inscripcionesCollection, (snapshot) => {
      const inscripcionesData = snapshot.docs.map((doc) => {
        const { id, nombre, apellidos, costo, evento, codigoComprobante,cedula } = doc.data();
        return { id: doc.id, nombre, apellidos, evento, codigoComprobante,cedula };
      });

      setParticipantes(inscripcionesData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      <br />
      <br />
      <br />
      <br />
      <h2 style={{ textAlign: 'center', fontSize: '2em', fontWeight: 'bold' }}>Comprobantes de Pago</h2>
      <br />
      <br />
      <table className="table-center w-full border-collapse border border-gray-300 shadow-lg rounded-center">
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
              <tr key={participante.id} className="hover:bg-gray-100">
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
                    style={{ backgroundColor: 'blue', color: 'white' }}
                  >
                    Rechazar
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
    </>
  );
}

const thStyle: React.CSSProperties = {
  backgroundColor: '#B1CEE3',
  fontWeight: 'bold',
  padding: '8px',
  border: '1px solid #ccc',
};

export default Confirmacionespago;
