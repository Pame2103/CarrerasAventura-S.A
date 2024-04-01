'use client'
import React, { useState, useEffect } from 'react';
import { db } from '../../../../firebase/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';

interface Record {
    id: string;
    nombreAtleta: string;
    fecha: string;
    distancia: string;
    categoria: string;
    hora: number;
    minuto: number;
    segundo: number;
    nanoSegundo: number;
    posicion: string;
    sexo: string;
    nombreCarrera: string;
}

function Records() {
    const [records, setRecords] = useState<Record[]>([]);
    const [carreraSeleccionada, setCarreraSeleccionada] = useState<string>('');
    const [formData, setFormData] = useState<Partial<Record>>({
        nombreAtleta: '',
        fecha: '',
        distancia: '',
        categoria: '',
        hora: 0,
        minuto: 0,
        segundo: 0,
        nanoSegundo: 0,
        posicion: '',
        sexo: '',
        nombreCarrera: '',
    });
    const [editingRecordId, setEditingRecordId] = useState<string | null>(null);

    useEffect(() => {
        const obtenerRecordsDesdeFirebase = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'record'));
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

    const filtrarRecords = () => {
        return records.filter(record =>
            (carreraSeleccionada === '' || record.nombreCarrera === carreraSeleccionada)
        );
    };

    const handleCarreraSeleccionada = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setCarreraSeleccionada(e.target.value);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, 'record'), formData);
            setFormData({
                nombreAtleta: '',
                fecha: '',
                distancia: '',
                categoria: '',
                hora: 0,
                minuto: 0,
                segundo: 0,
                nanoSegundo: 0,
                posicion: '',
                sexo: '',
                nombreCarrera: '',
            });
        } catch (error) {
            console.error('Error al agregar el récord:', error);
        }
    };

    const handleEditRecord = (recordId: string) => {
        setEditingRecordId(recordId);

        const recordToEdit = records.find(record => record.id === recordId);

        if (recordToEdit) {
            setFormData({
                nombreAtleta: recordToEdit.nombreAtleta,
                fecha: recordToEdit.fecha,
                distancia: recordToEdit.distancia,
                categoria: recordToEdit.categoria,
                hora: recordToEdit.hora,
                minuto: recordToEdit.minuto,
                segundo: recordToEdit.segundo,
                nanoSegundo: recordToEdit.nanoSegundo,
                posicion: recordToEdit.posicion,
                sexo: recordToEdit.sexo,
                nombreCarrera: recordToEdit.nombreCarrera,
            });
        }
    };

    const handleSaveEdit = async (recordId: string) => {
        try {
            const recordRef = doc(db, 'record', recordId);
            const newData = { ...formData };
            await updateDoc(recordRef, newData);
            setEditingRecordId(null);
        } catch (error) {
            console.error('Error al editar el registro:', error);
        }
    };

    const handleDeleteRecord = async (recordId: string) => {
        try {
            await deleteDoc(doc(db, 'record', recordId));
            const updatedRecords = records.filter(record => record.id !== recordId);
            setRecords(updatedRecords);
        } catch (error) {
            console.error('Error al eliminar el récord:', error);
        }
    };

    return (
        <div>
            <div className="container mx-auto p-4">
                <form onSubmit={handleSubmit} className="mb-4">
                <h2 style={{ textAlign: 'center', fontSize: '2em', fontWeight: 'bold' }}>Administrador de records</h2>
                    <div className="flex flex-wrap -mx-2">
                        <div className="w-full sm:w-1/2 px-2 mb-4">
                            <label className="block mb-2">
                                Nombre del Atleta:
                                <input type="text" name="nombreAtleta" value={formData.nombreAtleta} onChange={handleChange} className="block w-full border border-gray-300 rounded-md px-2 py-1" />
                            </label>
                        </div>
                        <div className="w-full sm:w-1/2 px-2 mb-4">
                            <label className="block mb-2">
                                Fecha:
                                <input type="date" name="fecha" value={formData.fecha} onChange={handleChange} className="block w-full border border-gray-300 rounded-md px-2 py-1" />
                            </label>
                        </div>
                        <div className="w-full sm:w-1/2 px-2 mb-4">
                            <label className="block mb-2">
                                Distancia:
                                <input type="text" name="distancia" value={formData.distancia} onChange={handleChange} className="block w-full border border-gray-300 rounded-md px-2 py-1" />
                            </label>
                        </div>
                        <div className="w-full sm:w-1/2 px-2 mb-4">
                            <label htmlFor="categoria" className="block font-semibold">Categoría:</label>
                            <select
                                id="categoria"
                                name="categoria"
                                className="border p-2 w-full"
                                value={formData.categoria}
                                onChange={handleChange}
                            >
                                <option value="Categoria">Categoria</option>
                                <option value="Femenino, Junior">Femenina, Junior</option>
                                <option value="Femenino, Mayor">Femenina, Mayor</option>
                                <option value="Femenino, Veterano">Femenina, Veterano A</option>
                                <option value="Femenino, Veterano B">Femenina, Veterano B</option>
                                <option value="Femenino, Veterano C">Femenina, Veterano C</option>
                                <option value="Masculino, Junior">Masculino, Junior</option>
                                <option value="Masculino, Mayor">Masculino, Mayor</option>
                                <option value="Masculino, Veterano">Masculino, Veterano A</option>
                                <option value="Masculino, Veterano A">Masculino, Veterano A</option>
                                <option value="Masculino, Veterano B">Masculino, Veterano B</option>
                                <option value="Masculino, Veterano C">Masculino, Veterano C</option>
                            </select>
                        </div>
                        <div className="w-full sm:w-1/2 px-2 mb-4">
                            <label className="block mb-2">
                                Tiempo:
                                <div className="flex">
                                    <input type="number" name="hora" value={formData.hora} onChange={handleChange} placeholder="Horas" className="border border-gray-300 rounded-md px-2 py-1 mr-2" style={{ width: '80px' }} />
                                    <span>:</span>
                                    <input type="number" name="minuto" value={formData.minuto} onChange={handleChange} placeholder="Minutos" className="border border-gray-300 rounded-md px-2 py-1 mx-2" style={{ width: '80px' }} />
                                    <span>:</span>
                                    <input type="number" name="segundo" value={formData.segundo} onChange={handleChange} placeholder="Segundos" className="border border-gray-300 rounded-md px-2 py-1 mx-2" style={{ width: '80px' }} />
                                    <span>.</span>
                                    <input type="number" name="nanoSegundo" value={formData.nanoSegundo} onChange={handleChange} placeholder="Nanosegundos" className="border border-gray-300 rounded-md px-2 py-1 ml-2" style={{ width: '120px' }} />
                                </div>
                            </label>
                        </div>
                        <div className="w-full sm:w-1/2 px-2 mb-4">
                            <label className="block mb-2">
                                Posición:
                                <input type="text" name="posicion" value={formData.posicion} onChange={handleChange} className="block w-full border border-gray-300 rounded-md px-2 py-1" />
                            </label>
                        </div>
                        <div className="w-full sm:w-1/2 px-2 mb-4">
                            <label className="block mb-2">
                                Sexo:
                                <select name="sexo" value={formData.sexo} onChange={handleChange} className="border p-2 w-full">
                                    <option value="">Seleccionar</option>
                                    <option value="Femenino">Femenino</option>
                                    <option value="Masculino">Masculino</option>
                                </select>
                            </label>
                        </div>
                        <div className="w-full sm:w-1/2 px-2 mb-4">
                            <label className="block mb-2">
                                Nombre de la Carrera:
                                <input type="text" name="nombreCarrera" value={formData.nombreCarrera} onChange={handleChange} className="block w-full border border-gray-300 rounded-md px-2 py-1" />
                            </label>
                        </div>
                    </div>
                    <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Agregar Registro</button>
                </form>

                <h2 style={{ textAlign: 'center', fontSize: '2em', fontWeight: 'bold' }}>Récords de corredores</h2>
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
                            <th className="border border-gray-500 p-2">Acciones</th>
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
                                <td className="border border-gray-500 p-2">{record.hora}:{record.minuto}:{record.segundo}.{record.nanoSegundo}</td>
                                <td className="border border-gray-500 p-2">{record.posicion}</td>
                                <td className="border border-gray-500 p-2">{record.sexo}</td>
                                <td className="border border-gray-500 p-2">
                                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mr-2" onClick={() => handleEditRecord(record.id)}>Editar</button>

                                    <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded" onClick={() => handleDeleteRecord(record.id)}>Eliminar</button>
                                </td>
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
