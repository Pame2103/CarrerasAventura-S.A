'use client'
import React, { useState, useEffect } from 'react';
import { db } from '../../../../firebase/firebase';
import { collection, addDoc, getDocs, deleteDoc, updateDoc, doc } from 'firebase/firestore';

interface AtletaData {
  id: string;
  tiempo: string;
  nombreAtleta: string;
  numeroParticipante: string;
  categoria: string;
  sexo: string;
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
}

function Administradortiempos() {
  const [data, setData] = useState<AtletaData[]>([]);
  const [formData, setFormData] = useState<FormData>({
    nombreAtleta: '',
    numeroParticipante: '',
    tiempo: { hours: 0, minutes: 0, seconds: 0, nanoseconds: 0 },
    categoria: '',
    sexo: ''
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
      const { nombreAtleta, numeroParticipante, tiempo, categoria, sexo } = nuevoAtleta;
      const tiempoString = `${tiempo.hours}:${tiempo.minutes}:${tiempo.seconds}.${tiempo.nanoseconds}`;

      const docRef = await addDoc(collection(db, 'administradortiempos'), {
        nombreAtleta,
        numeroParticipante,
        tiempo: tiempoString,
        categoria,
        sexo,
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
      const { nombreAtleta, numeroParticipante, tiempo, categoria, sexo } = atletaEditado;
      const tiempoString = `${tiempo.hours}:${tiempo.minutes}:${tiempo.seconds}.${tiempo.nanoseconds}`;

      await updateDoc(doc(db, 'administradortiempos', id), {
        nombreAtleta,
        numeroParticipante,
        tiempo: tiempoString,
        categoria,
        sexo,
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

  const formatTime = (tiempoString: string): string => {
    const [hours, minutes, secondsAndNanoseconds] = tiempoString.split(':');
    const [seconds, milliseconds] = secondsAndNanoseconds.split('.');
  
    const tiempoEnMilisegundos =
      parseInt(hours) * 3600000 +
      parseInt(minutes) * 60000 +
      parseInt(seconds) * 1000 +
      parseInt(milliseconds);
  
    const formattedTime = new Date(tiempoEnMilisegundos).toISOString().substr(11, 12);
    return formattedTime;
  };
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setFormData({
      nombreAtleta: '',
      numeroParticipante: '',
      tiempo: { hours: 0, minutes: 0, seconds: 0, nanoseconds: 0 },
      categoria: '',
      sexo: ''
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
        sexo: elementoAEditar.sexo
      });

      setEditIndex(index);
    } else {
      console.error('El campo tiempo no está definido en los datos del atleta o tiene un formato incorrecto.');
    }
  };

  const handleSave = (index: number) => {
    const newData = data.slice();
    const editedAtleta: AtletaData = {
      id: data[index].id, // Incluir el id existente
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
      sexo: ''
    });
    setEditIndex(null);
  };

  const handleDelete = (index: number) => {
    const newData = data.filter((_, i) => i !== index);
    setData(newData);
  };

  return (
    <div>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded absolute top-0 right-0 mt-4 mr-4"
        onClick={() => window.history.back()}
      >
        Volver
      </button>
      <br />
      <br />
      <h2 style={{ textAlign: 'center', fontSize: '2em', fontWeight: 'bold' }}>Perfil Administradores</h2>
      <br />
      <br />

      <form className="mi-formulario" onSubmit={handleSubmit}>
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
        <div>
          <label htmlFor="categoria">Categoria:</label>
          <input
            type="text"
            id="categoria"
            name="categoria"
            value={formData.categoria}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="sexo">Sexo:</label>
          <input
            type="text"
            id="sexo"
            name="sexo"
            value={formData.sexo}
            onChange={handleChange}
          />
        </div>
        <button className="agregar" type="submit">Agregar</button>
        <br />
        <br />
      </form>

      <table className="table-center w-full border-collapse border border-gray-300 shadow-lg rounded-center">
        <thead style={{ backgroundColor: '#B1CEE3' }} className="">
          <tr>
            <th>Nombre Atleta</th>
            <th>Numero Participante</th>
            <th>Tiempo</th>
            <th>Categoria</th>
            <th>Sexo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item.nombreAtleta}</td>
              <td>{item.numeroParticipante}</td>
              <td>
                {item.tiempo && item.tiempo.split(/[:.]/).map((part, index) => (
                  <span key={index}>{part}{index === 1 ? ':' : (index === 2 ? '.' : '')}</span>
                ))}
              </td>
              <td>{item.categoria}</td>
              <td>{item.sexo}</td>
              <td>
                <button className="editar" onClick={() => handleEdit(index)}>
                  Editar
                </button>
                <button
                  className="eliminar"
                  onClick={() => handleDelete(index)}
                >
                  Eliminar
                </button>
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
            width: 80%;
            table-layout: fixed;
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
            background-color: #0D47A1;
            color: #fff;
            margin-left: 5px;
          }
        `}
      </style>
    </div>
  );
}

export default Administradortiempos;
