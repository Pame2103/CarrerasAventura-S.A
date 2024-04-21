'use client';
import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../../firebase/firebase';
import Link from 'next/link';
import { FaRunning, FaInfoCircle, FaDumbbell, FaEnvelope, FaTrophy, FaSignInAlt } from 'react-icons/fa';

interface Dato {
  id: string;
  nombre: string;
  tiempo: string;
  cedula: string;
  posicion: number;
  categoria: string;
}

const HistoricosAdmi: React.FC = () => {
  const [nombre, setNombre] = useState('');
  const [horas, setHoras] = useState(0);
  const [minutos, setMinutos] = useState(0);
  const [segundos, setSegundos] = useState(0);
  const [nanosegundos, setNanosegundos] = useState(0);
  const [cedula, setCedula] = useState('');
  const [posicion, setPosicion] = useState(1);
  const [categoria, setCategoria] = useState('');
  const [loading, setLoading] = useState(true);
  const [datos, setDatos] = useState<Dato[]>([]);

  useEffect(() => {
    const historicosCollection = collection(db, 'Historicos');

    const unsubscribe = onSnapshot(historicosCollection, (snapshot) => {
      const historicosData: Dato[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          nombre: data.nombre || '',
          tiempo: data.tiempo || '',
          cedula: data.cedula || '',
          posicion: data.posicion || 1,
          categoria: data.categoria || '',
        };
      });
      setDatos(historicosData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'Historicos', id));
      setDatos(prevDatos => prevDatos.filter(dato => dato.id !== id));
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  const handleEdit = async (id: string) => {
    const tiempo = `${horas}h ${minutos}m ${segundos}s ${nanosegundos}ns`;

    try {
      await updateDoc(doc(db, 'Historicos', id), {
        nombre,
        tiempo,
        cedula,
        posicion,
        categoria,
      });
      setDatos(prevDatos => {
        return prevDatos.map(dato => {
          if (dato.id === id) {
            return { ...dato, nombre, tiempo, cedula, posicion, categoria };
          } else {
            return dato;
          }
        });
      });
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const tiempo = `${horas}h ${minutos}m ${segundos}s ${nanosegundos}ns`;

    try {
      const docRef = await addDoc(collection(db, 'Historicos'), {
        nombre,
        tiempo,
        cedula,
        posicion,
        categoria,
      });

      console.log("Document written with ID: ", docRef.id);

      setNombre('');
      setHoras(0);
      setMinutos(0);
      setSegundos(0);
      setNanosegundos(0);
      setCedula('');
      setPosicion(1);
      setCategoria('');
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const Navbar: React.FC = () => {
    return (
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
                    <span className="text-gray-600 hover:text-gray-900 px-0 py-2 rounded-md text-sm font-medium flex items-center">
                      <FaRunning className="mr-1" /> Administrar Carreras
                    </span>
                  </Link>
                  <Link href="/Admin/administrarTiempos">
                    <span className="text-gray-600 hover:text-gray-900 px-0 py-2 rounded-md text-sm font-medium flex items-center">
                      <FaInfoCircle className="mr-1" /> Administrar Tiempos
                    </span>
                  </Link>
                  <Link href="/Admin/carreras">
                    <span className="text-gray-600 hover:text-gray-900 px-0 py-2 rounded-md text-sm font-medium flex items-center">
                      <FaDumbbell className="mr-1" /> Carreras
                    </span>
                  </Link>
                  <Link href="/Admin/confirmaciones">
                    <span className="text-gray-600 hover:text-gray-900 px-0 py-2 rounded-md text-sm font-medium flex items-center">
                      <FaTrophy className="mr-1" />Confirmación de Pagos
                    </span>
                  </Link>
                  <Link href="/Admin/editarcarreras">
                    <span className="text-gray-600 hover:text-gray-900 px-0 py-0 rounded-md text-sm font-medium flex items-center">
                      <FaTrophy className="mr-1" />Editar Carreras
                    </span>
                  </Link>
                  <Link href="/Admin/historicosadmin">
                    <span className="text-gray-600 hover:text-gray-900 px-0 py-0 rounded-md text-sm font-medium flex items-center">
                      <FaInfoCircle className="mr-1" /> Históricos
                    </span>
                  </Link>
                  <Link href="/Admin/listaParticipantes">
                    <span className="text-gray-600 hover:text-gray-900 px-0 py-0 rounded-md text-sm font-medium flex items-center">
                      <FaTrophy className="mr-1" /> Lista de Participantes
                    </span>
                  </Link>
                  <Link href="/Admin/record">
                    <span className="text-gray-600 hover:text-gray-900 px-0 py-0 rounded-md text-sm font-medium flex items-center">
                      <FaEnvelope className="mr-1" /> Records
                    </span>
                  </Link>
                  <Link href="/Admin/resultados">
                    <span className="text-gray-600 hover:text-gray-900 px-0 py-0 rounded-md text-sm font-medium flex items-center">
                      <FaEnvelope className="mr-1" /> Resultados
                    </span>
                  </Link>
                </div>
              </div>
            </div>
            <div className="flex">
              <Link href="/Login" className="bg-blue-600 hover:bg-blue-700 text-white px-0 py-0 rounded-md font-medium flex items-center">
                <FaSignInAlt className="mr-1" /> Cerrar sesión
              </Link>
            </div>
          </div>
          <div className="ml-10 text-gray-600 text-sm font-medium">¡Corre hacia tus metas con Carrera Aventura! ¡Cruzando la meta juntos!</div>
        </div>
      </nav>
    );
  };

  return (
    <div>
      <Navbar />
      <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', maxWidth: '1000px', margin: '0 auto', padding: '15px', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'right', marginBottom: '10px' }}>
      <br />
      <br />
      <br />
      <br />
        </div>
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '15px', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '2rem', color: '#333', textAlign: 'center' }}>ADMINISTRADOR DE HISTORICOS</h1>
        <img src="/archivo.gif" alt="Descripción de la imagen" className="mx-auto mb-8" style={{ width: '250px', height: '200px' }} />
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '5px' }}>
              <label style={{ display: 'block', marginBottom: '4px' }}>Nombre:</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', marginBottom: '4px' }}>Tiempo:</label>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <input
                  type="number"
                  value={horas}
                  min="0"
                  onChange={(e) => setHoras(parseInt(e.target.value, 10))}
                  style={{ width: '100px', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', marginRight: '10px' }}
                />
                <span>h</span>
                <input
                  type="number"
                  value={minutos}
                  min="0"
                  max="59"
                  onChange={(e) => setMinutos(parseInt(e.target.value, 10))}
                  style={{ width: '80px', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', margin: '0 10px' }}
                />
                <span>m</span>
                <input
                  type="number"
                  value={segundos}
                  min="0"
                  max="59"
                  onChange={(e) => setSegundos(parseInt(e.target.value))}
                  style={{ width: '80px', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', margin: '0 10px' }}
                />
                <span>s</span>
                <input
                  type="number"
                  value={nanosegundos}
                  min="0"
                  max="999999999"
                  onChange={(e) => setNanosegundos(parseInt(e.target.value))}
                  style={{ width: '120px', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
                <span>ns</span>
              </div>
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Cedula:</label>
              <input
                type="text"
                value={cedula}
                onChange={(e) => setCedula(e.target.value)}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Posicion:</label>
              <input
                type="number"
                value={posicion}
                min="1" // Mínimo valor permitido es 1
                onChange={(e) => setPosicion(parseInt(e.target.value))}
                style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label htmlFor="categoria" className="block font-semibold">Categoría:</label>
              <select
                id="categoria"
                name="categoria"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="border p-2 w-full"
              >
                <option value="Categoria">Categoria</option>
                <option value="Femenino, Junior">Femenina, Junior</option>
                <option value="Femenino,Mayor">Femenina,Mayor</option>
                <option value="Femenino,Veterano">Femenina,Veterano A</option>
                <option value="Femenino,Veterano B">Femenina,Veterano B</option>
                <option value="Femenino,Veterano C">Femenina,Veterano C</option>
                <option value="Masculino,Junior">Masculino,Junior</option>
                <option value="Masculono,Mayor">Masculino,Mayor</option>
                <option value="Masculino,Veterano">Masculino,Veterano A</option>
                <option value="Masculino,Veterano A">Masculino,Veterano A</option>
                <option value="Masculino,Veterano B">Masculino,Veterano B</option>
                <option value="Masculino,Veterano C">Masculino,Veterano C</option>
              </select>
            </div>
            <button type="submit" style={{ background: '#0D47A1', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}>Agregar</button>
          </form>
        </div>
        <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '2rem', color: '#333', textAlign: 'center' }}>RESULTADOS DE HISTORICOS</h1>
        <div className="tabla-contenedor" style={{ marginTop: '30px' }}>
          <table className="table-auto w-full border-collapse border border-gray-300 shadow-lg rounded">
            <thead style={{ backgroundColor: '#B1CEE3' }} className="">
              <tr>
                <th style={{ padding: '15px', borderBottom: '1px solid #ccc' }}>Nombre</th>
                <th style={{ padding: '15px', borderBottom: '1px solid #ccc' }}>Cedula</th>
                <th style={{ padding: '15px', borderBottom: '1px solid #ccc' }}>Tiempo</th>
                <th style={{ padding: '15px', borderBottom: '1px solid #ccc' }}>Posicion</th>
                <th style={{ padding: '15px', borderBottom: '1px solid #ccc' }}>Categoria</th>
                <th style={{ padding: '15px', borderBottom: '1px solid #ccc' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {datos.map((dato) => (
                <tr key={dato.id}>
                  <td style={{ padding: '15px', borderBottom: '1px solid #ccc' }}>{dato.nombre}</td>
                  <td style={{ padding: '15px', borderBottom: '1px solid #ccc' }}>{dato.cedula}</td>
                  <td style={{ padding: '15px', borderBottom: '1px solid #ccc' }}>{dato.tiempo}</td>
                  <td style={{ padding: '15px', borderBottom: '1px solid #ccc' }}>{dato.posicion}</td>
                  <td style={{ padding: '15px', borderBottom: '1px solid #ccc' }}>{dato.categoria}</td>
                  <td style={{ padding: '15px', borderBottom: '1px solid #ccc' }}>
                    <button onClick={() => handleDelete(dato.id)} style={{ background: 'red', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', marginRight: '4px' }}>Eliminar</button>
                    <button onClick={() => handleEdit(dato.id)} style={{ background: '#0D47A1', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>Editar</button>
                 
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default HistoricosAdmi;
