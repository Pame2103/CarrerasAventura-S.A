'use client'
import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../../firebase/firebase';
import Link from 'next/link';
import { FaRunning, FaInfoCircle, FaDumbbell, FaEnvelope, FaTrophy, FaSignInAlt } from 'react-icons/fa';

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
  cupoDisponible: string;
}

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

const Carreras: React.FC = () => {
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
    window.location.href = "/Admin/editarcarreras"
  };

  const today = new Date();

  return (
    <div>
      <nav className="bg-white border-b border-gray-200 fixed w-full z-23 top-0 left-0 h-23">
        <div className="max-w-screen-2xl mx-auto px-6 sm:px-7 lg:px-9">
          <div className="flex items-center justify-between h-full">
            <div className="flex items-center">
              <Link href="/">
                <img src="/LogoC.png" className="h-20 w-auto" alt="Carrera Aventura" />
              </Link>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  <Link href="/Admin/administradorCarreras">
                    <span className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center">
                      <FaRunning className="mr-1" /> Crear Carreras
                    </span>
                  </Link>
                  <Link href="/Admin/administrarTiempos">
                    <span className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center">
                      <FaInfoCircle className="mr-1" /> Administrar Tiempos
                    </span>
                  </Link>
                  <Link href="/Admin/carreras">
                    <span className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center">
                      <FaDumbbell className="mr-1" /> Carreras Disponibles
                    </span>
                  </Link>
                  <Link href="/Admin/confirmaciones">
                    <span className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center">
                      <FaTrophy className="mr-1" />Confirmación de Pagos
                    </span>
                  </Link>
                  <Link href="/Admin/editarcarreras">
                    <span className="text-gray-600 hover:text-gray-900 px-0 py-0 rounded-md text-sm font-medium flex items-center">
                      <FaTrophy className="mr-1" />Editar Carreras
                    </span>
                  </Link>
                  <Link href="/Admin/ControlTiempos">
                    <span className="text-gray-600 hover:text-gray-900 px-0 py-2 rounded-md text-sm font-medium flex items-center">
                      <FaTrophy className="mr-1" />Control Tiempos
                    </span>
                  </Link>
                  <Link href="/Admin/listaParticipantes">
                    <span className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center">
                      <FaTrophy className="mr-1" /> Lista de Participantes
                    </span>
                  </Link>
                  
                </div>
              </div>
            </div>
            <div className="flex">
              <Link href="/Login" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium flex items-center">
                <FaSignInAlt className="mr-1" /> Cerrar sesión
              </Link>
            </div>
          </div>
          <div className="ml-10 text-gray-600 text-sm font-medium">¡Corre hacia tus metas con Carrera Aventura! ¡Cruzando la meta juntos!</div>
        </div>
      </nav>
      <br />
      <br />
      <div className="text-black min-h-screen" style={{ fontFamily: 'Arial', backgroundColor: '#E0E6F3' }}>
        <br />
        <br />
        <br />
        <br />
        <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '2rem', color: '#333', textAlign: 'center' }}>ADMINISTRADOR DE CARRERAS</h1>

        <img src="/idea.gif" alt="Descripción de la imagen" className="mx-auto mb-8" style={{ width: '250px', height: '200px' }} />

        <div className="grid grid-cols-3 gap-4">
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
                  <div key={monthName} className="mb-8">
                    <h2 style={{ textAlign: 'center', textTransform: 'capitalize', fontSize: '24px', marginTop: '20px' }}>{monthName}</h2>
                    {carrerasEnMes.map(carrera => (
                      <div key={carrera.id} className="bg-white rounded-lg shadow-md p-4 mb-4">
                        <div>
                          <h3 className="text-lg font-bold">{carrera.nombre}</h3>
                          <p>{carrera.edicion}</p>
                          <p>{carrera.fecha}</p>
                          <p>Cupos Disponibles: {carrera.cupoDisponible}</p>
                        </div>
                        <div>
                          <p>Distancia: {carrera.distancia}</p>
                        </div>
                        <div>
                          <p>Costo: {carrera.costo}</p>
                          <p>Responsable: {carrera.responsable}</p>
                          <p>Contacto: {carrera.contacto}</p>
                          <button
                            style={{ backgroundColor: '#007bff', color: '#fff', border: 'none', padding: '5px 10px', cursor: 'pointer', margin: 'auto', marginRight: '10px' }}
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
                    ))}
                  </div>
                );
              }
              return null;
            })}
        </div>
        {mensaje && <div>{mensaje}</div>}
      </div>
    </div>
  );
}

export default Carreras;
