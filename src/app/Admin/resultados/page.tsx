'use client'
import React, { useState, useEffect } from 'react';
import { db } from '../../../../firebase/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';

function Resultados() {
    const [resultados, setResultados] = useState<Resultado[]>([]);
    const [nuevoResultado, setNuevoResultado] = useState({
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
        nombreCarrera: '', // Corregido el nombre de la variable
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
        nombreCarrera: string; // Corregido el nombre de la variable
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
                nombreCarrera: '', 
            });
        } catch (error) {
            console.error('Error al agregar resultado a Firebase:', error);
        }
    };

    useEffect(() => {
        const obtenerResultadosDesdeFirebase = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'resultados'));
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
            nombreCarrera: resultadoEdit.nombreCarrera, // Corregido el nombre de la variable
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
        <div>
           <br/>
                    <br/>
                    <br/>
                    <br/>
            <div className="container mx-auto p-4">
                <div className="flex justify-end mb-4">
                <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <button
                        className="bg-blue-800 hover:bg-blue-900 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out"
                        onClick={() => window.history.back()}
                        style={{
                            boxShadow: '0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08)',
                        }}
                    >
                        Volver
                    </button>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    
                </div>
                <h2 style={{ textAlign: 'center', fontSize: '2em', fontWeight: 'bold' }}>Agregar resultados</h2>
                <form onSubmit={handleSubmit} className="mb-4">
                <div className="mb-2">
                        <label htmlFor="nombre" className="block font-semibold">Nombre de la carrera:</label>
                        <input
                            type="text"
                            id="Nombre Carrera"
                            name="Nombre Carrera"
                            value={nuevoResultado.nombre}
                            onChange={handleChange}
                            className="border p-2 w-full"
                        />
                    </div>
                    <div className="mb-2">
                        <label htmlFor="nombre" className="block font-semibold">Nombre del Atleta:</label>
                        <input
                            type="text"
                            id="nombre"
                            name="nombre"
                            value={nuevoResultado.nombre}
                            onChange={handleChange}
                            className="border p-2 w-full"
                        />
                    </div>
                    <div className="mb-2">
                        <label htmlFor="fecha" className="block font-semibold">Fecha:</label>
                        <input
                            type="text"
                            id="fecha"
                            name="fecha"
                            value={nuevoResultado.fecha}
                            onChange={handleChange}
                            className="border p-2 w-full"
                        />
                    </div>
                    <div className="mb-2">
                        <label htmlFor="distancia" className="block font-semibold">Distancia:</label>
                        <input
                            type="text"
                            id="distancia"
                            name="distancia"
                            value={nuevoResultado.distancia}
                            onChange={handleChange}
                            className="border p-2 w-full"
                        />
                    </div>
                    <div className="mb-2">
                        <label htmlFor="categoria" className="block font-semibold">Categoría:</label>
                        <select
                            id="categoria"
                            name="categoria"
                            value={nuevoResultado.categoria}
                            onChange={handleChangen}
                            className="border p-2 w-full"
                        >
                            <option value="Femenino, Junior ">Femenina, Junior</option>
                            <option value="Femenino,Mayor">Femenina,Mayor</option>
                            <option value="Femenino,Veterano">Femenina,Veterano A</option>
                            <option value="Femenino,Veterano B">Femenina,Veterano B</option>
                            <option value="Femenino,Veterano C">Femenina,Veterano C</option>
                            <option value="Masculino,Junior ">Masculino,Junior</option>
                            <option value="Masculono,Mayor">Masculino,Mayor</option>
                            <option value="Masculino,Veterano ">Masculino,Veterano A</option>
                            <option value="Masculino,Veterano A">Masculino,Veterano A</option>
                            <option value="Masculino,Veterano B">Masculino,Veterano B</option>
                            <option value="Masculino,Veterano C">Masculino,Veterano C</option>
                        </select>
                    </div>
                    <div className="mb-2">
                        <div className="flex items-center">
                            <label htmlFor="horas" className="block font-semibold">Horas:</label>
                            <input
                                type="number"
                                id="horas"
                                name="horas"
                                value={nuevoResultado.horas}
                                onChange={handleChange}
                                className="border p-2 w-full"
                            />
                            <span className="mx-2">:</span>
                            {/* Separador de horas y minutos */}
                            <label htmlFor="minutos" className="block font-semibold">Minutos:</label>
                            <input
                                type="number"
                                id="minutos"
                                name="minutos"
                                value={nuevoResultado.minutos}
                                onChange={handleChange}
                                className="border p-2 w-full"
                            />
                            <span className="mx-2">:</span> {/* Separador de minutos y segundos */}
                            <label htmlFor="segundos" className="block font-semibold">Segundos:</label>
                            <input
                                type="number"
                                id="segundos"
                                name="segundos"
                                value={nuevoResultado.segundos}
                                onChange={handleChange}
                                className="border p-2 w-full"
                            />
                            <span className="mx-2">:</span> {/* Separador de segundos y nanosegundos */}
                            <label htmlFor="nanosegundos" className="block font-semibold">Nanosegundos:</label>
                            <input
                                type="number"
                                id="nanosegundos"
                                name="nanosegundos"
                                value={nuevoResultado.nanosegundos}
                                onChange={handleChange}
                                className="border p-2 w-full"
                            />
                        </div>
                    </div>
                    <div className="mb-2">
                        <div className="mb-2">
                            <div>
                                <label htmlFor="posicion" className="block font-semibold">Posición:</label>
                                <input
                                    type="text" // Cambiado a type "text"
                                    id="posicion"
                                    name="posicion"
                                    value={nuevoResultado.posicion}
                                    onChange={handleChange}
                                    className="border p-2 w-full"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="mb-2">
                        <label htmlFor="sexo" className="block font-semibold">Sexo:</label>
                        <select
                            id="sexo"
                            name="sexo"
                            value={nuevoResultado.sexo}
                            onChange={handleChangen}
                            className="border p-2 w-full"
                        >
                            <option value="Hombre">Hombre</option>
                            <option value="Mujer">Mujer</option>
                        </select>
                    </div>
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Agregar Resultado</button>
                </form>
                <h2 style={{ textAlign: 'center', fontSize: '2em', fontWeight: 'bold' }}>Resultados</h2>
                <br />
                <br />
                <table className="table-auto w-full border-collapse border border-gray-300 shadow-lg rounded">
                    <thead style={{ backgroundColor: '#B1CEE3' }} className="">
                        <tr>
                        <th className="border border-gray-500 p-2">Nombre de la carrera</th>
                            <th className="border border-gray-500 p-2">Nombre del Atleta</th>
                            <th className="border border-gray-500 p-2">Fecha</th>
                            <th className="border border-gray-500 p-2">Distancia</th>
                            <th className="border border-gray-500 p-2">Categoría</th>
                            <th className="border border-gray-500 p-2">Tiempo</th>
                            <th className="border border-gray-500 p-2">Posición</th>
                            <th className="border border-gray-500 p-2">Sexo</th>
                            <th className="border border-gray-500 p-2">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {resultados.map((resultado, index) => (
                            <tr key={index}>
                               <td className="border border-gray-500 p-2">{resultado.nombreCarrera}</td>
                                <td className="border border-gray-500 p-2">{resultado.nombre}</td>
                                <td className="border border-gray-500 p-2">{resultado.fecha}</td>
                                <td className="border border-gray-500 p-2">{resultado.distancia}</td>
                                <td className="border border-gray-500 p-2">{resultado.categoria}</td>
                                <td className="border border-gray-500 p-2">{resultado.tiempo}</td>
                                <td className="border border-gray-500 p-2">{resultado.posicion}</td>
                                <td className="border border-gray-500 p-2">{resultado.sexo}</td>
                                <td className="border border-gray-500 p-2">
                                    <button onClick={() => handleEdit(index)} className="bg-blue-500 text-white px-2 py-1 rounded">Editar</button>
                                    <button onClick={() => handleDelete(index)} className="bg-blue-500 text-white px-2 py-1 rounded ml-2">Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <style>
        {`
          body {
            margin: 0;
            padding: 0;
            background-image: url('/resultados.jpg');
            background-size: cover;
          
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          
          .container {
            max-width: 1600px;
            background-image: url('/resultados.jpg');
            padding: 20px;
            border: 1px solid #ccc;
            border-radius: 8px;
            background: rgba(200, 200, 200, 0.7);
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
        </div>
    );
}

export default Resultados;
