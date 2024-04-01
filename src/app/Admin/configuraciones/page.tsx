'use client'
import React, { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../../../firebase/firebase';
import { doc, deleteDoc } from 'firebase/firestore';
import { updateDoc } from 'firebase/firestore';
import { addDoc } from 'firebase/firestore';

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
        const querySnapshot = await onSnapshot(collection(db, 'Usuarios'), snapshot => {
          const administradoresData: Administrador[] = snapshot.docs.map(doc => ({
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

      const nuevosAdministradores = administradores.filter(admin => admin.id !== id);
      setAdministradores(nuevosAdministradores);
    } catch (error) {
      console.error('Error al eliminar el administrador:', error);
    }
  };

  const handleEditar = async (id: string) => {
    try {
      const userDocRef = doc(db, 'Usuarios', id);
      const administradorEditado = administradores.find(admin => admin.id === id);

      await updateDoc(userDocRef, {
        nombre: nombre || administradorEditado?.nombre,
        email: email || administradorEditado?.email,
        usuario: apellidos || administradorEditado?.usuario,
        password: hashPassword(password) || administradorEditado?.password,
      });

      const nuevosAdministradores = administradores.map(admin => {
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
      <style>
        {`
        body {
          margin: 0;
          padding: 0;
     
          background-size: cover;
          background-repeat: no-repeat;
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .container {
          max-width: 900px;
          padding: 20px;
          border: 1px solid #ccc;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.8); /* Agregar fondo blanco semi-transparente para mejorar la legibilidad */
        }
          .form-input {
            padding: 8px;
            border-radius: 4px;
            border: 1px solid #ccc;
            margin-bottom: 10px;
            width: 100%;
          }

          .btn {
            padding: 8px;
            border-radius: 4px;
            background-color: #3c78f2;
            color: white;
            border: none;
          }

          .table-container {
            overflow-x: auto;
          }

          .table {
            width: 100%;
            border-collapse: collapse;
            border: 1px solid #ccc;
            border-radius: 8px;
            background-color: white;
          }

          .table th,
          .table td {
            border: 1px solid #ccc;
            padding: 8px;
            text-align: left;
          }

          .table th {
            background-color: #B1CEE3;
          }

          .table tbody tr:hover {
            background-color: #f0f0f0;
          }

          .editar,
          .eliminar {
            cursor: pointer;
            margin-right: 5px;
            padding: 5px 10px;
            border-radius: 4px;
            border: none;
          }

          .editar {
            background-color: #1D6CE6;
            color: white;
          }

          .eliminar {
            background-color: #1D6CE6;
            color: white;
          }
        `}
      </style>
      <div className="container">
        <h1 style={{ textAlign: 'center', fontSize: '30px', color: 'black' }}>Configuaracion Usuarios</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="nombre">Nombre:</label>
          <input
            type="text"
            id="nombre"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            required
            className="form-input"
          />
          <label htmlFor="apellidos">Apellidos:</label>
          <input
            type="text"
            id="apellidos"
            value={apellidos}
            onChange={e => setApellidos(e.target.value)}
            required
            className="form-input"
          />
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="form-input"
          />
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="form-input"
          />
          <button type="submit" className="btn">Agregar Administrador</button>
        </form>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Apellidos</th>
                <th>Email</
                th>
<th>Contraseña</th>
<th>Acciones</th>
</tr>
</thead>
<tbody>
{administradores.map(admin =>
<tr key={admin.id}>
<td>{admin.nombre}</td>
<td>{admin.usuario}</td>
<td>{admin.email}</td>
<td>{admin.password}</td>
<td>
<button className="editar" onClick={() => handleEditar(admin.id)}>
Editar
</button>
<button className="eliminar" onClick={() => handleEliminar(admin.id)}>
Eliminar
</button>
</td>
</tr>
)}
</tbody>
</table>
</div>
</div>
</>
);
}

export default Configuraciones;
