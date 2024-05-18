'use client'
import React, { useState, useEffect } from 'react';
import Navbar from '@/app/componentes/navbar';
import { collection, onSnapshot, doc, runTransaction } from 'firebase/firestore';
import { db } from '../../../../firebase/firebase';
import { Button, Grid, Typography, Paper, Modal, Box } from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import RoomIcon from '@mui/icons-material/Room';

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
  lugar: string;
}

const carouselImages = [
 
  "/Carreras Aventura (1).gif",
  
];

function Carreras() {
  const [carreras, setCarreras] = useState<Carrera[]>([]);
  const [carrerasByMonth, setCarrerasByMonth] = useState<{ [key: string]: Carrera[] }>({});
  const [mensaje, setMensaje] = useState<string>("");
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const carrerasRef = collection(db, 'Configuracion Carreeras');
    const unsubscribe = onSnapshot(carrerasRef, (querySnapshot) => {
      const carrerasData = querySnapshot.docs.map((doc) => {
        const carreraData = doc.data();
        return {
          id: doc.id,
          nombreCarrera: carreraData.nombre,
          ...carreraData
        } as Carrera;
      });
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
      <br />
    
     
      <div style={{ fontFamily: 'Arial', color: '#3c78f2#', backgroundColor: '#E0E6F3', padding: '20px' }}>
      <br />
        <br />
     
        <br />
        <h2 style={{ textAlign: 'center', fontSize: '2em', fontWeight: 'bold', backgroundColor: '#3B79D8', color: 'white' }}>EVENTOS DISPONIBLES</h2>
        <br />
    
        <Grid container spacing={-1} justifyContent="center">
          {carouselImages.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Descripción de la imagen ${index + 10}`}
              className="shadow-lg transition-transform hover:scale-410 carousel-image"
              style={{ width: '20000px', height: '300px', borderRadius: '0px', marginRight: '0px' }}
            />
          ))}
        </Grid>
        <br />

       
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
                <Grid item xs={10} key={monthName} style={{ width: '100%', textAlign: 'center' }}>
                  <Paper sx={{ backgroundColor: '#3c78f2', color: 'white', padding: '10px', marginBottom: '20px' }}>
                    <Typography variant="h2" align="center" sx={{ textTransform: 'capitalize' }}>{monthName}</Typography>
                  </Paper>
                  {carrerasEnMes.map(carrera => (
                    <Paper key={carrera.id} sx={{ padding: '20px', marginBottom: '20px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)' }}>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <Typography variant="h3" align="center" gutterBottom>{carrera.nombreCarrera}</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                            <EventAvailableIcon sx={{ marginRight: '10px' }} />
                            <Typography variant="body1" sx={{ marginRight: '10px' }}>Edición:</Typography>
                            <Typography variant="body1">{carrera.edicion}</Typography>
                          </Box>

                          <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                            <EventIcon sx={{ marginRight: '10px' }} />
                            <Typography variant="body1" sx={{ marginRight: '10px' }}>Fecha:</Typography>
                            <Typography variant="body1">{carrera.fecha}</Typography>
                          </Box>

                          <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                            <DirectionsRunIcon sx={{ marginRight: '10px' }} />
                            <Typography variant="body1">Límite de Participantes: {carrera.limiteParticipante}</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <DirectionsRunIcon sx={{ marginRight: '10px' }} />
                            <Typography variant="body1">Cupo Disponible: {carrera.cupoDisponible}</Typography>
                          </Box>
                          <br />
                          <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                            <RoomIcon sx={{ marginRight: '10px' }} />
                            <Typography variant="body1">Lugar: {carrera.lugar}</Typography>
                          </Box>
                          <br />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                            <DirectionsRunIcon sx={{ marginRight: '10px' }} />
                            <Typography variant="body1">Distancia: {carrera.distancia}</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                            <PersonIcon sx={{ marginRight: '10px' }} />
                            <Typography variant="body1">Costo: {carrera.costo}</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                            <PersonIcon sx={{ marginRight: '10px' }} />
                            <Typography variant="body1">Responsable: {carrera.responsable}</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <PhoneIcon sx={{ marginRight: '10px' }} />
                            <Typography variant="body1">Contacto: {carrera.contacto}</Typography>
                          </Box>
                          <Button
                            style={{ backgroundColor: '#007bff', color: '#fff', border: 'none', padding: '5px 10px', cursor: 'pointer', marginTop: '10px' }}
                            onClick={() => handleInscribirse(carrera.id)}
                            startIcon={<EventAvailableIcon />}
                          >
                            Inscribirse
                          </Button>
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
      </div>

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
    </>
  );
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

export default Carreras;
