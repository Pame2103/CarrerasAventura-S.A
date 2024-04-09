'use client'
import React, { useState, useEffect } from 'react';
import Navbar from '@/app/componentes/navbar';
import { collection, onSnapshot, doc, runTransaction } from 'firebase/firestore';
import { db } from '../../../../firebase/firebase';
import { Button, Grid, Typography, Paper, Modal, Box } from '@mui/material';

interface Carrera {
  id: string;
  evento: string;
  edicion: string;
  fecha: string;
  distancia: string;
  costo: string;
  responsable: string;
  contacto: string;
  limiteParticipante: string;
  nombreCarrera: string;
  cupoDisponible: number;
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

function Carreras() {
  const [carreras, setCarreras] = useState<Carrera[]>([]);
  const [carrerasByMonth, setCarrerasByMonth] = useState<{ [key: string]: Carrera[] }>({});
  const [mensaje, setMensaje] = useState<string>("");
  const [modalOpen, setModalOpen] = useState<boolean>(false);

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
    const carreraRef = doc(db, 'Configuracion Carreeras', carreraId);
    await runTransaction(db, async (transaction) => {
      const carreraDoc = await transaction.get(carreraRef);
      if (carreraDoc.exists()) {
        const cupoDisponible = carreraDoc.data()?.cupoDisponible;
        if (cupoDisponible !== undefined && cupoDisponible > 0) {
          transaction.update(carreraRef, { cupoDisponible: cupoDisponible - 1 });
          console.log(`Inscripciones ${carreraId}`);
          window.location.href = '/Cliente/Inscripciones';
        } else {
          setMensaje("¡No hay cupo disponible para esta carrera!");
          setModalOpen(true);
        }
      } else {
        console.error(`Carrera document with ID ${carreraId} not found.`);
      }
    });
  };

  const today = new Date();

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
                            <Typography variant="body1">Cupo Disponible: {carrera.cupoDisponible}</Typography>
                          </Grid>
                          <Grid item xs={12} sm={3}>
                            <Typography variant="body1">Distancia: {carrera.distancia}</Typography>
                          </Grid>
                          <Grid item xs={12} sm={3}>
                            <Typography variant="body1">Costo: {carrera.costo}</Typography>
                            <Typography variant="body1">Responsable: {carrera.responsable}</Typography>
                            <Typography variant="body1">Contacto: {carrera.contacto}</Typography>
                            <Button style={{ backgroundColor: '#007bff', color: '#fff', border: 'none', padding: '5px 10px', cursor: 'pointer', margin: 'auto' }} onClick={() => handleInscribirse(carrera.id)}>Inscribirse</Button>
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

        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
          }}>
            <Typography id="modal-modal-title" variant="h6" component="h2" color="red">Error</Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }} color="red">{mensaje}</Typography>
          </Box>
        </Modal>
      </div>
    </>
  );
}

export default Carreras;
