'use client'
import React, { useState, useEffect } from 'react';
import { db } from '../../../../firebase/firebase';
import { collection, getDocs } from 'firebase/firestore';
import Navbar from '@/app/componentes/navbar';

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

function Resultados() {
    const [resultados, setResultados] = useState<Resultado[]>([]);
    const [filtro, setFiltro] = useState<string>('');

    useEffect(() => {
        const obtenerResultadosDesdeFirebase = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'administradortiempos'));
                const resultadosData: Resultado[] = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Resultado);
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

    const resultadosFiltrados: Resultado[] = filtrarResultados();

    // Función para agrupar los resultados por carrera
    const agruparResultadosPorCarrera = () => {
        const resultadosAgrupados: { [key: string]: Resultado[] } = {};
        resultadosFiltrados.forEach(resultado => {
            const carrera = resultado.carrera;
            if (!resultadosAgrupados[carrera]) {
                resultadosAgrupados[carrera] = [];
            }
            resultadosAgrupados[carrera].push(resultado);
        });
        return resultadosAgrupados;
    };

    // Función para agrupar los resultados por categoría dentro de cada carrera
    const agruparResultadosPorCategoriaPorCarrera = (resultadosCarrera: Resultado[]) => {
        const resultadosAgrupados: { [key: string]: Resultado[] } = {};
        resultadosCarrera.forEach(resultado => {
            const categoria = resultado.categoria;
            if (!resultadosAgrupados[categoria]) {
                resultadosAgrupados[categoria] = [];
            }
            resultadosAgrupados[categoria].push(resultado);
        });
        return resultadosAgrupados;
    };

    // Renderizar todas las tablas juntas
    const renderizarTodasLasTablas = () => {
        const tablasPorCarrera = renderizarTablasPorCarrera();
        return tablasPorCarrera;
    };

    // Renderizar una tabla por cada carrera
    const renderizarTablasPorCarrera = () => {
        const resultadosAgrupadosPorCarrera = agruparResultadosPorCarrera();
        return Object.entries(resultadosAgrupadosPorCarrera).map(([carrera, resultadosCarrera]) => (
            <div key={`carrera-${carrera}`}>
                <h3 style={tituloCarreraStyle}>{carrera}</h3>
                {renderizarTablasPorCategoria(agruparResultadosPorCategoriaPorCarrera(resultadosCarrera))}
            </div>
        ));
    };

    // Renderizar una tabla por cada categoría dentro de una carrera
    const renderizarTablasPorCategoria = (resultadosAgrupadosPorCategoria: { [key: string]: Resultado[] }) => {
        return Object.entries(resultadosAgrupadosPorCategoria).map(([categoria, resultados]) => (
            <div key={`categoria-${categoria}`}>
                <h4 style={tituloCategoriaStyle}>{categoria}</h4>
                <table style={tablaResultadosStyle}>
                    <thead>
                        <tr>
                            <th style={thStyle}>Nombre del Atleta</th>
                            <th style={thStyle}>Fecha</th>
                            <th style={thStyle}>Distancia</th>
                            <th style={thStyle}>Categoría</th>
                            <th style={thStyle}>Tiempo</th>
                            <th style={thStyle}>Posición</th>
                            <th style={thStyle}>Sexo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {resultados.map((resultado, index) => (
                            <tr key={`categoria-${categoria}-resultado-${index}`}>
                                <td style={tdStyle}>{resultado.nombreAtleta}</td>
                                <td style={tdStyle}>{resultado.fecha}</td>
                                <td style={tdStyle}>{resultado.distancia}</td>
                                <td style={tdStyle}>{resultado.categoria}</td>
                                <td style={tdStyle}>{resultado.tiempo}</td>
                                <td style={tdStyle}>{resultado.posicion}</td>
                                <td style={tdStyle}>{resultado.sexo}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        ));
    };

    // Estilos CSS
    const tablaResultadosStyle: React.CSSProperties = {
        width: '100%',
        borderCollapse: 'collapse',
        marginBottom: '20px',
        border: '1px solid #ddd',
    };

    const thStyle: React.CSSProperties = {
        border: '1px solid #ddd',
        padding: '8px',
        textAlign: 'left',
        fontWeight: 'bold', // Añadido negrita
    };

    const tdStyle: React.CSSProperties = {
        border: '1px solid #ddd',
        padding: '8px',
    };

    const tituloCategoriaStyle: React.CSSProperties = {
        backgroundColor: '#3B79D8',
        color: 'white',
        padding: '10px',
        marginBottom: '10px',
        textAlign: 'center', // Añadido centrado
    };

    const tituloCarreraStyle: React.CSSProperties = {
        backgroundColor: '#3B79D8',
        color: 'white',
        padding: '10px',
        marginBottom: '10px',
        textAlign: 'center',
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
            <div className="container mx-auto p-4">

                <h2 style={{ textAlign: 'center', fontSize: '2em', fontWeight: 'bold', backgroundColor: '#3B79D8', color: 'white' }}>Resultados de las carreras</h2>
                <br />

                <div className="flex items-center justify-center mb-4">
                    <input
                        type="text"
                        placeholder="Por nombre atleta o por carrera"
                        value={filtro}
                        onChange={(e) => setFiltro(e.target.value)}
                        className="px-2 py-1 border border-gray-300 rounded-md mr-2"
                    />
                    <button onClick={filtrarResultados} className="px-3 py-1 bg-blue-500 text-white rounded-md">Buscar</button>
                </div>

                {renderizarTodasLasTablas()}
            </div>
        </div>
    );
}

export default Resultados;
