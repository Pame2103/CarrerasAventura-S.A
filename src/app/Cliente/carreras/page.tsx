'use client'
import React, { useState, useEffect } from 'react';
import Navbar from '@/app/componentes/navbar';
import { collection, onSnapshot, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../../firebase/firebase';
import { Button, Grid, Typography, Paper } from '@mui/material';

interface Carrera {
  id: string;
  evento: string;
  edicion: string;
  fecha: string;
  distancia: string;
  costo: string;
  responsable: string;
  contacto: string;
  cupoDisponible: number;
  limiteParticipante: string;
  nombreCarrera: string;
}

async function getCupo(carreraId: string): Promise<number> {
  const carreraDocRef = doc(db, 'Configuracion Carreeras', carreraId);
  const carreraDocSnap = await getDoc(carreraDocRef);
  if (carreraDocSnap.exists()) {
    return carreraDocSnap.data().limiteParticipante;
  } else {
    console.error(`Carrera document with ID ${carreraId} not found.`);
    return 0; // Return 0 if document not found
  }
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
    if (raceToUpdate && raceToUpdate.cupoDisponible > 0) {
      const updatedCarreras = carreras.map(carrera =>
        carrera.id === carreraId ? { ...carrera, cupoDisponible: carrera.cupoDisponible - 1 } : carrera
      );
      setCarreras(updatedCarreras);
      const carreraDocRef = doc(db, 'Configuracion Carreeras', carreraId);
      await updateDoc(carreraDocRef, { cupoDisponible: cupo - 1 });
      console.log(`Inscribiéndose en la carrera con ID ${carreraId}`);
    } else {
      setMensaje("El cupo de participantes ya ha llegado a su límite. Gracias por su interés, por favor revise otros eventos disponibles.");
    }
  };

  const today = new Date(); // Obtener la fecha actual

  return (
    <>
      <Navbar />
      <div style={{ fontFamily: 'Arial', color: '#3c78f2#', backgroundColor: '#E0E6F3', padding: '20px' }}>
        <button style={{ backgroundColor: '#007bff', color: 'white', fontWeight: 'bold', padding: '8px 16px', borderRadius: '4px', position: 'absolute', top: '16px', right: '16px' }} onClick={() => window.history.back()}>
          Volver
        </button>
        <Typography variant="h1" align="center" sx={{ fontSize: '30px', color: 'black', marginBottom: '20px' }}>EVENTOS DISPONIBLES</Typography>

        <Grid container spacing={2} justifyContent="center">
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
                  <Grid item xs={12} key={monthName}>
                    <Paper sx={{ backgroundColor: '#3c78f2', color: 'white', padding: '10px', marginBottom: '20px' }}>
                      <Typography variant="h2" align="center" sx={{ textTransform: 'capitalize' }}>{monthName}</Typography>
                    </Paper>
                    {carrerasEnMes.map(carrera => (
                      <Paper key={carrera.id} sx={{ padding: '20px', marginBottom: '20px' }}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="h3" gutterBottom>{carrera.nombreCarrera}</Typography>
                            <Typography variant="body1">{carrera.evento}</Typography>
                            <Typography variant="body1">{carrera.edicion}</Typography>
                            <Typography variant="body1">{carrera.fecha}</Typography>
                            <Typography variant="body1">Límite de Participantes: {carrera.limiteParticipante}</Typography>
                            <Typography variant="body1">Cupos Disponibles: {carrera.cupoDisponible}</Typography>
                          </Grid>
                          <Grid item xs={12} sm={3}>
                            <Typography variant="body1">Distancia: {carrera.distancia}</Typography>
                          </Grid>
                          <Grid item xs={12} sm={3}>
                            <Typography variant="body1">Costo: {carrera.costo}</Typography>
                            <Typography variant="body1">Responsable: {carrera.responsable}</Typography>
                            <Typography variant="body1">Contacto: {carrera.contacto}</Typography>
                            <Typography variant="body1" sx={{ color: carrera.cupoDisponible > 0 ? 'black' : 'red' }}>
                              {carrera.cupoDisponible > 0 ? (
                                <Button style={{ backgroundColor: '#007bff', color: '#fff', border: 'none', padding: '5px 10px', cursor: 'pointer', margin: 'auto' }} onClick={() => handleInscribirse(carrera.id)}>Inscribirse</Button>
                                  ) : (
                                    "Cupo lleno"
                                  )}
                                </Typography>
                              </Grid>
                            </Grid>
                          </Paper>
                        ))}
                      </Grid>
                    );
                  } else {
                    return null;
                  }
                })}
            </Grid>
    
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
        </>
      );
    }
    
    export default Carreras;
