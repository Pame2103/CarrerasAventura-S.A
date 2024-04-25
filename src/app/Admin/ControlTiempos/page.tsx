'use client'
import React, { useState, useEffect } from 'react';
import { db } from '../../../../firebase/firebase';
import { collection, getDocs } from 'firebase/firestore';
import Navbar from '@/app/componentes/navbar';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface Resultado {
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

function Resultados() {
    const [resultados, setResultados] = useState<Resultado[]>([]);
    const [carreras, setCarreras] = useState<string[]>([]);
    const [carreraSeleccionada, setCarreraSeleccionada] = useState<string>('');

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

    useEffect(() => {
        const obtenerCarrerasDesdeFirebase = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'Configuracion Carreeras'));
                const carrerasData: string[] = [];

                querySnapshot.forEach((doc) => {
                    carrerasData.push(doc.data().nombreCarrera);
                });

                setCarreras(carrerasData);
            } catch (error) {
                console.error('Error al obtener carreras desde Firebase:', error);
            }
        };

        obtenerCarrerasDesdeFirebase();
    }, []);

    const exportToPdf = () => {
        const input = document.getElementById('tabla-resultados');
        if (input) {
            html2canvas(input)
                .then((canvas) => {
                    const imgData = canvas.toDataURL('image/png');
                    const pdf = new jsPDF('l', 'pt', 'a4');
                    const imgWidth = 500;
                    const imgHeight = (canvas.height * imgWidth) / canvas.width;
                    pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
                    pdf.save('resultados.pdf');
                });
        }
    };

    return (
        <div>
            <Navbar />
            <br />
            <br />
            <div className="container mx-auto p-4">
                <h2 style={{ textAlign: 'center', fontSize: '2em', fontWeight: 'bold' }}>Control Tiempos</h2>
                <div className="flex items-center justify-center mb-4">
                    <select
                        value={carreraSeleccionada}
                        onChange={(e) => setCarreraSeleccionada(e.target.value)}
                        className="px-2 py-1 border border-gray-300 rounded-md mr-2 text-black" // Añade "text-black" para asegurar que el texto sea visible
                    >
                        <option value="">Seleccionar carrera</option>
                        {carreras.map((carrera, index) => (
                            <option key={index} value={carrera}>{carrera}</option>
                        ))}
                    </select>
                    <button onClick={exportToPdf} className="px-3 py-1 bg-green-500 text-white rounded-md ml-2">Exportar a PDF</button>
                </div>
                <table id="tabla-resultados" className="table-auto w-full border-collapse border border-gray-300 shadow-lg rounded">
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
