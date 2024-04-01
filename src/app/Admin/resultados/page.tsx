'use client'
import React, { useState, useEffect } from 'react';
import { db } from '../../../../firebase/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';

function Resultados() {
    const [resultados, setResultados] = useState<Resultado[]>([]);
    const [nuevoResultado, setNuevoResultado] = useState({
        nombreAtleta: '', 
        nombreCarrera: '',
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
    const [posicion, setPosicion] = useState<number>(1);

    interface Resultado {
        id: string;
        nombreAtleta: string;
        fecha: string;
        distancia: string;
        categoria: string;
        tiempo: string;
        nanosegundos: string;
        posicion: string;
        sexo: string;
        nombreCarrera: string;
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNuevoResultado({
            ...nuevoResultado,
            [name]: value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const tiempoCompleto = `${nuevoResultado.horas}:${nuevoResultado.minutos}:${nuevoResultado.segundos}.${nuevoResultado.nanosegundos}`;
        const resultadoConTiempo = {
            ...nuevoResultado,
            tiempo: tiempoCompleto,
            posicion: String(posicion),
        };

        try {
            const docRef = await addDoc(collection(db, 'resultados'), resultadoConTiempo);
            setResultados([...resultados, { id: docRef.id, ...resultadoConTiempo }]);
            setNuevoResultado({
                nombreAtleta: '', 
                nombreCarrera: '',
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
            setPosicion(1);
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
            nombreAtleta: resultadoEdit.nombreAtleta,
            nombreCarrera: resultadoEdit.nombreCarrera,
            fecha: resultadoEdit.fecha,
            distancia: resultadoEdit.distancia,
            categoria: resultadoEdit.categoria,
            horas: resultadoEdit.tiempo.split(':')[0],
            minutos: resultadoEdit.tiempo.split(':')[1],
            segundos: resultadoEdit.tiempo.split(':')[2].split('.')[0],
            nanosegundos: resultadoEdit.tiempo.split(':')[2].split('.')[1],
            posicion: resultadoEdit.posicion,
            sexo: resultadoEdit.sexo,
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
             <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
                <br />
            <div className="container mx-auto p-4">
                <h2 style={{ textAlign: 'center', fontSize: '2em', fontWeight: 'bold' }}>Agregar resultados</h2>
                <form onSubmit={handleSubmit} className="mb-4">
                    <div className="mb-2">
                        <label htmlFor="nombreCarrera" className="block font-semibold">Nombre de la carrera:</label>
                        <input
                            type="text"
                            id="nombreCarrera"
                            name="nombreCarrera"
                            value={nuevoResultado.nombreCarrera}
                            onChange={handleChange}
                            className="border p-2 w-full"
                        />
                    </div>
                    <div className="mb-2">
                        <label htmlFor="nombreAtleta" className="block font-semibold">Nombre del Atleta:</label>
                        <input
                            type="text"
                            id="nombreAtleta"
                            name="nombreAtleta"
                            value={nuevoResultado.nombreAtleta}
                            onChange={handleChange}
                            className="border p-2 w-full"
                        />
                    </div>
                    <div className="mb-2">
                        <label htmlFor="fecha" className="block font-semibold">Fecha:</label>
                        <input
                            type="date"
                            id="fecha"
                            name="fecha"
                            value={nuevoResultado.fecha}
                            onChange={handleChange}
                           
                            className="border p-2 w-full"
                            placeholder="2024-10-31"
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
                            className="border p-2 w-full"
                            onChange={handleChange}
                            value={nuevoResultado.categoria}
                        >
                            <option value="Femenino, Junior">Femenina, Junior</option>
                            <option value="Femenino,Mayor">Femenina,Mayor</option>
                            <option value="Femenino,Veterano">Femenina,Veterano A</option>
                            <option value="Femenino,Veterano B">Femenina,Veterano B</option>
                            <option value="Femenino,Veterano C">Femenina,Veterano C</option>
                            <option value="Masculino,Junior">Masculino,Junior</option>
                            <option                             value="Masculino,Mayor">Masculino,Mayor</option>
                            <option value="Masculino,Veterano">Masculino,Veterano A</option>
                            <option value="Masculino,Veterano A">Masculino,Veterano A</option>
                            <option value="Masculino,Veterano B">Masculino,Veterano B</option>
                            <option value="Masculino,Veterano C">Masculino,Veterano C</option>
                        </select>
                    </div>
                    <div className="mb-2">
                        <label htmlFor="tiempo" className="block font-semibold">Tiempo:</label>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <input
                                type="number"
                                value={nuevoResultado.horas}
                                min="0"
                                onChange={(e) => setNuevoResultado({ ...nuevoResultado, horas: e.target.value })}
                                style={{ width: '100px', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', marginRight: '10px' }}
                            />
                            <span>h</span>
                            <input
                                type="number"
                                value={nuevoResultado.minutos}
                                min="0"
                                max="59"
                                onChange={(e) => setNuevoResultado({ ...nuevoResultado, minutos: e.target.value })}
                                style={{ width: '80px', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', margin: '0 10px' }}
                            />
                            <span>m</span>
                            <input
                                type="number"
                                value={nuevoResultado.segundos}
                                min="0"
                                max="59"
                                onChange={(e) => setNuevoResultado({ ...nuevoResultado, segundos: e.target.value })}
                                style={{ width: '80px', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', margin: '0 10px' }}
                            />
                            <span>s</span>
                            <input
                                type="number"
                                value={nuevoResultado.nanosegundos}
                                min="0"
                                max="999999999"
                                onChange={(e) => setNuevoResultado({ ...nuevoResultado, nanosegundos: e.target.value })}
                                style={{ width: '120px', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                            />
                            <span>ns</span>
                        </div>
                    </div>
                    <div className="mb-2">
                        <label htmlFor="posicion" className="block font-semibold">Posición:</label>
                        <input
                            type="number"
                            id="posicion"
                            name="posicion"
                            value={posicion}
                            min="1"
                            onChange={(e) => setPosicion(parseInt(e.target.value))}
                            className="border p-2 w-full"
                        />
                    </div>
                    <div className="mb-2">
                        <label htmlFor="sexo" className="block font-semibold">Sexo:</label>
                        <select
                            id="sexo"
                            name="sexo"
                            value={nuevoResultado.sexo}
                            onChange={handleChange}
                            className="border p-2 w-full"
                        >
                            <option value="Femenino">Femenino</option>
                            <option value="Masculino">Masculino</option>
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
                                <td className="border border-gray-500 p-2">{resultado.nombreAtleta}</td>
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
          background-size: cover;
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .container {
            max-width: 1600px;
            padding: 20px;
            border: 1px solid #ccc;
            border-radius: 8px;
            background: rgba(200, 200, 200, 0.7);
          }
          
          .form-container {
            text-align: left;
          }
        `}
            </style>
        </div>
    );
}

export default Resultados;
