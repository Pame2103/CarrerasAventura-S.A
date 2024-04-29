'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaRunning, FaInfoCircle, FaDumbbell, FaEnvelope, FaTrophy, FaSignInAlt } from 'react-icons/fa';
import { db } from '../../../../firebase/firebase';
import { collection, addDoc, getDocs, deleteDoc, updateDoc, doc } from 'firebase/firestore';

interface CarreraData {
  id: string;
  nombre: string;
}

interface AtletaData {
  id: string;
  tiempo: string;
  nombreAtleta: string;
  numeroParticipante: string;
  categoria: string;
  sexo: string;
  carrera: string;
  posicion: number; 
  distancia: string;
  fecha: string;
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
  posicion: number; 
  distancia: string; 
  fecha: string; 
}

function AdministradorTiempos() {

  const [data, setData] = useState<AtletaData[]>([]);
  const [formData, setFormData] = useState<FormData>({
    nombreAtleta: '',
    numeroParticipante: '',
    tiempo: { hours: 0, minutes: 0, seconds: 0, nanoseconds: 0 },
    categoria: '', 
    sexo: '',
    carrera: '',
    posicion: 0, 
    distancia: '', 
    fecha: '' 
  });
  const [carreras, setCarreras] = useState<CarreraData[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);


  useEffect(() => {
    obtenerAtletasDesdeFirebase();
    obtenerCarrerasDesdeFirebase();
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


  const obtenerCarrerasDesdeFirebase = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'Configuracion Carreeras'));
      const carrerasData: CarreraData[] = [];

      querySnapshot.forEach((doc) => {
        carrerasData.push({ id: doc.id, nombre: doc.data().nombre } as CarreraData);
      });

      setCarreras(carrerasData);
    } catch (error) {
      console.error('Error al obtener carreras desde Firebase:', error);
    }
  };


  const addAtletaDataToFirebase = async (nuevoAtleta: FormData) => {
    try {
      const { nombreAtleta, numeroParticipante, tiempo, categoria, sexo, carrera, posicion, distancia, fecha } = nuevoAtleta;
      const tiempoString = `${tiempo.hours}:${tiempo.minutes}:${tiempo.seconds}.${tiempo.nanoseconds}`;

      const docRef= await addDoc(collection(db, 'administradortiempos'), {
        nombreAtleta,
        numeroParticipante,
        tiempo: tiempoString,
        categoria,
        sexo,
        carrera,
        posicion,
        distancia,
        fecha
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
      setData(prevData => prevData.filter(atleta => atleta.id !== id));
    } catch (error) {
      console.error('Error al eliminar el atleta:', error);
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


  const handleCarreraChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setFormData(prevFormData => ({
      ...prevFormData,
      carrera: value,
      posicion: 0,
      distancia: '',
      fecha: ''
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
        carrera: elementoAEditar.carrera,
        posicion: elementoAEditar.posicion,
        distancia: elementoAEditar.distancia,
        fecha: elementoAEditar.fecha
      });

      setEditIndex(index);
    } else {
      console.error('El campo tiempo no está definido en los datos del atleta o tiene un formato incorrecto.');
    }
  };


  const handleSave = async (index: number) => {
    try{
      const editedAtleta: AtletaData = {
        id: data[index].id,
        ...formData,
        tiempo: `${formData.tiempo.hours}:${formData.tiempo.minutes}:${formData.tiempo.seconds}.${formData.tiempo.nanoseconds}`
      };

      const newData = [...data];
      newData[index] = editedAtleta;

      setData(newData); 

      await updateDoc(doc(db, 'administradortiempos', editedAtleta.id), editedAtleta as any);

      setEditIndex(null); 
    } catch(error){
      console.error('Error al guardar los cambios:', error);
    }
  };


  const handleCancel = () => {
    setEditIndex(null);
  };


  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    

    const isEmpty = Object.values(formData).some(value => value === '');

    if (isEmpty) {
      alert('Por favor completa todos los campos.');

    }

    if (editIndex !== null) {
      handleSave(editIndex);
    } else {
      addAtletaDataToFirebase(formData);
    }
    setFormData({
      nombreAtleta: '',
      numeroParticipante: '',
      tiempo: { hours: 0, minutes: 0, seconds: 0, nanoseconds: 0 },
      categoria: '', 
      sexo: '',
      carrera: '',
      posicion: 0, 
      distancia: '', 
      fecha: '' 
    }); 
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
                    <span className="text-gray-600 hover:text-gray-900 px-0 py-0 rounded-md text-sm font-medium flex items-center">
                      <FaTrophy className="mr-1" />Confirmación de Pagos
                    </span>
                  </Link>
                  <Link href="/Admin/ControlTiempos">
                    <span className="text-gray-600 hover:text-gray-900 px-0 py-0 rounded-md text-sm font-medium flex items-center">
                      <FaTrophy className="mr-1" />Control Tiempos
                    </span>
                  </Link>
                  <Link href="/Admin/editarcarreras">
                    <span className="text-gray-600 hover:text-gray-900 px-0 py-0 rounded-md text-sm font-medium flex items-center">
                      <FaTrophy className="mr-1" />Editar Carreras
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
                </div>
              </div>
            </div>
            <div className="flex">
              <Link href="/Login"className="bg-blue-700 hover:bg-blue-700 text-white px-2  py-0 rounded-md font-medium flex items-center">
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
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '10px', boxShadow: '0 6px 8px rgba(0, 0, 0, 0.1)' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '2rem', color: '#333', textAlign: 'center' }}>ADMINISTRADOR DE TIEMPOS</h1>
          <img src="/T.gif" alt="Descripción de la imagen" className="mx-auto mb-8" style={{ width: '250px', height: '250px' }} />
          <form className="mi-formulario" onSubmit={handleSubmit}>
            <div className="form-field">
            <label htmlFor="Carrera" className="block font-semibold">Carrera:</label>
              <select
                id="carrera"
                name="carrera"
                value={formData.carrera}
                onChange={handleCarreraChange}
                className="form-input"
              >
                <option value="">Seleccione una carrera</option>
                {carreras.map(carrera => (
                  <option key={carrera.id} value={carrera.nombre}>{carrera.nombre}</option>
                ))}
              </select>
            </div>
            <div className="form-field">
            <label htmlFor="Nombre Atleta" className="block font-semibold">Nombre Atleta:</label>
              <input
                type="text"
                id="nombreAtleta"
                name="nombreAtleta"
                value={formData.nombreAtleta}
                onChange={handleChange}
                className="form-input"
              />
            </div>
            <div className="form-field">
            <label htmlFor="Numero Participante" className="block font-semibold">Numero de participante:</label>
              <input
                type="text"
                id="numeroParticipante"
                name="numeroParticipante"
                value={formData.numeroParticipante}
                onChange={handleChange}
                className="form-input"
              />
            </div>
            <div className="form-field">
              <label htmlFor="tiempo">Tiempo:</label><div className="tiempo-inputs,block font-semibold">
                <input
                  type="number"
                  name="hours"
                  value={formData.tiempo.hours}
                  onChange={handleTimeChange}
                  className="form-input"
                />
                <span>H:</span>
                <input
                  type="number"
                  name="minutes"
                  value={formData.tiempo.minutes}
                  onChange={handleTimeChange}
                  className="form-input"
                />
                <span>M:</span>
                <input
                  type="number"
                  name="seconds"
                  value={formData.tiempo.seconds}
                  onChange={handleTimeChange}
                  className="form-input"
                />
                <span>S:</span>
                <input
                  type="number"
                  name="nanoseconds"
                  value={formData.tiempo.nanoseconds}
                  onChange={handleTimeChange}
                  className="form-input"
                />
                <span>NS:</span>
              </div>
            </div>
            <div className="form-field">
              <label htmlFor="categoria" className="block font-semibold">Categoría:</label>
              <select
                id="categoria"
                name="categoria"
                value={formData.categoria} 
                onChange={(e) => setFormData(prevState => ({ ...prevState, categoria: e.target.value }))}
                className="form-input"
              >
                <option value="Categoria">Categoria</option>
                <option value="Femenino,Junior">Femenina,Junior</option>
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
            <div className="form-field">
              <label htmlFor="sexo" className="block font-semibold">Sexo:</label>
              <select
                id="sexo"
                name="sexo"
                value={formData.sexo} 
                onChange={(e) => setFormData(prevState => ({ ...prevState, sexo: e.target.value }))}
                className="form-input"
              >
                <option value="Sexo">Sexo</option>
                <option value="Femenino">Femenino</option>
                <option value="Masculino">Masculino</option>
              </select>
            </div>
     
            <div className="form-field">
            <label htmlFor="Posición" className="block font-semibold">Posición:</label>
              <input
                type="text"
                id="posicion"
                name="posicion"
                value={formData.posicion}
                onChange={handleChange}
                className="form-input"
              />
            </div>
      
            <div className="form-field">
            <label htmlFor="Distancia" className="block font-semibold">Distancia:</label>
              <input
                type="text"
                id="distancia"
                name="distancia"
                value={formData.distancia}
                onChange={handleChange}
                className="form-input"
              />
            </div>
  
            <div className="form-field">
            <label htmlFor="fecha" className="block font-semibold">Fecha:</label>
              <input
                type="date"
                id="fecha"
                name="fecha"
                value={formData.fecha}
                onChange={handleChange}
                className="form-input"
              />
            </div>
            <div className="form-field">
              <button className="agregar" type="submit">Agregar</button>
            </div>
          </form>
        </div>
        <br />
        <br />
        <br />
        <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '3rem', color: 'blue--700', textAlign: 'center' }}>Informe de tiempos:</h1>
<table className="w-full border-collapse border border-gray-300 shadow-lg rounded-center table-center">
  <thead className="bg-blue-700">
    <tr>
      <th className="px-4 py-2">#</th>
      <th className="px-4 py-2">Nombre Atleta</th>
      <th className="px-4 py-2">Numero Participante</th>
      <th className="px-4 py-2">Tiempo</th>
      <th className="px-4 py-2">Categoría</th>
      <th className="px-4 py-2">Sexo</th>
      <th className="px-4 py-2">Carrera</th>
      <th className="px-4 py-2">Posición</th>
      <th className="px-4 py-2">Distancia</th>
      <th className="px-4 py-2">Fecha</th>

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
            <span key={index}>{part}{index === 0 ? ':' : (index === 1 ? ':' : index === 2 ? ':' :index === 3 ? '.' : '')}</span>
          ))}
        </td>
        <td>{item.categoria}</td>
        <td>{item.sexo}</td>
        <td>{item.carrera}</td>

        <td>{item.posicion}</td>
        <td>{item.distancia}</td>
        <td>{item.fecha}</td>

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
        .container {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        .form-container {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .table-container {
          width: 90%; /* Ajusta el ancho de la tabla según sea necesario */
          margin-top: 50px; /* Espacio superior */
          margin-bottom: 20px; /* Espacio inferior */
        }
        
        .mi-formulario {
          margin: 0 auto; /* Esto centra el formulario horizontalmente */
          max-width: 1500px; /* Ajusta el ancho máximo según sea necesario */
        }
        
        .form-field {
          display: flex;
          flex-direction: column;
          margin-bottom: 10px;
          width: 100%;
        }
        
        .form-input {
          padding: 5px 10px;
          border: 1px solid #ccc;
          border-radius: 5px;
          font-size: 16px;
        }
        
        .agregar {
          background-color: #007bff;
          color: #fff;
          border: none;
          padding: 3px 2px;
          border-radius: 5px;
          cursor: pointer;
          font-size: 16px;
        }
        
        .editar {
          background-color: #007bff;
          color: #fff;
          border: none;
          padding: 5px 10px;
          border-radius: 5px;
          cursor: pointer;
          font-size: 14px;
          margin-right: 5px;
        }
        
        .eliminar {
          background-color:  red;
          color: #fff;
          border: none;
          padding: 5px 8px;
          border-radius: 5px;
          cursor: pointer;
          font-size: 14px;
        }
        
       
        
        .table-center th,
        .table-center td {
          padding: 4px; /* Ajusta el espacio interno de las celdas según sea necesario */
          border: 1px solid #ccc; /* Agrega un borde a todas las celdas */
        }
        
        /* Estilo para las celdas del encabezado de la tabla */
        .table-center th {
          background-color: #007bff;
          color: #fff;
        }
     
        
        `}
      </style>
    </div>
  );
}

export default AdministradorTiempos;