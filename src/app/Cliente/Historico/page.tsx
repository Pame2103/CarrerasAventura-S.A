'use client';
import React, { useState, useEffect } from 'react';
import { db } from '../../../../firebase/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import Navbar from '@/app/componentes/navbar';

export default function Historico() {
    interface Carrera {
        id: string; 
        nombre: string;
        cedula: string;
        posicion: number;
        tiempo: string;
        categoria: string;
        distancia: string;
        costo: string;
        responsable: string;
        contacto: string;
        nombrecarrera: string;
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
        const historicosCollection = collection(db, 'Historicos');
      
        const unsubscribe = onSnapshot(historicosCollection, (snapshot) => {
            const historicosData: Carrera[] = snapshot.docs.map((doc) => {
                return { id: doc.id, ...doc.data() } as Carrera;
            });
            setCarreras(historicosData);
        });
        return () => unsubscribe();
    }, []);
      
    const handleSearch = () => {
        if (busqueda.trim() !== '') {
            const resultados = carreras.filter((carrera: Carrera) => {
                const { nombre, cedula, categoria, nombrecarrera } = carrera;
                return (
                    nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                    cedula.includes(busqueda) ||
                    categoria.toLowerCase().includes(busqueda.toLowerCase()) ||
                    nombrecarrera.toLowerCase().includes(busqueda.toLowerCase()) // Incluir búsqueda por nombre de carrera
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
                <td className="p-2 border text-center">{carrera.nombre}</td>
                <td className="p-2 border text-center">{carrera.cedula}</td>
                <td className="p-2 border text-center">{carrera.posicion}</td>
                <td className="p-2 border text-center">{carrera.tiempo}</td>
                <td className="p-2 border text-center">{carrera.categoria}</td>
                <td className="p-2 border text-center">{carrera.nombrecarrera}</td>
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
                <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '2rem', color: '#333', textAlign: 'center' }}>Histórico de Corredores</h1> {/* Ajuste de la tilde */}
               
                <div className="mb-4 flex justify-center items-center"> 
                    <input 
                        type="text" 
                        placeholder="Buscar por nombre, cédula o carrera" 
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
                            <th >Cédula</th>
                            <th >Posición</th>
                            <th >Tiempo</th>
                            <th >Categoría</th>
                            <th >Nombre Carrera</th>
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
