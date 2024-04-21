'use client'
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { TextField, Button, InputLabel } from '@mui/material';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../../../firebase/firebase';
import Link from 'next/link';
import { FaRunning, FaInfoCircle, FaDumbbell, FaEnvelope, FaTrophy, FaSignInAlt } from 'react-icons/fa';

interface Carrera {
  nombre: string;
  fecha: string;
  costo: string;
  distancia: string;
  edicion: string;
  responsable: string;
  contacto: string;
  lugar: string;
  hora: string;
  cupoDisponible: string;
  limiteParticipante: string;
}

function Administradorcarreras() {
  const [nuevaCarrera, setNuevaCarrera] = useState<Carrera>({
    nombre: '',
    fecha: '',
    costo: '',
    distancia: '',
    edicion: '',
    responsable: '',
    contacto: '',
    lugar: '',
    hora: '',
    cupoDisponible: '',
    limiteParticipante: '',
  });

  const [operacionExitosa, setOperacionExitosa] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleChange = (event: ChangeEvent<{ name?: string; value: unknown }>) => {
    const { name, value } = event.target;
    setNuevaCarrera({ ...nuevaCarrera, [name as string]: value as string });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Verificar si algún campo está vacío
    const emptyFields = Object.entries(nuevaCarrera).filter(([key, value]) => !value);

    // Si hay campos vacíos, mostrar mensaje de error y detener el envío del formulario
    if (emptyFields.length > 0) {
      setOperacionExitosa(false);
      setErrorMessage('Todos los campos son obligatorios.');
      return;
    }

    try {
      await updateCarreraInFirebase(nuevaCarrera);
      console.log('Form Data:', nuevaCarrera);

      setOperacionExitosa(true);
      setErrorMessage('');
    } catch (error) {
      console.error('Error updating form data in Firebase:', error);
      setOperacionExitosa(false);
      setErrorMessage('Hubo un error al agregar la nueva carrera.');
    }
  };
  const updateCarreraInFirebase = async (newCarrera: Carrera) => {
    try {
      const carreraCollectionRef = collection(db, 'Configuracion Carreeras');
      await addDoc(carreraCollectionRef, newCarrera);
      console.log('Nueva carrera agregada:', newCarrera.nombre);
    } catch (error) {
      console.error('Error adding new carrera:', error);
      throw error;
    }
  };

  const Navbar: React.FC = () => {
    return (
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
                    <span className="text-gray-600 hover:text-gray-900 px-0 py-2 rounded-md text-sm font-medium flex items-center">
                      <FaRunning className="mr-1" /> Administrar Carreras
                    </span>
                  </Link>
                  <Link href="/Admin/administrarTiempos">
                    <span className="text-gray-600 hover:text-gray-900 px-0 py-2 rounded-md text-sm font-medium flex items-center">
                      <FaInfoCircle className="mr-1" /> Administrar Tiempos
                    </span>
                  </Link>
                  <Link href="/Admin/carreras">
                    <span className="text-gray-600 hover:text-gray-900 px-0 py-2 rounded-md text-sm font-medium flex items-center">
                      <FaDumbbell className="mr-1" /> Carreras
                    </span>
                  </Link>
                  <Link href="/Admin/confirmaciones">
                    <span className="text-gray-600 hover:text-gray-900 px-0 py-2 rounded-md text-sm font-medium flex items-center">
                      <FaTrophy className="mr-1" />Confirmación de Pagos
                    </span>
                  </Link>
                  <Link href="/Admin/editarcarreras">
                    <span className="text-gray-600 hover:text-gray-900 px-0 py-2 rounded-md text-sm font-medium flex items-center">
                      <FaTrophy className="mr-1" />Editar Carreras
                    </span>
                  </Link>
                  <Link href="/Admin/historicosadmin">
                    <span className="text-gray-600 hover:text-gray-900 px-0 py-2 rounded-md text-sm font-medium flex items-center">
                      <FaInfoCircle className="mr-1" /> Históricos
                    </span>
                  </Link>
                  <Link href="/Admin/listaParticipantes">
                    <span className="text-gray-600 hover:text-gray-900 px-0 py-2 rounded-md text-sm font-medium flex items-center">
                      <FaTrophy className="mr-1" /> Lista de Participantes
                    </span>
                  </Link>
                  <Link href="/Admin/record">
                    <span className="text-gray-600 hover:text-gray-900 px-0 py-2 rounded-md text-sm font-medium flex items-center">
                      <FaEnvelope className="mr-1" /> Records
                    </span>
                  </Link>
                  <Link href="/Admin/resultados">
                    <span className="text-gray-600 hover:text-gray-900 px-0 py-2 rounded-md text-sm font-medium flex items-center">
                      <FaEnvelope className="mr-1" /> Resultados
                    </span>
                  </Link>
                </div>
              </div>
            </div>
            <div className="flex">
              <Link href="/Login" className="bg-blue-600 hover:bg-blue-700 text-white px-0 py-0 rounded-md font-medium flex items-center">
                <FaSignInAlt className="mr-2" /> Cerrar sesión
              </Link>
            </div>
          </div>
          <div className="ml-10 text-gray-600 text-sm font-medium">¡Corre hacia tus metas con Carrera Aventura! ¡Cruzando la meta juntos!</div>
        </div>
      </nav>
    );
  }

  return (
    <>
      <style>
        {`
          body {
            margin: 0;
            padding: 0;
            background-color: blue--700;
            background-size: blue--700;
            background-repeat: no-repeat;
            height: 200vh;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          
          .container {
            max-width: 900px;
            padding: 20px;
            border: 1px solid #ccc;
            border-radius: 5px;
            background: rgba(250, 250, 250, 0.6);
          }
          
          .form-container {
            text-align: left;
          }
          
          .form-row {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            margin-bottom: 16px;
          }
          
          .form-field {
            flex: 0 0 calc(50% - 8px); /* Cambiado el ancho para que los campos se muestren en dos columnas */
          }
          
          .form-container form div {
            margin-bottom: 10px;
          }
          
          .form-container form button {
            margin-top: 10px;
            background: #1976D2;
            color: white;
          }
        `}
      </style>
      <br />
        <br />
         <br />
        <br />
      <div className="container">
        <br />
        <br />
        <br />
        <br />
        <br />
        <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '2rem', color: '#333', textAlign: 'center' }}>CREAR EVENTO</h1>

        <img src="/anuncio.gif" alt="Descripción de la imagen" className="mx-auto mb-8" style={{ width: '250px', height: '200px' }} />
        <div className="form-container">
          <br />
          <br />
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-field">
                <InputLabel>Nombre:</InputLabel>
                <TextField
                  label=''
                  variant='outlined'
                  name='nombre'
                  value={nuevaCarrera.nombre}
                  onChange={handleChange}
                  fullWidth
                  placeholder='Carrera Chirripo'
                />
              </div>
              <div className="form-field">
                <InputLabel>Edición:</InputLabel>
                <TextField
                  label=''
                  variant='outlined'
                  name='edicion'
                  value={nuevaCarrera.edicion}
                  onChange={handleChange}
                  fullWidth
                  placeholder='3 TH'
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-field">
                <InputLabel>Fecha:</InputLabel>
                <TextField
                  variant='outlined'
                  type='date'
                  name='fecha'
                  value={nuevaCarrera.fecha}
                  onChange={handleChange}
                  fullWidth
                  placeholder='2024/10/31'
                />
              </div>
              <div className="form-field">
                <InputLabel>Responsable:</InputLabel>
                <TextField
                  label=''
                  variant='outlined'
                  name='responsable'
                  value={nuevaCarrera.responsable}
                  onChange={handleChange}
                  fullWidth
                  placeholder='Juan Mora'
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-field">
                <InputLabel>Contacto:</InputLabel>
                <TextField
                  label=''
                  variant='outlined'
                  name='contacto'
                  value={nuevaCarrera.contacto}
                  onChange={handleChange}
                  fullWidth
                  placeholder='Carreraschirripo@gmail.com'
                />
              </div>
              <div className="form-field">
                <InputLabel>Lugar:</InputLabel>
                <TextField
                  label=''
                  variant='outlined'
                  name='lugar'
                  value={nuevaCarrera.lugar}
                  onChange={handleChange}
                  fullWidth
                  placeholder='Cerro chirripo ,Perez Zeledon, San Jose,Costa Rica'
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-field">
                <InputLabel>Distancia:</InputLabel>
                <TextField
                  label=''
                  variant='outlined'
                  name='distancia'
                  value={nuevaCarrera.distancia}
                  onChange={handleChange}
                  fullWidth
                  placeholder='11 KM'
                />
              </div>
              <div className="form-field">
                <InputLabel>Limite Participantes:</InputLabel>
                <TextField
                  label=''
                  variant='outlined'
                  name='limiteParticipante'
                  value={nuevaCarrera.limiteParticipante}
                  onChange={handleChange}
                  fullWidth
                  placeholder='50'
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-field">
                <InputLabel>Cupos Disponibles:</InputLabel>
                <TextField
                  label=''
                  variant='outlined'
                  name='cupoDisponible'
                  value={nuevaCarrera.cupoDisponible}
                  onChange={handleChange}
                  fullWidth
                  placeholder='50'
                />
              </div>
              <div className="form-field">
                <InputLabel>Costo:</InputLabel>
                <TextField
                  label=''
                  variant='outlined'
                  name='costo'
                  value={nuevaCarrera.costo}
                  onChange={handleChange}
                  fullWidth
                  placeholder='$12000'
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-field">
                <InputLabel>Hora:</InputLabel>
                <TextField
                  label=''
                  variant='outlined'
                  name='hora'
                  value={nuevaCarrera.hora}
                  onChange={handleChange}
                  fullWidth
                  placeholder='8:00 am'
                />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Button variant='contained' type='submit' color='primary' className='botones'>
                Agregar Carrera
              </Button>
            </div>
          </form>
          {operacionExitosa === true && (
            <div style={{ color: 'green', marginTop: '10px' }}>
              La carrera se agregó con éxito.
            </div>
          )}
          {operacionExitosa === false && (
            <div style={{ color: 'red', marginTop: '10px' }}>
              Hubo un error al agregar la carrera.
            </div>
          )}
          {errorMessage && (
            <div style={{ color: 'red', marginTop: '10px' }}>
              {errorMessage}
            </div>
          )}
        </div>
      </div>
      <Navbar />
    </>
  );
}

export default Administradorcarreras;
