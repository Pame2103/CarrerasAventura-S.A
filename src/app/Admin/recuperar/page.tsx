'use client'
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { sendPasswordResetEmail } from 'firebase/auth';
import { getAuth } from 'firebase/auth';

import Link from 'next/link';

function RecuperarContrasena() {
  const [correoRecuperacion, setCorreoRecuperacion] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const handleCorreoRecuperacionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCorreoRecuperacion(event.target.value);
  };

  const resetEmail = () => {
    const auth = getAuth(); // Obtener la instancia de Auth
    if (correoRecuperacion) {
      sendPasswordResetEmail(auth, correoRecuperacion)
        .then(() => {
          setShowSuccessModal(true);
        })
        .catch((error) => {
          console.error("Error sending password reset email:", error);
          setShowErrorModal(true);
        });
    } else {
      console.error("Please provide an email address for password reset.");
    }
  };

  const closeModal = () => {
    setShowSuccessModal(false);
    setShowErrorModal(false);
  };

  return (
    <>
   
      <div className="min-h-screen flex flex-col justify-center items-center bg-blue-800">
        <form className="border border--300 p-6 rounded-md shadow-md bg-white">
          <h1 className="text-4xl font-extrabold mb-6 text-center text-blue-600">
            Recuperar Contraseña
          </h1>
          <div className="mb-4">
            <label htmlFor="correoRecuperacion" className="block text-sm font-medium text-gray-800">
              <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
              Correo de Recuperación
            </label>
            <input
              type="email"
              id="correoRecuperacion"
              value={correoRecuperacion}
              onChange={handleCorreoRecuperacionChange}
              className="mt-1 p-2 border rounded-md w-full"
            />
          </div>
          <button
            type="button"
            onClick={resetEmail}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-900 mr-2">
            Enviar
          </button>
          <Link href="/Login" 
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-900 mr-5">
            Regresar
          </Link>
        </form>

        {/* Ventana emergente de éxito */}
        {showSuccessModal && (
          <div className="fixed inset-0 flex items-center justify-center">
            <div className="bg-white p-6 rounded-md shadow-md">
              <p className="text-green-500 font-bold">¡Éxito! Se ha enviado un correo para restablecer la contraseña.</p>
              <button onClick={closeModal} className="text-blue-500 hover:underline">Cerrar</button>
            </div>
          </div>
        )}

        {/* Ventana emergente de error */}
        {showErrorModal && (
          <div className="fixed inset-0 flex items-center justify-center">
            <div className="bg-white p-6 rounded-md shadow-md">
              <p className="text-red-500 font-bold">Error al enviar el correo. Inténtelo de nuevo.</p>
              <button onClick={closeModal} className="text-blue-500 hover:underline">Cerrar</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default RecuperarContrasena;
