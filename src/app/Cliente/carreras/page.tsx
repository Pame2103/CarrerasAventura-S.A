'use client'
import React, { useState, useEffect } from 'react';
import Navbar from '@/app/componentes/navbar';
import { collection, onSnapshot, doc, getDoc } from 'firebase/firestore';
import { db } from '../../../../firebase/firebase';
import { TextField, Button } from '@mui/material';

interface Carrera {
  id: string;
  nombre: string;
  fecha: string;
  costo: string;
  distancia: string;
  edicion: string;
 limiteParticipante:string;
  responsable: string;
  contacto: string;
  lugar: string;
  hora: string;
  cupo: number; // Se cambia a number
}

function groupByMonth(carreras: Carrera[]): { [key: string]: Carrera[] } {
  const grouped: { [key: string]: Carrera[] } = {};

  carreras.forEach(carrera => {
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

async function getCupo(carreraId: string): Promise<number> { // Se especifica que la función devuelve un número
  const carreraDocRef = doc(db, 'Configuracion Carreeras', carreraId);
  const carreraDocSnap = await getDoc(carreraDocRef);
  if (carreraDocSnap.exists()) {
    return carreraDocSnap.data().limiteParticipantes;
  } else {
    console.error(`Carrera document with ID ${carreraId} not found.`);
    return 0;
  }
}

function Carreras() {
  const [carreras, setCarreras] = useState<Carrera[]>([]);
  const [carrerasByMonth, setCarrerasByMonth] = useState<{ [key: string]: Carrera[] }>({});
  const [mensaje, setMensaje] = useState<string>("");

  useEffect(() => {
    const carrerasRef = collection(db, 'Configuracion Carreeras');
    const unsubscribe = onSnapshot(carrerasRef, (querySnapshot) => {
      const carrerasData: Carrera[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Carrera[];
      setCarreras(carrerasData);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const groupedCarreras = groupByMonth(carreras);
    setCarrerasByMonth(groupedCarreras);
  }, [carreras]);

  const handleInscribirse = async (carreraId: string, eventoNombre: string) => {
    const cupo = await getCupo(carreraId);
    console.log("Cupo actual:", cupo); // Agregar este console.log
    const raceToUpdateIndex = carreras.findIndex(carrera => carrera.id === carreraId);
    console.log("Index de la carrera:", raceToUpdateIndex); // Agregar este console.log
    
    if (raceToUpdateIndex !== -1) {
      if (cupo > 0) {
        const updatedCarreras = [...carreras];
        updatedCarreras[raceToUpdateIndex] = {
          ...updatedCarreras[raceToUpdateIndex],
          cupo: cupo - 1
        };
        setCarreras(updatedCarreras); // Actualizar el estado aquí

        localStorage.setItem('carreraSeleccionada', JSON.stringify(updatedCarreras[raceToUpdateIndex]));
        localStorage.setItem('nombreEventoSeleccionado', eventoNombre);
        window.location.href = '/Cliente/Inscripciones';
      } else {
        setMensaje("El cupo de participantes ya ha llegado a su límite. Gracias por su interés, por favor revise otros eventos disponibles.");
      }
    } else {
      console.error(`No se encontró la carrera con ID ${carreraId} en el estado.`);
    }
  };

  const today = new Date(); 

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
                            <h3 className="text-lg font-bold">{carrera.nombre}</h3> {/* Se cambia a carrera.nombre */}
                            <p>{carrera.edicion}</p>
                            <p>{carrera.fecha}</p>
                            <p>Cupos Disponibles: {carrera.cupo}</p>
                          </div>
                          <div>
                            <p>Distancia: {carrera.distancia}</p>
                        
                          </div>
                          <div className="flex flex-col items-center justify-center">
                            <button
                              className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${carrera.cupo <= 0 ? 'bg-gray-300 cursor-not-allowed' : ''}`}
                              onClick={() => {
                                console.log("Clic en el botón de inscripción:", carrera.id, carrera.nombre);
                                carrera.cupo > 0 && handleInscribirse(carrera.id, carrera.nombre)
                              }} 
                              disabled={carrera.cupo <= 0}
                            >
                              {carrera.cupo > 0 ? 'Inscribirse' : 'Cupo lleno'}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              }
              return null;
            })}
          {mensaje && <p>{mensaje}</p>}
        </div>
      </div>
    </>
  );
}

export default Carreras;
