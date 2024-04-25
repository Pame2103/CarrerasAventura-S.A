'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaRunning, FaInfoCircle, FaDumbbell, FaEnvelope, FaTrophy, FaSignInAlt } from 'react-icons/fa';
import { db } from '../../../../firebase/firebase';
import { collection, addDoc, getDocs, deleteDoc, updateDoc, doc } from 'firebase/firestore';

interface AtletaData {
  id: string;
  tiempo: string;
  nombreAtleta: string;
  numeroParticipante: string;
  categoria: string;
  sexo: string;
  carrera: string;
}

interface FormData {
  nombreAtleta: string;
  numeroParticipante: string;
  tiempo: {
    hours: number;
    minutes: number;
    seconds: number;
    nanoseconds: number;
  };
  categoria: string;
  sexo: string;
  carrera: string;
}

function Administradortiempos() {
  const [data, setData] = useState<AtletaData[]>([]);
  const [formData, setFormData] = useState<FormData>({
    nombreAtleta: '',
    numeroParticipante: '',
    tiempo: { hours: 0, minutes: 0, seconds: 0, nanoseconds: 0 },
    categoria: '', 
    sexo: '',
    carrera: ''
  });
  const [editIndex, setEditIndex] = useState<number | null>(null);

  useEffect(() => {
    obtenerAtletasDesdeFirebase();
  }, []);

  const obtenerAtletasDesdeFirebase = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'administradortiempos'));
      const atletasData: AtletaData[] = [];

      querySnapshot.forEach((doc) => {
        atletasData.push({ id: doc.id, ...doc.data() } as AtletaData);
      });

      setData(atletasData);
    } catch (error) {
      console.error('Error al obtener atletas desde Firebase:', error);
    }
  };

  const addAtletaDataToFirebase = async (nuevoAtleta: FormData) => {
    try {
      const { nombreAtleta, numeroParticipante, tiempo, categoria, sexo, carrera } = nuevoAtleta;
      const tiempoString = `${tiempo.hours}:${tiempo.minutes}:${tiempo.seconds}.${tiempo.nanoseconds}`;

      const docRef = await addDoc(collection(db, 'administradortiempos'), {
        nombreAtleta,
        numeroParticipante,
        tiempo: tiempoString,
        categoria,
        sexo,
        carrera
      });

      console.log('Datos del atleta agregados con ID: ', docRef.id);
      obtenerAtletasDesdeFirebase();
    } catch (error) {
      console.error('Error al agregar datos del atleta:', error);
    }
  };

  const handleEliminarAtleta = async (id: string) => {
    try {
      // Eliminar el documento de Firestore
      await deleteDoc(doc(db, 'administradortiempos', id));

      // Actualizar el estado local eliminando el elemento correspondiente de la matriz 'data'
      setData(prevData => prevData.filter(atleta => atleta.id !== id));
    } catch (error) {
      console.error('Error al eliminar el atleta:', error);
    }
  };

  const handleEditarAtleta = async (id: string, atletaEditado: FormData) => {
    try {
      const { nombreAtleta, numeroParticipante, tiempo, categoria, sexo, carrera } = atletaEditado;
      const tiempoString = `${tiempo.hours}:${tiempo.minutes}:${tiempo.seconds}.${tiempo.nanoseconds}`;

      await updateDoc(doc(db, 'administradortiempos', id), {
        nombreAtleta,
        numeroParticipante,
        tiempo: tiempoString,
        categoria,
        sexo,
        carrera
      });

      obtenerAtletasDesdeFirebase();
      setEditIndex(null);
    } catch (error) {
      console.error('Error al editar el atleta:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newTime = { ...formData.tiempo, [name]: parseInt(value) || 0 };
    setFormData(prevFormData => ({
      ...prevFormData,
      tiempo: newTime
    }));
  };

  const handleEdit = (index: number) => {
    const elementoAEditar = data[index];
    if (elementoAEditar && elementoAEditar.tiempo) {
      const [hours, minutes, seconds, nanoseconds] = elementoAEditar.tiempo.split(/[:.]/).map(Number);

      setFormData({
        nombreAtleta: elementoAEditar.nombreAtleta,
        numeroParticipante: elementoAEditar.numeroParticipante,
        tiempo: { hours, minutes, seconds, nanoseconds },
        categoria: elementoAEditar.categoria,
        sexo: elementoAEditar.sexo,
        carrera: elementoAEditar.carrera
      });

      setEditIndex(index);
    } else {
      console.error('El campo tiempo no está definido en los datos del atleta o tiene un formato incorrecto.');
    }
  };

  const handleSave = (index: number) => {
    const editedAtleta: AtletaData = {
      id: data[index].id,
      ...formData,
      tiempo: `${formData.tiempo.hours}:${formData.tiempo.minutes}:${formData.tiempo.seconds}.${formData.tiempo.nanoseconds}`
    };

    const newData = [...data];
    newData[index] = editedAtleta;

    setData(newData);
    setFormData({
      nombreAtleta: '',
      numeroParticipante: '',
      tiempo: { hours: 0, minutes: 0, seconds: 0, nanoseconds: 0 },
      categoria: '',
      sexo: '',
      carrera: ''
    });
    setEditIndex(null);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (editIndex !== null) {
      handleSave(editIndex);
    } else {
      addAtletaDataToFirebase(formData);
    }
  };

  const Navbar: React.FC = () => {
    return(
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
  }

  return (
    <div className="container">
      <Navbar />
      <div className="form-container">
        <br />
        <br />
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '2rem', color: '#333', textAlign: 'center' }}>ADMINISTRADOR DE TIEMPOS</h1>
          <img src="/T.gif" alt="Descripción de la imagen" className="mx-auto mb-8" style={{ width: '250px', height: '200px' }} />
          <form className="mi-formulario" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="carrera">Carrera:</label>
              <input
                type="text"
                id="carrera"
                name="carrera"
                value={formData.carrera}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="nombreAtleta">Nombre Atleta:</label>
              <input
                type="text"
                id="nombreAtleta"
                name="nombreAtleta"
                value={formData.nombreAtleta}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="numeroParticipante">Numero Participante:</label>
              <input
                type="text"
                id="numeroParticipante"
                name="numeroParticipante"
                value={formData.numeroParticipante}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="tiempo">Tiempo:</label>
              <div className="tiempo-inputs">
                <input
                  type="number"
                  name="hours"
                  value={formData.tiempo.hours}
                  onChange={handleTimeChange}
                />
                <span>H:</span>
                <input
                  type="number"
                  name="minutes"
                  value={formData.tiempo.minutes}
                  onChange={handleTimeChange}
                />
                <span>M:</span>
                <input
                  type="number"
                  name="seconds"
                  value={formData.tiempo.seconds}
                  onChange={handleTimeChange}
                />
                <span>S:</span>
                <input
                  type="number"
                  name="nanoseconds"
                  value={formData.tiempo.nanoseconds}
                  onChange={handleTimeChange}
                />
                <span>NS</span>
              </div>
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label htmlFor="categoria" className="block font-semibold">Categoría:</label>
              <select
                id="categoria"
                name="categoria"
                value={formData.categoria} 
                onChange={(e) => setFormData(prevState => ({ ...prevState, categoria: e.target.value }))}
                className="border p-2 w-full"
              >
                <option value="Categoria">Categoria</option>
                <option value="Femenino, Junior">Femenina, Junior</option>
                <option value="Femenino,Mayor">Femenina,Mayor</option>
                <option value="Femenino,Veterano">Femenina,Veterano A</option>
                <option value="Femenino,Veterano B">Femenina,Veterano B</option>
                <option value="Femenino,Veterano C">Femenina,Veterano C</option>
                <option value="Masculino,Junior">Masculino,Junior</option>
                <option value="Masculino,Mayor">Masculino,Mayor</option>
                <option value="Masculino,Veterano">Masculino,Veterano A</option>
                <option value="Masculino,Veterano A">Masculino,Veterano A</option>
                <option value="Masculino,Veterano B">Masculino,Veterano B</option>
                <option value="Masculino,Veterano C">Masculino,Veterano C</option>
              </select>
            </div>
            <div>
              <label htmlFor="sexo" className="block font-semibold">Sexo:</label>
              <select
                id="sexo"
                name="sexo"
                value={formData.sexo} 
                onChange={(e) => setFormData(prevState => ({ ...prevState, sexo: e.target.value }))}
                className="border p-2 w-full"
              >
                <option value="Sexo">Sexo</option>
                <option value="Femenino">Femenino</option>
                <option value="Masculino">Masculino</option>
              </select>
            </div>
            <button className="agregar" type="submit">Agregar</button>
          </form>
        </div>
        <br />
        <br />
        <br />
        <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '2rem', color: 'blue--700', textAlign: 'center' }}>RESULTADOS</h1>
        <table className="table-center w-full border-collapse border border-gray-300 shadow-lg rounded-center">
          <thead style={{ backgroundColor: 'blue--700' }} className="">
            <tr>
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2">Nombre Atleta</th>
              <th className="px-4 py-2">Numero Participante</th>
              <th className="px-4 py-2">Tiempo</th>
              <th className="px-4 py-2">Categoría</th>
              <th className="px-4 py-2">Sexo</th>
              <th className="px-4 py-2">Carrera</th>
              <th className="px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{item.nombreAtleta}</td>
                <td>{item.numeroParticipante}</td>
                <td>
                  {item.tiempo && item.tiempo.split(/[:.]/).map((part, index) => (
                    <span key={index}>{part}{index === 1 ? ':' : (index === 2 ? '.' : '')}</span>
                  ))}
                </td>
                <td>{item.categoria}</td>
                <td>{item.sexo}</td>
                <td>{item.carrera}</td>
                <td>
                  <button className="editar" onClick={() => handleEdit(index)}>
                    Editar
                  </button>
                  <button
                    className="eliminar"
                    onClick={() => handleEliminarAtleta(item.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <style>
        {`
          .mi-formulario {
            max-width: 500px;
            margin: 0 auto;
          }

          .mi-formulario div {
            margin-bottom: 10px;
          }

          .mi-formulario label {
            display: block;
            font-weight: bold;
            margin-bottom: 5px;
          }

          .mi-formulario input {
            width: 100%;
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 4px;
            font-size: 16px;
            box-sizing: border-box;
            margin-top: 3px;
          }

          .mi-formulario {
            text-align: center;
          }

          .mi-formulario button {
            padding: 10px 20px;
            font-size: 16px;
            cursor: pointer;
            margin-top: 10px;
          }

          .mi-formulario button.agregar {
            background-color: #0D47A1;
            color: #fff;
            border: none;
            border-radius: 4px;
          }

          .mi-formulario button.agregar:hover {
            background-color: #0056b3;
          }

          .tiempo-inputs {
            display: flex;
            align-items: center;
          }

          .tiempo-inputs label {
            margin-right: 5px;
          }

          table {
            border-collapse: collapse;
            width: 100%;
          }

          th, td {
            border: 1px solid black;
            padding: 8px;
            text-align: left;
            overflow: hidden;
            white-space: nowrap;
          }

          .editar,
          .eliminar {
            padding: 8px 12px;
            border: none;
            border-radius: 5px;
            font-size: 14px;
            cursor: pointer;
            margin-right: 30px;
          }

          .editar {
            background-color: #0D47A1;
            color: #fff;
          }

          .eliminar {
            background-color: red;
            color: #fff;
            margin-left: 5px;
          }
        `}
      </style>
    </div>
  );
};

export default Administradortiempos;
