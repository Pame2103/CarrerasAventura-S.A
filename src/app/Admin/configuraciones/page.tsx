
'use client'
import React, { useState, useEffect } from 'react';

import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../../../firebase/firebase';
import { doc, deleteDoc } from 'firebase/firestore'
import {  updateDoc } from 'firebase/firestore';
import {  addDoc, } from 'firebase/firestore';




interface Administrador {
  id: string;
  nombre: string;
  email: string;
  usuario: string;
  password: string;
}

function Configuraciones() {
  const [administradores, setAdministradores] = useState<Administrador[]>([]);
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const obtenerAdministradoresDesdeFirebase = async () => {
      try {
        const querySnapshot = await onSnapshot(collection(db, 'Usuarios'), (snapshot) => {
          const administradoresData: Administrador[] = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          } as Administrador));
          setAdministradores(administradoresData);
        });
      } catch (error) {
        console.error('Error al obtener administradores desde Firebase:', error);
      }
    };

    obtenerAdministradoresDesdeFirebase();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    const newAdmin: Omit<Administrador, 'id'> = {
      nombre,
      email,
      usuario: apellidos,
      password: hashPassword(password),
    };
  
    try {
      const docRef = await addDoc(collection(db, 'Usuarios'), newAdmin);
      console.log('Datos del usuario agregados con ID: ', docRef.id);
  
      // Actualizar state con el nuevo administrador y el ID generado por Firebase
      setAdministradores([...administradores, { id: docRef.id, ...newAdmin }]);
      setNombre('');
      setEmail('');
      setApellidos('');
      setPassword('');
    } catch (error) {
      console.error('Error al agregar datos del usuario a Firebase:', error);
    }
  };

  const handleEliminar = async (id: string) => {
    try {
      const userDocRef = doc(db, 'Usuarios', id);
      await deleteDoc(userDocRef);
  
      const nuevosAdministradores = administradores.filter((admin) => admin.id !== id);
      setAdministradores(nuevosAdministradores);
    } catch (error) {
      console.error('Error al eliminar el administrador:', error);
    }
  };

  const handleEditar = async (id: string) => {
    try {
      const userDocRef = doc(db, 'Usuarios', id);
      const administradorEditado = administradores.find((admin) => admin.id === id);
  
      await updateDoc(userDocRef, {
        nombre: nombre || administradorEditado?.nombre,
        email: email || administradorEditado?.email,
        usuario: apellidos || administradorEditado?.usuario,
        password: hashPassword(password) || administradorEditado?.password,
      });
  
      const nuevosAdministradores = administradores.map((admin) => {
        if (admin.id === id) {
          return {
            ...admin,
            nombre: nombre || admin.nombre,
            email: email || admin.email,
            usuario: apellidos || admin.usuario,
            password: hashPassword(password) || admin.password,
          };
        }
        return admin;
      });
  
      setAdministradores(nuevosAdministradores);
    } catch (error) {
      console.error('Error al editar el administrador:', error);
    }
  };
  
  const hashPassword = (password: string) => {
    // Implementa tu lógica para hashear la contraseña aquí
    return password;
  };

  return (
    <>
    
      <div className="text-black min-h-screen" style={{ fontFamily: 'Arial', color: '#3c78f2', backgroundColor: '#E0E6F3' }}>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded absolute top-0 right-0 mt-4 mr-4"
          onClick={() => window.history.back()}
        >
          Volver
        </button>
        <h1 style={{ textAlign: 'center', fontSize: '30px', color: 'black' }}>ADMINISTRADORES</h1>

        <br />
        <br />
        <br />
        <form onSubmit={handleSubmit}>
          <label htmlFor="nombre">Nombre:</label>
          <input
            type="text"
            id="nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />

          <label htmlFor="apellidos">Apellidos:</label>
          <input
            type="text"
            id="apellidos"
            value={apellidos}
            onChange={(e) => setApellidos(e.target.value)}
            required
          />

          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Agregar Administrador</button>
        </form>

        <div style={{ overflowX: 'auto' }}>
          <table className="table-auto w-full border-collapse border border-gray-300 shadow-lg rounded">
            <thead style={{ backgroundColor: '#B1CEE3' }}>
              <tr>
                <th className="border px-4 py-2">Nombre</th>
                <th className="border px-4 py-2">Apellidos</th>
                <th className="border px-4 py-2">Email</th>
                <th className="border px-4 py-2">Contraseña</th>
                <th className="border px-4 py-2">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {administradores.map((admin) => (
                <tr key={admin.id} className="hover:bg-gray-100">
                  <td className="border px-4 py-2">{admin.nombre}</td>
                  <td className="border px-4 py-2">{admin.usuario}</td>
                  <td className="border px-4 py-2">{admin.email}</td>
                  <td className="border px-4 py-2">{admin.password}</td>
                  <td className="border px-4 py-2 text-center">
                    <button className="editar" onClick={() => handleEditar(admin.id)}>
                      Editar
                    </button>
                    <button className="eliminar" onClick={() => handleEliminar(admin.id)}>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default Configuraciones;
