'use client'
import React, { useState, useEffect } from 'react';
import { db } from '../../../../firebase/firebase';
import { collection, getDocs } from 'firebase/firestore';
import Navbar from '@/app/componentes/navbar';

interface Record {
    id: string;
    nombreAtleta: string;
    fecha: string;
    distancia: string;
    categoria: string;
    tiempo: string;
    posicion: string;
    sexo: string;
    nombreCarrera: string;
}

function Records() {
    const [records, setRecords] = useState<Record[]>([]);
    const [carreras, setCarreras] = useState<string[]>([]);
    const [filtro, setFiltro] = useState<string>('');

    useEffect(() => {
        const obtenerRecordsDesdeFirebase = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'administradortiempos'));
                const recordsData: Record[] = [];

                querySnapshot.forEach((doc) => {
                    recordsData.push({ id: doc.id, ...doc.data() } as Record);
                });

                // Agrupar los datos por carrera y categoría, y encontrar el mejor tiempo para cada combinación
                const mejoresTiempos: Record[] = [];
                const gruposPorCarreraYCategoria: { [key: string]: Record[] } = {};

                for (const record of recordsData) {
                    const key = `${record.nombreCarrera}-${record.categoria}`;
                    if (!gruposPorCarreraYCategoria[key]) {
                        gruposPorCarreraYCategoria[key] = [];
                    }
                    gruposPorCarreraYCategoria[key].push(record);
                }

                for (const grupo of Object.values(gruposPorCarreraYCategoria)) {
                    const mejorTiempo = grupo.reduce((prev, curr) => {
                        const prevTiempo = parseFloat(prev.tiempo.replace(':', '.'));
                        const currTiempo = parseFloat(curr.tiempo.replace(':', '.'));
                        return prevTiempo < currTiempo ? prev : curr;
                    });
                    mejoresTiempos.push(mejorTiempo);
                }

                setRecords(mejoresTiempos);
            } catch (error) {
                console.error('Error al obtener récords desde Firebase:', error);
            }
        };

        obtenerRecordsDesdeFirebase();
    }, []);

    useEffect(() => {
        const obtenerCarrerasDesdeFirebase = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'Configuracion Carreeras'));
                const carrerasData: string[] = [];

                querySnapshot.forEach((doc) => {
                    const nombreCarrera = doc.data().nombre; // Obtener específicamente el campo 'nombre'
                    carrerasData.push(nombreCarrera);
                });

                setCarreras(carrerasData);
            } catch (error) {
                console.error('Error al obtener carreras desde Firebase:', error);
            }
        };

        obtenerCarrerasDesdeFirebase();
    }, []);

    const handleBuscar = () => {
        // Filtrar registros por nombre de atleta o categoría
        const registrosFiltrados = records.filter(record =>
            record.nombreAtleta.toLowerCase().includes(filtro.toLowerCase()) ||
            record.categoria.toLowerCase().includes(filtro.toLowerCase())
        );
        setRecords(registrosFiltrados);
    };

    return (
        <div>
            <Navbar />
            <br />
            <br />
            <div className="container mx-auto p-4">
                <h2 style={{ textAlign: 'center', fontSize: '2em', fontWeight: 'bold' }}>Récords de corredores</h2>
                <div className="flex justify-center mb-4">
                    <input
                        type="text"
                        placeholder="Buscar por nombre o categoría"
                        value={filtro}
                        onChange={(e) => setFiltro(e.target.value)}
                        className="px-2 py-1 border border-gray-300 rounded-md mr-2"
                    />
                    <button onClick={handleBuscar} className="px-4 py-2 bg-blue-500 text-white rounded-md">Buscar</button>
                </div>
                <table className="table-auto w-full border-collapse border border-gray-300 shadow-lg rounded">
                    <thead style={{ backgroundColor: '#B1CEE3' }}>
                        <tr>
                            <th className="border border-gray-500 p-2">Nombre de la carrera</th>
                            <th className="border border-gray-500 p-2">Nombre del Atleta</th>
                            <th className="border border-gray-500 p-2">Fecha</th>
                            <th className="border border-gray-500 p-2">Distancia</th>
                            <th className="border border-gray-500 p-2">Categoría</th>
                            <th className="border border-gray-500 p-2">Tiempo</th>
                            
                            <th className="border border-gray-500 p-2">Sexo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {records.map((record, index) => (
                            <tr key={index}>
                                <td className="border border-gray-500 p-2">{record.nombreCarrera}</td>
                                <td className="border border-gray-500 p-2">{record.nombreAtleta}</td>
                                <td className="border border-gray-500 p-2">{record.fecha}</td>
                                <td className="border border-gray-500 p-2">{record.distancia}</td>
                                <td className="border border-gray-500 p-2">{record.categoria}</td>
                                <td className="border border-gray-500 p-2">{record.tiempo}</td>
                             
                                <td className="border border-gray-500 p-2">{record.sexo}</td>
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

export default Records;
