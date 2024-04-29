'use client'
import React, { useState, useEffect } from 'react';
import { db } from '../../../../firebase/firebase';
import { collection, getDocs } from 'firebase/firestore';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Link from 'next/link';
import { FaRunning, FaInfoCircle, FaDumbbell, FaEnvelope, FaTrophy, FaSignInAlt } from "react-icons/fa";
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
                console.log('Fetching carreras from Firebase...');
                const querySnapshot = await getDocs(collection(db, 'Configuracion Carreeras'));
                console.log('Number of carreras documents:', querySnapshot.size);

                if (querySnapshot.size === 0) {
                    console.log('No carreras documents found.');
                    return;
                }

                const carrerasData: string[] = [];

                querySnapshot.forEach((doc) => {
                    console.log('Carrera document data:', doc.data());
                    carrerasData.push(doc.data().nombre);
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

    const parseTiempo = (tiempo: string) => {
        const [minutos, segundos] = tiempo.split(':').map(Number);
        return minutos * 60 + segundos;
    };

    const resultadosFiltrados = carreraSeleccionada 
        ? resultados.filter(resultado => resultado.carrera === carreraSeleccionada) 
        : resultados;

    const resultadosFiltradosOrdenados = [...resultadosFiltrados].sort((a, b) => {
        const tiempoA = parseTiempo(a.tiempo);
        const tiempoB = parseTiempo(b.tiempo);
        return tiempoA - tiempoB;
    });

    return (
        <div>
        <nav className="bg-white border-b border-gray-200 fixed w-full z-23 top-0 left-0 h-23">
        <div className="max-w-screen-2xl mx-auto px-6 sm:px-7 lg:px-9">
          <div className="flex items-center justify-between h-full">
            <div className="flex items-center">
              <Link href="/">
                <img src="/LogoC.png" className="h-20 w-auto" alt="Carrera Aventura" />
              </Link>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  <Link href="/Admin/administradorCarreras">
                    <span className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center">
                      <FaRunning className="mr-1" /> Administrar Carreras
                    </span>
                  </Link>
                  <Link href="/Admin/administrarTiempos">
                    <span className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center">
                      <FaInfoCircle className="mr-1" /> Administrar Tiempos
                    </span>
                  </Link>
                  <Link href="/Admin/carreras">
                    <span className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center">
                      <FaDumbbell className="mr-1" /> Carreras
                    </span>
                  </Link>
                  <Link href="/Admin/confirmaciones">
                    <span className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center">
                      <FaTrophy className="mr-1" /> Confirmación de Pagos
                    </span>
                  </Link>
                  <Link href="/Admin/ControlTiempos">
                    <span className="text-gray-600 hover:text-gray-900 px-0 py-2 rounded-md text-sm font-medium flex items-center">
                      <FaTrophy className="mr-1" /> Control Tiempos
                    </span>
                  </Link>
                  <Link href="/Admin/listaParticipantes">
                    <span className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center">
                      <FaTrophy className="mr-1" /> Lista de Participantes
                    </span>
                  </Link>
                  <Link href="/Admin/record">
                    <span className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center">
                      <FaEnvelope className="mr-1" /> Records
                    </span>
                </Link>
                </div>
              </div>
            </div>
            <div className="flex">
              <Link href="/Login" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium flex items-center">
                <FaSignInAlt className="mr-2" /> Cerrar sesión
              </Link>
            </div>
          </div>
          <div className="ml-10 text-gray-600 text-sm font-medium">¡Corre hacia tus metas con Carrera Aventura! ¡Cruzando la meta juntos!</div>
        </div>
      </nav>
          
            <br />
            <br />
            <div className="container mx-auto p-4">
                <h2 style={{ textAlign: 'center', fontSize: '2em', fontWeight: 'bold' }}>Control Tiempos</h2>
                <div className="flex items-center justify-center mb-4">
                    <select
                        value={carreraSeleccionada}
                        onChange={(e) => setCarreraSeleccionada(e.target.value)}
                        className="px-2 py-1 border border-gray-300 rounded-md mr-2 text-black"
                        style={{ textAlign: 'center', fontWeight: 'bold', color: '#000' }}
                    >
                        <option value="">Seleccionar carrera</option>
                        {carreras.map((nombre, index) => (
                            <option  style={{ textAlign: 'center', fontWeight: 'bold', color: '#000' }}  key={index} value={nombre}>
                                {nombre}
                            </option>
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
                        {resultadosFiltradosOrdenados.map((resultado, index) => (
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
