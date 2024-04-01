'use client';
import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../../firebase/firebase';

interface Dato {
  id: string;
  nombre: string;
  tiempo: string;
  cedula: string;
  posicion: number; 
  categoria: string;
}

function HistoricosAdmi() {
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
          {/* Contador de números para la posición */}
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
      <h2 style={{ textAlign: 'center', fontSize: '2em', fontWeight: 'bold' }}> Historicos</h2>
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
      <button onClick={() => handleDelete(dato.id)} style={{ background: '#0D47A1', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', marginRight: '4px' }}>Eliminar</button>
      <button onClick={() => handleEdit(dato.id)} style={{ background: '#0D47A1', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}>Editar</button>
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
          body {
            margin: 0;
            padding: 0;
            background-image: url('/admi.jpeg');
            background-size: cover;
            background-repeat: no-repeat;
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          
          .container {
            max-width: 800px;
            padding: 20px;
            border: 1px solid #ccc;
            border-radius: 8px;
            background: rgba(255, 255, 255, 0.8); /* Agregar fondo blanco semi-transparente para mejorar la legibilidad */
          }
          
          .form-container {
            text-align: left;
          }
          
          .form-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 16px;
          }
          
          .form-field {
            flex: 0 0 calc(33.33% - 8px);
          }
          
          .form-container form div {
            margin-bottom: 10px;
          }
          
          .form-container form button {
            margin-top: 10px;
            background: #1976D2;
            color: white;
          }
        `}
      </style>

export default HistoricosAdmi;
