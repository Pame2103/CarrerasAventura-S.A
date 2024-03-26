'use client';
import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../../firebase/firebase';


interface MenuItemProps {
  link: string;
  text: string;
  description: string;
}

interface Carrera {
  id: string;
  nombre: string;
  edicion: string;
  fecha: string;
  distancia: string;
  costo: string;
  responsable: string;
  contacto: string;
  cupo: number;
}

// Definición de MenuItem (suposición)
const MenuItem: React.FC<MenuItemProps> = ({ link, text, description }) => (
  <a href={link} className="text-white">
    <div>
      <span>{text}</span>
      <p>{description}</p>
    </div>
  </a>
);

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

async function getCupo(carreraId: string) {
  const carreraDocRef = doc(db, 'Configuracion Carreeras', carreraId);
  const carreraDocSnap = await getDoc(carreraDocRef);
  if (carreraDocSnap.exists()) {
    return carreraDocSnap.data().limiteParticipantes;
  } else {
    console.error(`Carrera document with ID ${carreraId} not found.`);
    return 0;
  }
}

async function handleEliminarCarrera(carreraId: string) {
  try {
    const carreraDocRef = doc(db, 'Configuracion Carreeras', carreraId);
    await deleteDoc(carreraDocRef);
    console.log(`Carrera with ID ${carreraId} successfully deleted.`);
  } catch (error) {
    console.error('Error deleting carrera:', error);
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

  const handleEditarCarrera = (carreraId: string) => {
    // Redireccionar a la página de administrador de carreras
    window.location.href = "/Admin/administradorCarreras"
  };

  const today = new Date();

  return (
    <>
      <nav className="bg-blue-500 p-10">
        <div className="container mx-auto flex justify-center space-x-10">
        <MenuItem link="/Admin/administradorCarreras" text="Administrar Carreras" description="" />
<MenuItem link="/Admin/administrarTiempos" text="Administrar Tiempos" description="" />
<MenuItem link="/Admin/carreras" text="Carreras" description="" />
<MenuItem link="/Admin/configuraciones" text="Configuraciones" description="" />
<MenuItem link="/Admin/confirmaciones" text="Confirmación de Pagos" description="" />
<MenuItem link="/Admin/historicosadmin" text="Históricos" description="" />
<MenuItem link="/Admin/listaParticipantes" text="Lista de Participantes" description="" />
<MenuItem link="/Admin/resultados" text="Resultados" description="" />

        </div>
      </nav>
      <div className="text-black min-h-screen" style={{ fontFamily: 'Arial', backgroundColor: '#E0E6F3' }}>
      <br />
        <br />
        <h1 style={{ textAlign: 'center', fontSize: '30px', color: 'black' }}>Editar Eventos </h1>
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
                            <h3 className="text-lg font-bold">{carrera.nombre}</h3>
                            <p>{carrera.edicion}</p>
                            <p>{carrera.fecha}</p>
                            <p>Cupos Disponibles: {carrera.cupo}</p>
                          </div>
                          <div>
                            <p>Distancia: {carrera.distancia}</p>
                          
                          </div>
                          <div>
                            <p>Costo: {carrera.costo}</p>
                            <p>Responsable: {carrera.responsable}</p>
                            <p>Contacto: {carrera.contacto}</p>
                            <button
                              style={{ backgroundColor: '#007bff', color: '#fff', border: 'none', padding: '5px 10px', cursor: 'pointer', margin: 'auto' }}
                              onClick={() => handleEditarCarrera(carrera.id)}
                            >
                              Editar 
                            </button>
                            <button
                              style={{ backgroundColor: 'red', color: '#fff', border: 'none', padding: '5px 10px', cursor: 'pointer', margin: 'auto' }}
                              onClick={() => handleEliminarCarrera(carrera.id)}
                            >
                              Eliminar 
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
        </div>
        {mensaje && <div>{mensaje}</div>}
      </div>
    </>
  );
}

export default Carreras;
