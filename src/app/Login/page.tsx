'use client'
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import Layout from '@/app/layout';
import Link from 'next/link';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import Navbar from '../componentes/navbar';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../../firebase/firebase';


export default function Login() {

    const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
    setError(null);
  };
  
  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
    setError(null);
  };
  
  const signIn = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(userCredential);
        window.location.href = '/Admin/main';
      })
      .catch((error) => {
        setError("Usuario y/o contraseña incorrectos. Por favor, inténtalo de nuevo.");
        console.error(error); 
      });
  };

  return (
    <div>
        <div className="min-h-screen flex flex-col justify-center items-center bg-blue-800 text-white min-h-screen">
          {/* Cambia el fondo de color aquí */}
          <form className="border border-gray-500 p-6 rounded-md shadow-md bg-white max-w-md w-full">
            <h1 className="text-4xl font-extrabold mb-6 text-center text-blue-600">
              ¡Bienvenido!
            </h1>
            {error && (
              <div className="mb-4 text-red-900 text-center">
                {error}
              </div>
            )}
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 flex items-center">
                <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                Correo Electrónico
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={handleEmailChange}
                className="mt-1 p-2 border rounded-md w-full focus:outline-none focus:ring focus:border-blue-300"
                style={{ fontSize: '1rem' }}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 flex items-center">
                <FontAwesomeIcon icon={faLock} className="mr-2" />
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={handlePasswordChange}
                className="mt-1 p-2 border rounded-md w-full focus:outline-none focus:ring focus:border-blue-300"
                style={{ fontSize: '1rem' }}
              />
            </div>
            <div className="flex justify-between items-center">
  <button
    onClick={signIn}
    className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 hover:text-black">
    Iniciar Sesión
  </button>
  <Link
    href="/Recuperar"
    className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 hover:text-black">
    Olvidé mi Contraseña
  </Link>
</div>
          </form>
        </div>
    </div>
  )
}
