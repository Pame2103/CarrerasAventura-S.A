'use client'
import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../../../firebase/firebase';
import Link from 'next/link';
import Modal from 'react-modal';
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
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState<Participante | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string>("");

  const handleAprobar = async (id: string): Promise<void> => {
    console.log('Botón Aprobar clickeado. ID:', id);

    const participanteAprobado = participantes.find((participante) => participante.id === id);
    console.log('Participante encontrado:', participanteAprobado);

    if (participanteAprobado) {
      try {
        // Eliminar participante de la colección "Inscripciones"
        await deleteDoc(doc(db, 'Inscripciones', id));
        console.log('Participante eliminado de Inscripciones.');

        // Enviar correo electrónico al participante aprobado
        await enviarCorreoElectronico(participanteAprobado);

        // Actualizar la lista de participantes eliminando al participante aprobado
        const updatedParticipantes = participantes.filter((participante) => participante.id !== id);
        setParticipantes(updatedParticipantes);

        // Abrir el modal
        setModalIsOpen(true);
      } catch (error) {
        console.error('Error al aprobar el participante:', error);
      }
    }
  };

  const handleRechazar = async (id: string): Promise<void> => {
    console.log('Botón Rechazar clickeado. ID:', id);
    
    try {
      // Eliminar participante de la colección "Inscripciones"
      await deleteDoc(doc(db, 'inscripciones', id));
      console.log('Participante eliminado de Inscripciones.');

      // Abrir el modal para ingresar el motivo de rechazo
      setModalIsOpen(true);
      setSelectedParticipant(participantes.find((participante) => participante.id === id) || null);
    } catch (error) {
      console.error('Error al rechazar el participante:', error);
    }
  };

  const enviarCorreoElectronico = async (participante: Participante): Promise<void> => {
    try {
      // Código para enviar correo electrónico de aceptación
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  };

  const enviarCorreoRechazo = async (participante: Participante, motivo: string): Promise<void> => {
    try {
      // Código para enviar correo electrónico de rechazo
    } catch (error) {
      console.error('Error sending rejection email:', error);
      throw error;
    }
  };

  const modalStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      width: '50%', 
      maxWidth: '400px',
    },
  };

  useEffect(() => {
    const inscripcionesCollection = collection(db, 'inscripciones');

    const unsubscribe = onSnapshot(inscripcionesCollection, (snapshot) => {
      const inscripcionesData = snapshot.docs.map((doc) => {
        const { id, nombre, cedula, apellidos, sexo, edad, email, confirmarEmail, telefono, nacimiento, tallaCamisa, lateralidad, nombreEmergencia, telefonoEmergencia, parentescoEmergencia, provincia, totalMonto, beneficiarioPoliza, metodoPago, discapacidad, tipoDiscapacidad, alergiaMedicamento, pais, evento, codigoComprobante } = doc.data();
        
        return {
          id: doc.id,
          nombreCarrera: '', // Asegúrate de que este campo esté presente y tenga un valor válido
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

  const handleSendRejectionEmail = async (): Promise<void> => {
    if (selectedParticipant) {
      await enviarCorreoRechazo(selectedParticipant, rejectionReason);
      setRejectionReason("");
      setModalIsOpen(false);
    }
  };

  return (
    <div>
      <nav className="bg-white border-b border-gray-200 fixed w-full z-23 top-0 left-0 h-23">
        {/* Contenido de la barra de navegación */}
      </nav>

      <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)} style={modalStyles}>
        <div style={{ textAlign: 'center' }}>
          <h2>{selectedParticipant ? "Enviar correo electrónico" : "Motivo de rechazo"}</h2>
          {selectedParticipant ? (
            <>
              <p>¿Quieres enviar un correo electrónico al participante?</p>
              <button
                onClick={() => {
                  window.open(`mailto:${selectedParticipant?.email}?subject=Solicitud de participante aprobada&body=${encodeURIComponent("¡Hola estimado participante!\n\nNos complace informarte que tu inscripción para nuestro evento ha sido verificada con éxito y tu comprobante de pago ha sido recibido.\n\n¡Felicitaciones! Has sido admitido/a en la carrera seleccionada. Estamos emocionados de tenerte con nosotros y queremos asegurarte que estamos preparando todos los detalles para hacerte vivir una experiencia inolvidable.\n\nPronto te enviaremos más información sobre el evento, así que mantén un ojo en tu bandeja de entrada.\n\nGracias por elegir ser parte de Carreras Aventura. Estamos ansiosos por compartir esta aventura contigo.\n\nSaludos cordiales,\nEl equipo de Carreras Aventura")}`);
                }}
                className="modal-button modal-button-primary"
              >
                Abrir correo electrónico
              </button>
            </>
          ) : (
            <>
              <textarea value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} placeholder="Motivo de rechazo" className="w-full p-2" />
              <button onClick={handleSendRejectionEmail} className="modal-button modal-button-primary">Enviar correo de rechazo</button>
            </>
          )}
          <button onClick={() => setModalIsOpen(false)} className="modal-button modal-button-cancel">Cancelar</button>
        </div>
      </Modal>

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
            <th style={thStyle}>Email</th> {/* Nueva columna para mostrar el correo electrónico */}
            <th style={thStyle}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {participantes.length === 0 ? (
            <tr style={{ height: '600px' }}>
              <td colSpan={6} className="p-4 text-center" style={{ height: '600px' }}>
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
                <td className="border px-4 py-2">{participante.email}</td> {/* Mostrar el correo electrónico */}
                <td className="border px-4 py-2">
                  <button
                    onClick={() => {
                      setSelectedParticipant(participante);
                      handleAprobar(participante.id); // Llamar a la función handleAprobar aquí
                    }}
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
