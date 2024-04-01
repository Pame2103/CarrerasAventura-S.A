'use client'
import React, { useState, useEffect } from 'react';
import { db } from '../../../../firebase/firebase';
import { collection, getDocs } from 'firebase/firestore';

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
    const [carreraSeleccionada, setCarreraSeleccionada] = useState<string>('');
    const [carreras, setCarreras] = useState<string[]>([]);

    useEffect(() => {
        const obtenerRecordsDesdeFirebase = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'records'));
                const recordsData: Record[] = [];

                querySnapshot.forEach((doc) => {
                    recordsData.push({ id: doc.id, ...doc.data() } as Record);
                });

                setRecords(recordsData);
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

    const filtrarRecords = () => {
        return records.filter(record =>
            (carreraSeleccionada === '' || record.nombreCarrera === carreraSeleccionada)
        );
    };

    const handleCarreraSeleccionada = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setCarreraSeleccionada(e.target.value);
    };

    return (
        <div>
            <div className="container mx-auto p-4">
                <h2 style={{ textAlign: 'center', fontSize: '2em', fontWeight: 'bold' }}>Récords de corredores</h2>
                <div className="flex items-center justify-center mb-4">
                    <select value={carreraSeleccionada} onChange={handleCarreraSeleccionada} className="px-2 py-1 border border-gray-300 rounded-md mr-2">
                        <option value="">Todas las carreras</option>
                        {carreras.map((carrera, index) => (
                            <option key={index} value={carrera}>{carrera}</option>
                        ))}
                    </select>
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
                            <th className="border border-gray-500 p-2">Posición</th>
                            <th className="border border-gray-500 p-2">Sexo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtrarRecords().map((record, index) => (
                            <tr key={index}>
                                <td className="border border-gray-500 p-2">{record.nombreCarrera}</td>
                                <td className="border border-gray-500 p-2">{record.nombreAtleta}</td>
                                <td className="border border-gray-500 p-2">{record.fecha}</td>
                                <td className="border border-gray-500 p-2">{record.distancia}</td>
                                <td className="border border-gray-500 p-2">{record.categoria}</td>
                                <td className="border border-gray-500 p-2">{record.tiempo}</td>
                                <td className="border border-gray-500 p-2">{record.posicion}</td>
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
