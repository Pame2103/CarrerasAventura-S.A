'use client'
import React, { useState, useEffect } from "react";
import { collection, onSnapshot, deleteDoc, doc, addDoc } from "firebase/firestore";
import { db } from "../../../../firebase/firebase";
import Link from "next/link";
import Modal from "react-modal";
import { FaRunning, FaInfoCircle, FaDumbbell, FaEnvelope, FaTrophy, FaSignInAlt } from "react-icons/fa";

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
  beneficiarioPoliza: string;
  metodoPago: string;
  discapacidad: string;
  tipoDiscapacidad: string;
  alergiaMedicamento: string;
  pais: string;
  evento: string;
  codigoComprobante: string;
}

function Confirmacionespago() {
  const [participantes, setParticipantes] = useState<Participante[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState<Participante | null>(null);

 
  const [rejectModalIsOpen, setRejectModalIsOpen] = useState(false);

  const handleAprobar = async (id: string): Promise<void> => {
    console.log("Botón Aprobar clickeado. ID:", id);

    const participanteAprobado = participantes.find((participante) => participante.id === id);
    console.log("Participante encontrado:", participanteAprobado);

    if (participanteAprobado) {
      try {
     
        await deleteDoc(doc(db, "inscripciones", id));
        console.log("Participante eliminado de Inscripciones.");

        await addDoc(collection(db, "listaparticipantes"), participanteAprobado);
        console.log("Participante agregado a listaparticipantes.");

        await enviarCorreoElectronico(participanteAprobado);

 
        const updatedParticipantes = participantes.filter((participante) => participante.id !== id);
        setParticipantes(updatedParticipantes);


        await handleRechazar(id);


        setModalIsOpen(true);
      } catch (error) {
        console.error("Error al aprobar el participante:", error);
      }
    }
  };

  const handleRechazar = async (id: string): Promise<void> => {
    console.log("Botón Rechazar clickeado. ID:", id);

    try {

      await deleteDoc(doc(db, "inscripciones", id));
      console.log("Participante eliminado de Inscripciones.");


      const updatedParticipantes = participantes.filter((participante) => participante.id !== id);
      setParticipantes(updatedParticipantes);
    } catch (error) {
      console.error("Error al rechazar el participante:", error);
    }
  };

  const enviarCorreoElectronico = async (participante: Participante): Promise<void> => {
    try {

      console.log(`Enviando correo de aprobación a ${participante.email}`);
    } catch (error) {
      console.error("Error sending approval email:", error);
      throw error;
    }
  };

  const sendRejectionEmail = async (participante: Participante): Promise<void> => {
    try {
  
      const subject = "Solicitud de participante rechazada";
      const body = `¡Hola estimado participante!

Lamentamos informarte que tu solicitud de participación para nuestro evento ha sido rechazada. Hemos revisado cuidadosamente todos los detalles y lamentablemente no podemos admitirte en esta ocasión.

Entendemos que esto puede ser decepcionante, pero queremos agradecerte por tu interés en nuestro evento y por tomarte el tiempo para aplicar. Te animamos a seguir buscando oportunidades que se ajusten a tus intereses y habilidades.

Si tienes alguna pregunta sobre nuestra decisión o necesitas más información, no dudes en ponerte en contacto con nosotros.

Gracias por tu comprensión.

Saludos cordiales,
El equipo de Carreras Aventura`;

      window.open(`mailto:${participante.email}?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(body)}`);
    } catch (error) {
      console.error("Error sending rejection email:", error);
      throw error;
    }
  };

  const handleReject = (participant: Participante) => {
    setSelectedParticipant(participant);
    setRejectModalIsOpen(true);
  };

  const handleRejectSubmit = async () => {
    if (selectedParticipant) {
      await sendRejectionEmail(selectedParticipant);
      await handleRechazar(selectedParticipant.id);
      setRejectModalIsOpen(false);
    }
  };

  const modalStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      width: "50%",
      maxWidth: "400px",
    },
  };

  useEffect(() => {
    const inscripcionesCollection = collection(db, "inscripciones");

    const unsubscribe = onSnapshot(inscripcionesCollection, (snapshot) => {
      const inscripcionesData = snapshot.docs.map((doc) => {
        const {
          id,
          nombre,
          cedula,
          apellidos,
          sexo,
          edad,
          email,
          telefono,
          nacimiento,
          tallaCamisa,
          lateralidad,
          nombreEmergencia,
          telefonoEmergencia,
          parentescoEmergencia,
          beneficiarioPoliza,
          metodoPago,
          discapacidad,
          tipoDiscapacidad,
          alergiaMedicamento,
          pais,
          evento,
          codigoComprobante,
        } = doc.data();

        return {
          id: doc.id,
          nombreCarrera: "", 
          nombre,cedula,
          apellidos,
          sexo,
          edad,
          email,
          telefono,
          nacimiento,
          tallaCamisa,
          lateralidad,
          nombreEmergencia,
          telefonoEmergencia,
          parentescoEmergencia,
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

      const participantesPendientes = inscripcionesData.filter(
        (participante) => !participante.aprobado
      );
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
                      <FaRunning className="mr-1" /> Crear Carreras
                    </span>
                  </Link>
                  <Link href="/Admin/administrarTiempos">
                    <span className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center">
                      <FaInfoCircle className="mr-1" /> Administrar Tiempos
                    </span>
                  </Link>
                  <Link href="/Admin/carreras">
                    <span className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center">
                      <FaDumbbell className="mr-1" /> Carreras Disponibles
                    </span>
                  </Link>
                  <Link href="/Admin/confirmaciones">
                    <span className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center">
                      <FaTrophy className="mr-1" /> Confirmación de Pagos
                    </span>
                  </Link>
                  <Link href="/Admin/ControlTiempos">
                    <span className="text-gray-600 hover:text-gray-900 px-0 py-2 rounded-md text-sm font-medium flex items-center">
                      <FaTrophy className="mr-1" /> Control Tiempos
                    </span>
                  </Link>
                  <Link href="/Admin/listaParticipantes">
                    <span className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center">
                      <FaTrophy className="mr-1" /> Lista de Participantes
                    </span>
                  </Link>
                  <Link href="/Admin/editarcarreras">
                    <span className="text-gray-600 hover:text-gray-900 px-0 py-0 rounded-md text-sm font-medium flex items-center">
                      <FaTrophy className="mr-1" />Editar Carreras
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

      <Modal isOpen={modalIsOpen} onRequestClose={() => setModalIsOpen(false)} style={modalStyles}>
        <div style={{ textAlign: 'center' }}>
          <h2>Enviar correo electrónico</h2>
          <p>¿Quieres enviar un correo electrónico al participante?</p>
          <button
            onClick={() =>{
              window.open(`mailto:${selectedParticipant?.email}?subject=Solicitud de participante aprobada&body=${encodeURIComponent("¡Hola estimado participante!\n\nNos complace informarte que tu inscripción para nuestro evento ha sido verificada con éxito y tu comprobante de pago ha sido recibido.\n\n¡Felicitaciones! Has sido admitido/a en la carrera seleccionada. Estamos emocionados de tenerte con nosotros y queremos asegurarte que estamos preparando todos los detalles para hacerte vivir una experiencia inolvidable.\n\nPronto te enviaremos más información sobre el evento, así que mantén un ojo en tu bandeja de entrada.\n\nGracias por elegir ser parte de Carreras Aventura. Estamos ansiosos por compartir esta aventura contigo.\n\nSaludos cordiales,\nEl equipo de Carreras Aventura")}`);
            }}
            className="modal-button modal-button-primary"
          >
            Abrir correo electrónico
          </button>
          <button onClick={() => setModalIsOpen(false)} className="modal-button modal-button-cancel">Cancelar</button>
        </div>
      </Modal>

      <Modal isOpen={rejectModalIsOpen} onRequestClose={() => setRejectModalIsOpen(false)} style={modalStyles}>
        <div style={{ textAlign: 'center' }}>
          <h2>Rechazar participante</h2>
          <p>¿Estás seguro de querer rechazar al participante?</p>
          <button onClick={handleRejectSubmit} className="modal-button modal-button-primary">
            Rechazar
          </button>
          <button onClick={() => setRejectModalIsOpen(false)} className="modal-button modal-button-cancel">
            Cancelar
          </button>
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
            <th style={thStyle}>Email</th>
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
                <td className="border px-4 py-2">{participante.email}</td> 
                <td className="border px-4 py-2">
                  <button
                    onClick={() => {
                      setSelectedParticipant(participante);
                      handleAprobar(participante.id); 
                    }}
                    style={{ backgroundColor: 'blue', color: 'white', marginRight: '5px' }}
                  >
                    Aprobar
                  </button>
                  <button
                    onClick={() => handleReject(participante)}
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