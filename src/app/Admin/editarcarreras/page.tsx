'use client'
import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { TextField, Button, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { db } from '../../../../firebase/firebase';
import { collection, getDocs, doc, updateDoc, query, where, doc as docRef } from 'firebase/firestore';
import Link from 'next/link';

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

  const [carreras, setCarreras] = useState<Carrera[]>([]);
  const [selectedCarrera, setSelectedCarrera] = useState<string>('');

  useEffect(() => {
    async function fetchCarreras() {
      const q = query(collection(db, 'Configuracion Carreeras'));
      const carrerasSnapshot = await getDocs(q);
      const carrerasData: Carrera[] = [];
      carrerasSnapshot.forEach((doc) => {
        carrerasData.push(doc.data() as Carrera);
      });
      setCarreras(carrerasData);
    }
    fetchCarreras();
  }, []);

  const handleChange = (event: ChangeEvent<{ name?: string; value: unknown }>) => {
    const { name, value } = event.target;
    setNuevaCarrera({ ...nuevaCarrera, [name as string]: value as string });
  };

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const selectedCarreraNombre = event.target.value;
    setSelectedCarrera(selectedCarreraNombre);

    const carrera = carreras.find(c => c.nombre === selectedCarreraNombre);
    if (carrera) {
      setNuevaCarrera(carrera);
    } else {
      setNuevaCarrera({
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
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      await updateCarreraInFirebase(nuevaCarrera);
      console.log('Form Data:', nuevaCarrera);

      setOperacionExitosa(true);
      setErrorMessage('');
    } catch (error) {
      console.error('Error updating form data in Firebase:', error);
      setOperacionExitosa(false);
      setErrorMessage('Hubo un error al agregar los cambios.');
    }
  };

  const updateCarreraInFirebase = async (updatedCarrera: Carrera) => {
    try {
      const q = query(collection(db, 'Configuracion Carreeras'), where('nombre', '==', updatedCarrera.nombre));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        querySnapshot.forEach(async (doc) => {
          try {
            const carreraRef = docRef(db, `Configuracion Carreeras/${doc.id}`);
            
            const { nombre, ...updatedCarreraData } = updatedCarrera;
            await updateDoc(carreraRef, updatedCarreraData);
            console.log('Carrera updated:', updatedCarrera.nombre);
          } catch (error) {
            console.error('Error updating carrera:', error);
            throw error;
          }
        });
      } else {
        console.error('Documento no encontrado:', updatedCarrera.nombre);
        throw new Error('Documento no encontrado en la base de datos.');
      }
    } catch (error) {
      console.error('Error querying database:', error);
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
                      Administrar Carreras
                    </span>
                  </Link>
                  <Link href="/Admin/administrarTiempos">
                    <span className="text-gray-600 hover:text-gray-900 px-0 py-2 rounded-md text-sm font-medium flex items-center">
                      Administrar Tiempos
                    </span>
                  </Link>
                  <Link href="/Admin/carreras">
                    <span className="text-gray-600 hover:text-gray-900 px-0 py-2 rounded-md text-sm font-medium flex items-center">
                      Carreras
                    </span>
                  </Link>
                  <Link href="/Admin/confirmaciones">
                    <span className="text-gray-600 hover:text-gray-900 px-0 py-2 rounded-md text-sm font-medium flex items-center">
                      Confirmación de Pagos
                    </span>
                  </Link>
                  <Link href="/Admin/editarcarreras">
                    <span className="text-gray-600 hover:text-gray-900 px-0 py-2 rounded-md text-sm font-medium flex items-center">
                      Editar Carreras
                    </span>
                  </Link>
                  <Link href="/Admin/historicosadmin">
                    <span className="text-gray-600 hover:text-gray-900 px-0 py-2 rounded-md text-sm font-medium flex items-center">
                      Históricos
                    </span>
                  </Link>
                  <Link href="/Admin/listaParticipantes">
                    <span className="text-gray-600 hover:text-gray-900 px-0 py-2 rounded-md text-sm font-medium flex items-center">
                      Lista de Participantes
                    </span>
                  </Link>
                  <Link href="/Admin/record">
                    <span className="text-gray-600 hover:text-gray-900 px-0 py-2 rounded-md text-sm font-medium flex items-center">
                      Records
                    </span>
                  </Link>
                  <Link href="/Admin/resultados">
                    <span className="text-gray-600 hover:text-gray-900 px-0 py-2 rounded-md text-sm font-medium flex items-center">
                      Resultados
                    </span>
                  </Link>
                </div>
              </div>
            </div>
            <div className="flex">
              <Link href="/Login" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium flex items-center">
                Cerrar sesión
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
      {/* Estilos */}
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

      <div className="container">
        <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '2rem', color: '#333', textAlign: 'center' }}>EDITAR EVENTOS</h1>
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-field">
                <InputLabel>Seleccionar Carrera:</InputLabel>
                <Select
                  value={selectedCarrera}
                  onChange={handleSelectChange}
                  fullWidth
                >
                  <MenuItem value="">
                    <em>Seleccionar carrera</em>
                  </MenuItem>
                  {carreras.map((carrera) => (
                    <MenuItem key={carrera.nombre} value={carrera.nombre}>
                      {carrera.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </div>
            </div>
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
                Editar Carrera
              </Button>
            </div>
          </form>
        
          {operacionExitosa === true && (
            <div style={{ color: 'green', marginTop: '10px' }}>
              Los cambios se realizaron con éxito.
            </div>
          )}
          {operacionExitosa === false && (
            <div style={{ color: 'red', marginTop: '10px' }}>
              Hubo un error al agregar los cambios.
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
