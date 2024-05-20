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
    carrera: string;
}

function Records() {
    const [records, setRecords] = useState<Record[]>([]);
    const [carreraSeleccionada, setCarreraSeleccionada] = useState<string>('');
    const [carreras, setCarreras] = useState<string[]>([]);

    useEffect(() => {
        const obtenerRecordsDesdeFirebase = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'administradortiempos'));
                const recordsData: Record[] = [];

                querySnapshot.forEach((doc) => {
                    recordsData.push({ id: doc.id, ...doc.data() } as Record);
                });

                // Filtrar registros pasados de fecha
                const currentDate = new Date();
                const registrosPasadosDeFecha = recordsData.filter(record => new Date(record.fecha) < currentDate);

                setRecords(registrosPasadosDeFecha);
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
                    const nombreCarrera = doc.data().nombre; 
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
        const registrosFiltrados: { [carrera: string]: { [categoria: string]: Record[] } } = {};

        records.forEach(record => {
            if (!registrosFiltrados[record.carrera]) {
                registrosFiltrados[record.carrera] = {};
            }
            if (carreraSeleccionada === '' || record.carrera === carreraSeleccionada) {
                if (!registrosFiltrados[record.carrera][record.categoria]) {
                    registrosFiltrados[record.carrera][record.categoria] = [record];
                } else {
                    registrosFiltrados[record.carrera][record.categoria].push(record);
                }
            }
        });

        return registrosFiltrados;
    };

    const obtenerMejoresTiempos = () => {
        const mejoresTiempos: { [carrera: string]: { [categoria: string]: Record[] } } = {};

        Object.keys(filtrarRecords()).forEach(carrera => {
            if (carrera === carreraSeleccionada || carreraSeleccionada === '') {
                mejoresTiempos[carrera] = {};
                Object.keys(filtrarRecords()[carrera]).forEach(categoria => {
                    const recordsCategoria = filtrarRecords()[carrera][categoria];
                    recordsCategoria.sort((a, b) => convertirTiempoAMinutos(a.tiempo) - convertirTiempoAMinutos(b.tiempo));
                    mejoresTiempos[carrera][categoria] = recordsCategoria.slice(0, 3);
                });
            }
        });

        return mejoresTiempos;
    };

    const convertirTiempoAMinutos = (tiempo: string) => {
        const [minutos, segundos] = tiempo.split(':').map(Number);
        return minutos * 60 + segundos;
    };

    const handleCarreraSeleccionada = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setCarreraSeleccionada(e.target.value);
    };

    return (
        <div style={{ margin: '20px' }}>
            <Navbar />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <h2 style={{ textAlign: 'center', fontSize: '2em', fontWeight: 'bold', backgroundColor: '#3B79D8', color: 'white' }}>Récords de corredores</h2>
            <br />
            <div className="flex items-center justify-center mb-4">
                <select value={carreraSeleccionada} onChange={handleCarreraSeleccionada} className="px-2 py-1 border border-gray-300 rounded-md mr-2">
                    <option value="">Todas las carreras</option>
                    {carreras.map((carrera, index) => (
                        <option key={index} value={carrera}>{carrera}</option>
                    ))}
                </select>
            </div>
            {Object.keys(obtenerMejoresTiempos()).map((carrera, index) => (
                <div key={index} style={{ marginBottom: '20px' }}>
                    <div style={{ backgroundColor: '#3B79D8', color: 'white', padding: '10px', marginBottom: '10px', textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50px' }}>{carrera}</div>
                    {Object.keys(obtenerMejoresTiempos()[carrera]).map((categoria, idx) => (
                        <div key={idx} style={{ marginBottom: '20px' }}>
                            <div style={{ backgroundColor: '#3B79D8', color: 'white', padding: '5px', marginBottom: '5px', textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '30px' }}>{categoria}</div>
                            <table className="table-auto w-full border-collapse border border-gray-300 shadow-lg rounded" style={{ marginBottom: '20px' }}>
                                <thead style={{ backgroundColor: '#3B79D8' }}>
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
                                    {obtenerMejoresTiempos()[carrera][categoria].map((record, idx) => (
                                        <tr key={idx}>
                                            <td className="border border-gray-500 p-2">{record.carrera}</td>
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
                    ))}
                </div>
            ))}
        </div>
    );
}

export default Records;
