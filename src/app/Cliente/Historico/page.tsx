'use client'
import React, { useState, useEffect } from 'react';
import { db } from '../../../../firebase/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import Navbar from '@/app/componentes/navbar';

export default function Historico() {
    interface Carrera {
        id: string;
        nombreAtleta: string;
        posicion: number;
        tiempo: string;
        categoria: string;
        carrera: string;
        fecha: string; // Ajusta el tipo según el formato de fecha
    }

    const [busqueda, setBusqueda] = useState('');
    const [carreras, setCarreras] = useState<Carrera[]>([]);
    const [resultados, setResultados] = useState<Carrera[]>([]);
    const [hayResultados, setHayResultados] = useState(true);

    const handleBusquedaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBusqueda(e.target.value);
        if (!e.target.value) {
            setResultados([]);
            setHayResultados(true);
        }
    };

    useEffect(() => {
        const historicosCollection = collection(db, 'administradortiempos');
      
        const unsubscribe = onSnapshot(historicosCollection, (snapshot) => {
            const historicosData: Carrera[] = snapshot.docs.map((doc) => {
                return { id: doc.id, ...doc.data() } as Carrera;
            });
            setCarreras(historicosData);
        });
      
        // Limpiar el listener cuando el componente se desmonta
        return () => unsubscribe();
    }, []);
      
    const handleSearch = () => {
        if (busqueda.trim() !== '') {
            const resultados = carreras.filter((carreraItem: Carrera) => {
                const { nombreAtleta, categoria, carrera, fecha } = carreraItem;
                const busquedaLowerCase = busqueda.toLowerCase();
                return (
                    nombreAtleta.toLowerCase().includes(busquedaLowerCase) ||
                    categoria.toLowerCase().includes(busquedaLowerCase) ||
                    carrera.toLowerCase().includes(busquedaLowerCase) ||
                    fecha.includes(busquedaLowerCase) 
                );
            });
    
            setResultados(resultados);
            setHayResultados(resultados.length > 0);
        } else {
            setResultados([]);
            setHayResultados(true);
        }
    };
    
    const renderFilas = () => {
        let filas;
        if (resultados.length > 0) {
            filas = [...resultados].sort((a, b) => a.posicion - b.posicion);
        } else {
            filas = [...carreras];
        }

        return filas.map(carrera => (
            <tr key={carrera.id}>
                <td className="p-2 border text-center">{carrera.nombreAtleta}</td>
                <td className="p-2 border text-center">{carrera.posicion}</td>
                <td className="p-2 border text-center">{carrera.tiempo}</td>
                <td className="p-2 border text-center">{carrera.categoria}</td>
                <td className="p-2 border text-center">{carrera.fecha}</td>
                <td className="p-2 border text-center">{carrera.carrera}</td>
            </tr>
        ));
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
            <div className="p-4">
                <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '2rem', color: '#333', textAlign: 'center' }}>Histórico de Corredores</h1>
               
                <div className="mb-4 flex justify-center items-center">
                    <input 
                        type="text" 
                        placeholder="Buscar por nombre,carrera " 
                        value={busqueda} 
                        onChange={handleBusquedaChange} 
                        className="p-2 border rounded mr-2"
                    />
                    <button 
                        onClick={handleSearch} 
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Buscar
                    </button>
                </div>
                {!hayResultados && (
                    <div className="text-red-500 font-bold mb-4">
                        No se encontraron resultados.
                    </div>
                )}
                <table style={{ width: '100%', border: '1px solid #ccc', borderCollapse: 'collapse', marginTop: '20px' }}>
                    <thead style={{ backgroundColor: '#eee' }}>
                        <tr>
                            <th >Nombre</th>
                            <th >Posición</th>
                            <th >Tiempo</th>
                            <th >Categoría</th>
                            <th >Fecha</th>
                            <th >Carrera</th>
                        </tr>
                    </thead>
                    <tbody>
                        {renderFilas()}
                    </tbody>
                </table>
            </div>   
        </div>
    );
}

// Estilos CSS
const styles = `
    .p-2 {
        padding: 0.6rem;
    }

    .border {
        border: 2px  blue;
    }

    .text-center {
        text-align: center;
    }

    .bg-blue-700 {
        background-color: #3b82f6;
    }

    .hover\:bg-blue-700:hover {
        background-color: blue;
    }

    .text-white {
        color: #fff;
    }

    .font-bold {
        font-weight: bold;
    }

    .py-2 {
        padding-top: 0.5rem;
        padding-bottom: 0.5rem;
    }

    .px-4 {
        padding-left: 1rem;
        padding-right: 1rem;
    }

    .rounded {
        border-radius: 0.25rem;
    }

    .mb-4 {
        margin-bottom: 1rem;
    }

    .flex {
        display: flex;
    }

    .justify-center {
        justify-content: center;
    }

    .items-center {
        align-items: center;
    }

    .text-red-500 {
        color: #dc2626;
    }

    .titulo {
        font-size: 3rem;
        font-weight: bold;
        margin-bottom: 2rem;
        color: #333;
        text-align: center;
    }
    
`;


const styleElement = document.createElement('style');
styleElement.textContent = styles;
document.body.appendChild(styleElement);
