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

    // Función para obtener los registros desde Firebase
    useEffect(() => {
        const obtenerRecordsDesdeFirebase = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'administradortiempos'));
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
    
        let registrosFiltrados = records.filter(record =>
            (carreraSeleccionada === '' || record.carrera === carreraSeleccionada)
        );


        const mejoresTiemposPorCategoria: { [categoria: string]: Record[] } = {};

    
        registrosFiltrados.forEach(record => {
            if (!mejoresTiemposPorCategoria[record.categoria]) {
                mejoresTiemposPorCategoria[record.categoria] = [record];
            } else {
                mejoresTiemposPorCategoria[record.categoria].push(record);
            }
        });

     
        Object.keys(mejoresTiemposPorCategoria).forEach(categoria => {
            mejoresTiemposPorCategoria[categoria].sort((a, b) => {
                const tiempoA = convertirTiempoAMinutos(a.tiempo);
                const tiempoB = convertirTiempoAMinutos(b.tiempo);
                return tiempoA - tiempoB;
            });
        });

        const mejoresTiempos: Record[] = [];
        Object.keys(mejoresTiemposPorCategoria).forEach(categoria => {
            mejoresTiempos.push(...mejoresTiemposPorCategoria[categoria].slice(0, 3));
        });

      
        mejoresTiempos.sort((a, b) => {
            const tiempoA = convertirTiempoAMinutos(a.tiempo);
            const tiempoB = convertirTiempoAMinutos(b.tiempo);
            return tiempoA - tiempoB;
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
        <div>
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
            <table className="table-auto w-full border-collapse border border-gray-300 shadow-lg rounded">
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
                    {filtrarRecords().map((record, index) => (
                        <tr key={index}>
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
    );
}

export default Records;
