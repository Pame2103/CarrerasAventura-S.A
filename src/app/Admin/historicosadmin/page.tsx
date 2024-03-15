
'use client'
import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc } from 'firebase/firestore';
import { db } from '../../../../firebase/firebase';

interface Dato {
  nombre: string;
  tiempo: string;
  cedula: string;
  posicion: string;
  categoria: string;
}

function HistoricosAdmi() {
  const [nombre, setNombre] = useState('');
  const [horas, setHoras] = useState(0);
  const [minutos, setMinutos] = useState(0);
  const [segundos, setSegundos] = useState(0);
  const [nanosegundos, setNanosegundos] = useState(0);
  const [cedula, setCedula] = useState('');
  const [posicion, setPosicion] = useState('');
  const [categoria, setCategoria] = useState('');
  const [loading, setLoading] = useState(true);
  const [datos, setDatos] = useState<Dato[]>([]); 

  useEffect(() => {
    const historicosCollection = collection(db, 'Historicos');

    const unsubscribe = onSnapshot(historicosCollection, (snapshot) => {
      const historicosData = snapshot.docs.map((doc) => doc.data());
   
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

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
      setPosicion('');
      setCategoria('');
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const handleDelete = (index: number) => {
    const nuevosDatos = [...datos];
    nuevosDatos.splice(index, 1);
    setDatos(nuevosDatos);
  };

  const handleEdit = (index: number) => {
    const datoEditado = datos[index];
    setNombre(datoEditado.nombre);

    if (datoEditado.tiempo) {
      const tiempoMatches = datoEditado.tiempo.match(/\d+\w/g);
      if (tiempoMatches) {
        const [horas, minutos, segundos, nanosegundos] = tiempoMatches.map((parte) => parseInt(parte, 10));

        setHoras(horas);
        setMinutos(minutos);
        setSegundos(segundos);
        setNanosegundos(nanosegundos);
      }
    }

    setCedula(datoEditado.cedula);
    setPosicion(datoEditado.posicion);
    setCategoria(datoEditado.categoria);

    handleDelete(index);
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '15px' }}>
      <div style={{ textAlign: 'right', marginBottom: '10px' }}>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
          onClick={() => window.history.back()}
          style={{
            boxShadow: '0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08)',
          }}
        >
          Volver
        </button>
      </div>
      <h2 style={{ textAlign: 'center', fontSize: '2em', fontWeight: 'bold' }}>Agregar Historicos</h2>
  
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
            type="text"
            value={posicion}
            onChange={(e) => setPosicion(e.target.value)}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Categoria:</label>
          <input
            type="text"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>
        <button type="submit" style={{ background: '#0D47A1', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}>Agregar</button>
      </form>
      <h2 style={{ textAlign: 'center', fontSize: '2em', fontWeight: 'bold' }}> Historicos</h2>
      <div className="tabla-contenedor" style={{ marginTop: '30px' }}>
      <table className="table-auto w-full border-collapse border border-gray-300 shadow-lg rounded">
        <thead style={{ backgroundColor: '#B1CEE3' }} className="">
            <tr>
              <th style={{ padding: '15px', borderBottom: '1px solid #ccc' }}>Nombre</th>
              <th style={{ padding: '15px', borderBottom: '1px solid #ccc' }}>Tiempo</th>
              <th style={{ padding: '15px', borderBottom: '1px solid #ccc' }}>Cedula</th>
              <th style={{ padding: '15px', borderBottom: '1px solid #ccc' }}>Posicion</th>
              <th style={{ padding: '15px', borderBottom: '1px solid #ccc' }}>Categoria</th>
              <th style={{ padding: '15px', borderBottom: '1px solid #ccc' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {datos.map((dato, index) => (
              <tr key={index}>
                <td style={{ padding: '15px', borderBottom: '1px solid #ccc' }}>{dato.nombre}</td>
                <td style={{ padding: '15px', borderBottom: '1px solid #ccc' }}>{dato.tiempo}</td>
                <td style={{ padding: '15px', borderBottom: '1px solid #ccc' }}>{dato.cedula}</td>
                <td style={{ padding: '15px', borderBottom: '1px solid #ccc' }}>{dato.posicion}</td>
                <td style={{ padding: '15px', borderBottom: '1px solid #ccc' }}>{dato.categoria}</td>
                <td style={{ padding: '15px', borderBottom: '1px solid #ccc' }}>
                  <button onClick={() => handleDelete(index)} style={{ background: '#0D47A1', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', marginRight: '4px' }}>Eliminar</button>
                  <button onClick={() => handleEdit(index)} style={{ background: '#0D47A1', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>Editar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

}
<style>
        {`

.contenedor {
  background-color: #fff; /* Fondo blanco */
  padding: 20px; /* Espaciado interior */
  border-radius: 8px; /* Bordes redondeados */
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); /* Sombra */
  margin: 20px auto; /* Margen exterior */
  max-width: 800px; /* Ancho máximo del contenedor */
}
/* Estilos globales */
          .container {
            max-width: 1300px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #ccc;
            border-radius: 8px;
            background: #f9f9f9;
          }


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
            text-align: center; /* Centrar el contenido dentro del contenedor */
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
            width: 70%;
            table-layout: fixed; /* Añade esta línea */
           
          }

          th, td {
            border: 1px solid black;
            padding: 8px;
            text-align: left;
            overflow: hidden; /* Añade esta línea */
            white-space: nowrap; /* Añade esta línea */
          }

          .editar,
          .eliminar {
            padding: 8px 12px;
            border: none;
            border-radius: 5px;
            font-size: 14px;
            cursor: pointer;
            margin-right: 30px; /* Ajusta el valor de margen derecho según tu preferencia */
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

export default HistoricosAdmi;
