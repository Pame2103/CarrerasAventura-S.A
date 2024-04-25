'use client'
import React, { useState, useEffect } from 'react';
import { db } from '../../../../firebase/firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import Navbar from '@/app/componentes/navbar';

function Resultados() {
    const [resultados, setResultados] = useState<Resultado[]>([]);
    const [nuevoResultado, setNuevoResultado] = useState({
        nombreAtleta: '', 
        carrera: '',
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
    const [filtro, setFiltro] = useState<string>('');

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
        carrera: string;
    }

    useEffect(() => {
        const obtenerResultadosDesdeFirebase = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'administradortiempos'));
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

    const filtrarResultados = () => {
        return resultados.filter(resultado =>
            resultado.nombreAtleta.toLowerCase().includes(filtro.toLowerCase()) ||
            resultado.carrera.toLowerCase().includes(filtro.toLowerCase())
        );
    };

    const handleBuscar = () => {
        // Filtrar los resultados y actualizar el estado
        const resultadosFiltrados = filtrarResultados();
        setResultados(resultadosFiltrados);
    };

    return (

        <div>
             <Navbar />
             <br/>
             <br/>
            <div className="container mx-auto p-4">
                <h2 style={{ textAlign: 'center', fontSize: '2em', fontWeight: 'bold' }}>Resultados de las carreras</h2>
                <div className="flex items-center justify-center mb-4">
                    <input
                        type="text"
                        placeholder="Buscar por nombre de atleta o nombre de carrera"
                        value={filtro}
                        onChange={(e) => setFiltro(e.target.value)}
                        className="px-2 py-1 border border-gray-300 rounded-md mr-2"
                    />
                    <button onClick={handleBuscar} className="px-3 py-1 bg-blue-500 text-white rounded-md">Buscar</button>
                </div>
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
                        </tr>
                    </thead>
                    <tbody>
                        {resultados.map((resultado, index) => (
                            <tr key={index}>
                                <td className="border border-gray-500 p-2">{resultado.carrera}</td>
                                <td className="border border-gray-500 p-2">{resultado.nombreAtleta}</td>
                                <td className="border border-gray-500 p-2">{resultado.fecha}</td>
                                <td className="border border-gray-500 p-2">{resultado.distancia}</td>
                                <td className="border border-gray-500 p-2">{resultado.categoria}</td>
                                <td className="border border-gray-500 p-2">{resultado.tiempo}</td>
                                <td className="border border-gray-500 p-2">{resultado.posicion}</td>
                                <td className="border border-gray-500 p-2">{resultado.sexo}</td>
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
                `}
            </style>
        </div>
    );
}

export default Resultados;
