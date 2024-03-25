'use client'
import React, { useState, useEffect } from 'react';
import { db } from '../../../../firebase/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';

function Resultados() {
    const [resultados, setResultados] = useState<Resultado[]>([]);

    const [nuevoResultado, setNuevoResultado] = useState({
        nombre: '',
        nombreCarrera: '', // Corrección aquí
        fecha: '',
        distancia: '',
        categoria: '',
        horas: '',
        minutos: '',
        segundos: '',
        nanosegundos: '',
        posicion: '',
        sexo: '',
    });

    interface Resultado {
        id: string;
        nombre: string;
        fecha: string;
        distancia: string;
        categoria: string;
        tiempo: string;
        nanosegundos: string;
        posicion: string;
        sexo: string;
        nombreCarrera: string; // Corrección aquí
    }
  
    const handleChangen = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNuevoResultado((prevResultado) => ({
            ...prevResultado,
            [name]: value,
        }));
    };
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNuevoResultado({
            ...nuevoResultado,
            [name]: value,
        });
    };
  
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const tiempoCompleto = `${nuevoResultado.horas}:${nuevoResultado.minutos}:${nuevoResultado.segundos}`;
        const resultadoConTiempo = {
            ...nuevoResultado,
            tiempo: tiempoCompleto,
        };
  
        try {
            const docRef = await addDoc(collection(db, 'resultados'), resultadoConTiempo);
            setResultados([...resultados, { id: docRef.id, ...resultadoConTiempo }]);
            setNuevoResultado({
                nombre: '',
                fecha: '',
                distancia: '',
                categoria: '',
                horas: '',
                minutos: '',
                segundos: '',
                nanosegundos: '',
                posicion: '',
                sexo: '',
                nombreCarrera: '', // Corrección aquí
            });
        } catch (error) {
            console.error('Error al agregar resultado a Firebase:', error);
        }
    };

    useEffect(() => {
        const obtenerResultadosDesdeFirebase = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'resultados'));
    
                // Specify the type of resultadosData using the Resultado interface
                const resultadosData: Resultado[] = [];
    
                querySnapshot.forEach((doc) => {
                    resultadosData.push({ id: doc.id, ...doc.data() } as Resultado);
                });
    
                setResultados(resultadosData);
            } catch (error) {
                console.error('Error al obtener resultados desde Firebase:', error);
            }
        };
    
        obtenerResultadosDesdeFirebase();
    }, []);

    const handleEdit = async (index: number) => {
        const resultadoEdit = resultados[index];
        setNuevoResultado({
            nombre: resultadoEdit.nombre,
            fecha: resultadoEdit.fecha,
            distancia: resultadoEdit.distancia,
            categoria: resultadoEdit.categoria,
            horas: resultadoEdit.tiempo.split(':')[0],
            minutos: resultadoEdit.tiempo.split(':')[1],
            segundos: resultadoEdit.tiempo.split(':')[2],
            nanosegundos: resultadoEdit.nanosegundos,
            posicion: resultadoEdit.posicion,
            sexo: resultadoEdit.sexo,
            nombreCarrera: resultadoEdit.nombreCarrera, // Agregado aquí
        });
    
        const nuevosResultados = resultados.filter((_, i) => i !== index);
        setResultados(nuevosResultados);
    };

    const handleDelete = async (index: number) => {
        try {
            await deleteDoc(doc(db, 'resultados', resultados[index].id));
            const nuevosResultados = resultados.filter((_, i) => i !== index);
            setResultados(nuevosResultados);
        } catch (error) {
            console.error('Error al eliminar el resultado:', error);
        }
    };
  
    return (
        <div >
            <div className="container mx-auto p-4">
                {/* Resto del código */}
                <h2 style={{ textAlign: 'center', fontSize: '2em', fontWeight: 'bold' }}>Resultados</h2>
                <br />
                <br />
                <table className="table-auto w-full border-collapse border border-gray-300 shadow-lg rounded">
                    <thead style={{ backgroundColor: '#B1CEE3' }} className="">
                        <tr>
                            <th className="border border-gray-500 p-2">Nombre del Atleta</th>
                            <th className="border border-gray-500 p-2">Fecha</th>
                            <th className="border border-gray-500 p-2">Distancia</th>
                            <th className="border border-gray-500 p-2">Categoría</th>
                            <th className="border border-gray-500 p-2">Tiempo</th>
                            <th className="border border-gray-500 p-2">Posición</th>
                            <th className="border border-gray-500 p-2">Sexo</th>
                            <th className="border border-gray-500 p-2">Carrera</th> {/* Agregado aquí */}
                            <th className="border border-gray-500 p-2">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {resultados.map((resultado, index) => (
                            <tr key={index}>
                                <td className="border border-gray-500 p-2">{resultado.nombre}</td>
                                <td className="border border-gray-500 p-2">{resultado.fecha}</td>
                                <td className="border border-gray-500 p-2">{resultado.distancia}</td>
                                <td className="border border-gray-500 p-2">{resultado.categoria}</td>
                                <td className="border border-gray-500 p-2">{resultado.tiempo}</td>
                                <td className="border border-gray-500 p-2">{resultado.posicion}</td>
                                <td className="border border-gray-500 p-2">{resultado.sexo}</td>
                                <td className="border border-gray-500 p-2">{resultado.nombreCarrera}</td> {/* Agregado aquí */}
                                <td className="border border-gray-500 p-2">
                                  
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
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

         
        `}
      </style>
    </div>




  );
  
}

export default Resultados;
