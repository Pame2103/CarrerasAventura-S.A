'use client'
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
  nombreCarrera: string;
  fecha: string; // Nuevo campo para la fecha
  edicion: string; // Nuevo campo para la edición
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
  nombreCarrera: string;
  fecha: string; // Nuevo campo para la fecha
  edicion: string; // Nuevo campo para la edición
}

function Administradortiempos() {
  const [data, setData] = useState<AtletaData[]>([]);
  const [formData, setFormData] = useState<FormData>({
    nombreAtleta: '',
    numeroParticipante: '',
    tiempo: { hours: 0, minutes: 0, seconds: 0, nanoseconds: 0 },
    categoria: '', 
    sexo: '',
    nombreCarrera: '',
    fecha: '',
    edicion: ''
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
      const { nombreAtleta, numeroParticipante, tiempo, categoria, sexo, nombreCarrera, fecha, edicion } = nuevoAtleta;
      const tiempoString = `${tiempo.hours}:${tiempo.minutes}:${tiempo.seconds}.${tiempo.nanoseconds}`;

      const docRef = await addDoc(collection(db, 'administradortiempos'), {
        nombreAtleta,
        numeroParticipante,
        tiempo: tiempoString,
        categoria,
        sexo,
        nombreCarrera,
        fecha,
        edicion
      });

      console.log('Datos del atleta agregados con ID: ', docRef.id);
      obtenerAtletasDesdeFirebase();
    } catch (error) {
      console.error('Error al agregar datos del atleta:', error);
    }
  };

  const handleEliminarAtleta = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'administradortiempos', id));
      obtenerAtletasDesdeFirebase();
    } catch (error) {
      console.error('Error al eliminar el atleta:', error);
    }
  };

  const handleEditarAtleta = async (id: string, atletaEditado: FormData) => {
    try {
      const { nombreAtleta, numeroParticipante, tiempo, categoria, sexo, nombreCarrera, fecha, edicion } = atletaEditado;
      const tiempoString = `${tiempo.hours}:${tiempo.minutes}:${tiempo.seconds}.${tiempo.nanoseconds}`;

      await updateDoc(doc(db, 'administradortiempos', id), {
        nombreAtleta,
        numeroParticipante,
        tiempo: tiempoString,
        categoria,
        sexo,
        nombreCarrera,
        fecha,
        edicion
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

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      fecha: value
    }));
  };

  const handleEditionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      edicion: value
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    addAtletaDataToFirebase(formData);

    setFormData({
      nombreAtleta: '',
      numeroParticipante: '',
      tiempo: { hours: 0, minutes: 0, seconds: 0, nanoseconds: 0 },
      categoria: '',
      sexo: '',
      nombreCarrera: '',
      fecha: '',
      edicion: ''
    });
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
        nombreCarrera: elementoAEditar.nombreCarrera,
        fecha: elementoAEditar.fecha,
        edicion: elementoAEditar.edicion
      });

      setEditIndex(index);
    } else {
      console.error('El campo tiempo no está definido en los datos del atleta o tiene un formato incorrecto.');
    }
  };

  const handleSave = (index: number) => {
    const newData = data.slice();
    const editedAtleta: AtletaData = {
      id: data[index].id,
      ...formData,
      tiempo: `${formData.tiempo.hours}:${formData.tiempo.minutes}:${formData.tiempo.seconds}.${formData.tiempo.nanoseconds}`
    };
    newData[index] = editedAtleta;
  
    setData(newData);
    setFormData({
      nombreAtleta: '',
      numeroParticipante: '',
      tiempo: { hours: 0, minutes: 0, seconds: 0, nanoseconds: 0 },
      categoria: '',
      sexo: '',
      nombreCarrera: '',
      fecha: '',
      edicion: ''
    });
    setEditIndex(null);
  };

  const handleDelete = (index: number) => {
    const newData = data.filter((_, i) => i !== index);
    setData(newData);
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
  }

  return (
    <div className="container">
      <br />
      <br />
      <br />
      <div className="form-container">
        <Navbar />
        <br />
        <br />
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '2rem', color: '#333', textAlign: 'center' }}>ADMINISTRADOR DE TIEMPOS</h1>
        
          <img src="/T.gif" alt="Descripción de la imagen" className="mx-auto mb-8" style={{ width: '250px', height: '200px' }} />
          
          <form className="mi-formulario" onSubmit={handleSubmit}>

          <div>
              <label htmlFor="nombreCarrera">Nombre Carrera:</label>
              <input
                type="text"
                id="nombreCarrera"
                name="nombreCarrera"
                value={formData.nombreCarrera}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="fecha">Fecha:</label>
              <input
                type="date"
                id="fecha"
                name="fecha"
                value={formData.fecha}
                onChange={handleDateChange}
              />
            </div>

            <div>
              <label htmlFor="edicion">Edición:</label>
              <input
                type="text"
                id="edicion"
                name="edicion"
                value={formData.edicion}
                onChange={handleEditionChange}
              />
            </div>
            <div>
              <label htmlFor="categoria">Categoría:</label>
              <input
                type="text"
                id="categoria"
                name="categoria"
                value={formData.categoria}
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
            
          

            <div style={{ marginBottom: '20px' }}>
    <label htmlFor="sexo" style={{ display: 'inline-block', width: '150px' }}>Sexo:</label>
    <select
      id="sexo"
      name="sexo"
      value={formData.sexo}
     // onChange={handleInputChange}
      required
      style={{ display: 'inline-block' }}
    >
       <option value="">Seleccione</option>
      <option value="femenino">Femenino</option>
      <option value="masculino">Masculino</option>
    </select>
  </div>
            
            
            
            <button type="submit" className="btn-agregar">
              Agregar
            </button>
          </form>
        </div>
      </div>
      <div style={{ marginTop: '4rem' }}>
        <table className="table-fixed w-full border-collapse border border-gray-500">
          <thead>
            <tr>
              <th className="w-1/5 border border-gray-500 px-4 py-2 text-gray-600">Nombre Carrera</th>
              <th className="w-1/5 border border-gray-500 px-4 py-2 text-gray-600">Nombre Atleta</th>
              <th className="w-1/5 border border-gray-500 px-4 py-2 text-gray-600">Numero Participante</th>
              <th className="w-1/5 border border-gray-500 px-4 py-2 text-gray-600">Tiempo</th>
              <th className="w-1/5 border border-gray-500 px-4 py-2 text-gray-600">Categoria</th>
              <th className="w-1/5 border border-gray-500 px-4 py-2 text-gray-600">Sexo</th>
              <th className="w-1/5 border border-gray-500 px-4 py-2 text-gray-600">Fecha</th>
              <th className="w-1/5 border border-gray-500 px-4 py-2 text-gray-600">Edición</th>
              <th className="w-1/5 border border-gray-500 px-4 py-2 text-gray-600">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {data.map((atleta, index) => (
              <tr key={atleta.id}>
                <td className="border border-gray-500 px-4 py-2">{atleta.nombreCarrera}</td>
                <td className="border border-gray-500 px-4 py-2">{atleta.nombreAtleta}</td>
                <td className="border border-gray-500 px-4 py-2">{atleta.numeroParticipante}</td>
                <td className="border border-gray-500 px-4 py-2">{atleta.tiempo}</td>
                <td className="border border-gray-500 px-4 py-2">{atleta.categoria}</td>
                <td className="border border-gray-500 px-4 py-2">{atleta.sexo}</td>
                <td className="border border-gray-500 px-4 py-2">{atleta.fecha}</td>
                <td className="border border-gray-500 px-4 py-2">{atleta.edicion}</td>
                <td className="border border-gray-500 px-4 py-2">
                  {editIndex === index ? (
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mr-2" onClick={() => handleSave(index)}>Guardar</button>
                  ) : (
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mr-2" onClick={() => handleEdit(index)}>Editar</button>
                  )}
                  <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded" onClick={() => handleEliminarAtleta(atleta.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
            width: 50%;
            table-layout: fixed;
          }
          .container {
            max-width: 1400px;
            padding: 20px;
            border: 1px solid #ccc;
            border-radius: 5px;
            background: rgba(250, 250, 250, 0.3);
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
            background-color:red;
            color: #fff;
            margin-left: 5px;
          }
        `}
      </style>
      </div>
    </div>
  );
}


export default Administradortiempos; 