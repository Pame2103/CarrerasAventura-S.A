'use client'
import React, { useState, useEffect } from 'react';
import Navbar from '@/app/componentes/navbar';
import { collection, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { db } from '../../../../firebase/firebase';
import { TextField, Button, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';

interface Carrera {
  id: string;
  evento: string;
  edicion: string;
  fecha: string;
  distancia: string;
  tipocarrera: string;
  estadocarrera: string;
  costo: string;
  responsable: string;
  contacto: string;
  cupo: number;
  nombre: string; // Asegúrate de que 'nombre' está definido en la interfaz Carrera
}

function groupByMonth(carreras: Carrera[]): { [key: string]: Carrera[] } {
  const grouped: { [key: string]: Carrera[] } = {};

  carreras.forEach(carrera => {
    // Ensure carrera.fecha exists and is a string
    if (typeof carrera.fecha === 'string' && carrera.fecha.includes('-')) {
      const parts = carrera.fecha.split('-');
      const month = new Date(2022, parseInt(parts[1]) - 1, 1).toLocaleString('default', { month: 'long' });
      if (!grouped[month]) {
        grouped[month] = [];
      }
      grouped[month].push(carrera);
    } else {
      console.error(`Invalid fecha format for carrera with ID ${carrera.id}: ${carrera.fecha}`);
    }
  });

  return grouped;
}

async function getCupo(carreraId: string) {
  const carreraDocRef = doc(db, 'Configuracion Carreeras', carreraId);
  const carreraDocSnap = await getDoc(carreraDocRef);
  if (carreraDocSnap.exists()) {
    return carreraDocSnap.data().limiteParticipantes;
  } else {
    console.error(`Carrera document with ID ${carreraId} not found.`);
    return 0; // Return 0 if document not found
  }
}

function Carreras() {
  const [carreras, setCarreras] = useState<Carrera[]>([]);
  const [carrerasByMonth, setCarrerasByMonth] = useState<{ [key: string]: Carrera[] }>({});
  const [mensaje, setMensaje] = useState<string>("");

  useEffect(() => {
    const carrerasRef = collection(db, 'Configuracion Carreeras');
    const unsubscribe = onSnapshot(carrerasRef, (querySnapshot) => {
      const carrerasData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }) as Carrera);
      setCarreras(carrerasData);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const groupedCarreras = groupByMonth(carreras);
    setCarrerasByMonth(groupedCarreras);
  }, [carreras]);

  const handleInscribirse = async (carreraId: string) => {
    const cupo = await getCupo(carreraId);
    const raceToUpdate = carreras.find(carrera => carrera.id === carreraId);
    if (raceToUpdate) {
      if (cupo > 0) {
        const updatedCarreras = carreras.map(carrera =>
          carrera.id === carreraId ? { ...carrera, cupo: cupo - 1 } : carrera
        );
        setCarreras(updatedCarreras);
        console.log(`Inscribiéndose en la carrera con ID ${carreraId}`);
      } else {
        setMensaje("El cupo de participantes ya ha llegado a su límite. Gracias por su interés, por favor revise otros eventos disponibles.");
      }
    }
  };

  const today = new Date(); // Obtener la fecha actual

  return (
    <>
      <Navbar />
      <div className="text-black min-h-screen" style={{ fontFamily: 'Arial', color: '#3c78f2#', backgroundColor: '#E0E6F3' }}>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded absolute top-0 right-0 mt-4 mr-4" onClick={() => window.history.back()}>
          Volver
        </button>
        <h1 style={{ textAlign: 'center', fontSize: '30px', color: 'black' }}>EVENTOS DISPONIBLES</h1>
        <br />
        <br />
        <br />
        <div className="flex flex-col items-center">
          {Object.keys(carrerasByMonth)
            .sort((a, b) => {
              const months = [
                'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
              ];
              return months.indexOf(a) - months.indexOf(b);
            })
            .map(monthName => {
              const carrerasEnMes = carrerasByMonth[monthName]?.filter(carrera => new Date(carrera.fecha) > today);
              if (carrerasEnMes && carrerasEnMes.length > 0) {
                return (
                  <div key={monthName}>
                    <h2 style={{ textAlign: 'center', textTransform: 'capitalize', fontSize: '24px', marginTop: '20px' }}>{monthName}</h2>
                    {carrerasEnMes.map(carrera => (
                      <div key={carrera.id} className="bg-white rounded-lg shadow-md p-4 mb-4 w-full max-w-3xl">
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <h3 className="text-lg font-bold">{carrera.nombre}</h3> {/* Añadido el nombre de la carrera */}
                            <p>{carrera.evento}</p>
                            <p>{carrera.edicion}</p>
                            <p>{carrera.fecha}</p>
                            <p>Cupos Disponibles: {carrera.cupo}</p>
                          </div>
                          <div>
                            <p>Distancia: {carrera.distancia}</p>
                            <p>Tipo de Carrera: {carrera.tipocarrera}</p>
                            <p>Estado de la Carrera: {carrera.estadocarrera}</p>
                          </div>
                          <div>
                            <p>Costo: {carrera.costo}</p>
                            <p>Responsable: {carrera.responsable}</p>
                            <p>Contacto: {carrera.contacto}</p>
                            <p style={{ color: carrera.cupo > 0 ? 'black' : 'red' }}>
                              {carrera.cupo > 0 ? (
                                <a href={`/Cliente/Inscripciones`}>
                                  <button
                                    style={{ backgroundColor: '#007bff', color: '#fff', border: 'none', padding: '5px 10px', cursor: 'pointer', margin: 'auto' }}
                                    onClick={() => handleInscribirse(carrera.id)}
                                  >
                                    Inscribirse
                                  </button>
                                </a>
                              ) : (
                                "Cupo lleno"
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              } else {
                return null;
              }
            })}
          {mensaje && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">¡Error!</strong>
              <span className="block sm:inline"> {mensaje}</span>
              <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
                <svg onClick={() => setMensaje("")} className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <title>Close</title>
                  <path
                    fillRule="evenodd"
                    d="M14.348 5.652a.5.5 0 010 .707l-8 8a.5.5 0 01-.707-.707l8-8a.5.5 0 01.707 0z"
                    clipRule="evenodd"
                  />
                  <path
                    fillRule="evenodd"
                    d="M5.652 5.652a.5.5 0 00-.707.707l8 8a.5.5 0 00.707-.707l-8-8z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Carreras;
