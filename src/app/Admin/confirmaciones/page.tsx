'use client'
import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../../../firebase/firebase';
import Link from 'next/link';
import { FaRunning, FaInfoCircle, FaDumbbell, FaEnvelope, FaTrophy, FaSignInAlt } from 'react-icons/fa';
import emailjs from 'emailjs-com';

interface Participante {
  id: string;
  nombreCarrera: string;
  nombre: string;
  apellidos: string;
  cedula: string;
  sexo: string;
  edad: string;
  email: string;
  telefono: string;
  nacimiento: string;
  tallaCamisa: string;
  lateralidad: string;
  nombreEmergencia: string;
  telefonoEmergencia: string;
  parentescoEmergencia: string;
  provincia: string;
  totalMonto: string;
  beneficiarioPoliza: string;
  metodoPago: string;
  discapacidad: string;
  tipoDiscapacidad: string;
  alergiaMedicamento: string;
  pais: string;
  evento: string;
  codigoComprobante: string;
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

        await deleteDoc(doc(db, 'inscripciones', id));
        console.log('Participante eliminado de Inscripciones.');

        const updatedParticipantes = participantes.filter((participante) => participante.id !== id);
        setParticipantes(updatedParticipantes);

        await enviarCorreoElectronico(participanteAprobado);
      } catch (error) {
        console.error('Error al aprobar el participante:', error);
      }
    }
  };

  const handleRechazar = async (id: string): Promise<void> => {
    console.log('Botón Rechazar clickeado. ID:', id);
    
    try {
      await deleteDoc(doc(db, 'inscripciones', id));
      console.log('Participante eliminado de Inscripciones.');

      const updatedParticipantes = participantes.filter((participante) => participante.id !== id);
      setParticipantes(updatedParticipantes);
    } catch (error) {
      console.error('Error al rechazar el participante:', error);
    }
  };

  const enviarCorreoElectronico = async (participante: Participante): Promise<void> => {
    try {
      const serviceID = 'service_bnz01rp';
      const templateID = 'template_gj4zjzf';
      const apiKey = 'JSjt1Iy2WCW_LmdQm'; 

      const formData = {
        to_email: 'destinatario@example.com',
        from_name: 'Remitente',
        subject: 'Solicitud de participante aprobada',
        message: `El participante ${participante.nombre} ${participante.apellidos} ha sido aprobado para el evento ${participante.evento}.`
      };

      await emailjs.send(serviceID, templateID, formData, apiKey);
      console.log('Correo electrónico enviado exitosamente.');
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  };

  useEffect(() => {
    const inscripcionesCollection = collection(db, 'inscripciones');
   
    const unsubscribe = onSnapshot(inscripcionesCollection, (snapshot) => {
       const inscripcionesData = snapshot.docs.map((doc) => {
         const { id, nombre, cedula, apellidos, sexo, edad, email, confirmarEmail, telefono, nacimiento, tallaCamisa, lateralidad, nombreEmergencia, telefonoEmergencia, parentescoEmergencia, provincia, totalMonto, beneficiarioPoliza, metodoPago, discapacidad, tipoDiscapacidad, alergiaMedicamento, pais, evento, codigoComprobante } = doc.data();
         return {
           id: doc.id,
           nombreCarrera: '',
           nombre,
           cedula,
           apellidos,
           sexo,
           edad,
           email,
           confirmarEmail,
           telefono,
           nacimiento,
           tallaCamisa,
           lateralidad,
           nombreEmergencia,
           telefonoEmergencia,
           parentescoEmergencia,
           provincia,
           totalMonto,
           beneficiarioPoliza,
           metodoPago,
           discapacidad,
           tipoDiscapacidad,
           alergiaMedicamento,
           pais,
           evento,
           codigoComprobante,
           aprobado: false,
         };
       });
   
       const participantesPendientes = inscripcionesData.filter(participante => !participante.aprobado);
       setParticipantes(participantesPendientes);
       setLoading(false);
    });
   
    return () => unsubscribe();
   }, []);
   
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
      <h2 style={{ textAlign: 'center', fontSize: '2em', fontWeight: 'bold' }}>Comprobantes de Pago</h2>
      <br />
      <br />
      <table className="table-center w-full border-collapse border border-gray-300 shadow-lg rounded-center">
        <thead style={{ backgroundColor: '#B1CEE3' }} className="">
          <tr>
            <th style={thStyle}>Codigo Comprobante</th>
            <th style={thStyle}>Nombre</th>
            <th style={thStyle}>Apellidos</th>
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
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
    </div>
  );
}

const thStyle: React.CSSProperties = {
  backgroundColor: '#B1CEE3',
  fontWeight: 'bold',
  padding: '8px',
  border: '1px solid #ccc',
};

export default Confirmacionespago;
