'use client'
import { TextField, Button, InputLabel, Select, MenuItem, } from '@mui/material';
import { db } from '../../../../firebase/firebase';
import { collection, addDoc } from 'firebase/firestore';

import React, { useState } from 'react';

function Administradorcarreras() {
 

  const [nuevaCarrera, setNuevaCarrera] = useState({
    nombre: '',
    fecha: '',
    costo: '',
    distancia: '',
    edicion: '',
    tipocarrera: '',
    estadocarrera: '',
    responsable: '',
    contacto: '',
  });

  const [operacionExitosa, setOperacionExitosa] = useState<boolean | null>(null);
  const handleChange = (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
    const { name, value } = event.target;
    setNuevaCarrera({ ...nuevaCarrera, [name as string]: value });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await addFormDataToFirebase(nuevaCarrera);
      console.log('Form Data:', nuevaCarrera);

      // Correct usage of setOperacionExitosa
      setOperacionExitosa(true);
      // Reset the form data
      setNuevaCarrera({
        nombre: '',
        fecha: '',
        costo: '',
        distancia: '',
        edicion: '',
        tipocarrera: '',
        estadocarrera: '',
        responsable: '',
        contacto: '',
      });
    } catch (error) {
      console.error('Error adding form data to Firebase:', error);
      setOperacionExitosa(false);
    }
  };

  const addFormDataToFirebase = async (nuevaCarrera: Record<string, any>) => {
    try {
      const docRef = await addDoc(collection(db, 'Configuracion Carreeras'), nuevaCarrera);
      console.log('Form data added with ID: ', docRef.id);
    } catch (error) {
      console.error('Error adding form data: ', error);
      throw error;
    }
  };

  const handleGoBack = () => {
   
  };

  return (
    <>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded absolute top-0 right-0 mt-4 mr-4"
        onClick={handleGoBack}
      >
        Volver
      </button>
      <style>
        {`
          /* Estilos globales */
          .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #ccc;
            border-radius: 8px;
            background: #f9f9f9;
          }
          
          .form-container {
            text-align: center;
          }
          
          .form-container form {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #ccc;
            border-radius: 8px;
            background-color: #f9f9f9;
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
      <h2 style={{ textAlign: 'center', fontSize: '2em', fontWeight: 'bold' }}>Perfil Administradores</h2>
      <br />
      <br />
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div>
            <InputLabel>Nombre</InputLabel>
            <TextField
              label='Nombre'
              variant='outlined'
              name='nombre'
              value={nuevaCarrera.nombre}
              onChange={handleChange}
              fullWidth
            />
          </div>
          <div>
            <InputLabel>Edición</InputLabel>
            <TextField
              label='Edición'
              variant='outlined'
              name='edicion'
              value={nuevaCarrera.edicion}
              onChange={handleChange}
              fullWidth
            />
          </div>
          <div>
            <InputLabel>Fecha</InputLabel>
            <TextField
              variant='outlined'
              type='date'
              name='fecha'
              value={nuevaCarrera.fecha}
              onChange={handleChange}
              fullWidth
            />
          </div>
          <div>
            <InputLabel>Distancia</InputLabel>
            <TextField
              label='Distancia'
              variant='outlined'
              name='distancia'
              value={nuevaCarrera.distancia}
              onChange={handleChange}
              fullWidth
            />
          </div>
          <div>
            <InputLabel>Costo</InputLabel>
            <TextField
              label='Costo'
              variant='outlined'
              name='costo'
              value={nuevaCarrera.costo}
              onChange={handleChange}
              fullWidth
            />
          </div>
          <div>
            <InputLabel>Tipo de carrera</InputLabel>
            <Select
              variant='outlined'
              name='tipocarrera'
              value={nuevaCarrera.tipocarrera}
            
              fullWidth
            >
              <MenuItem value='Carreras de Montaña'>Carreras de Montaña</MenuItem>
              <MenuItem value='Carrera internacional '>Carrera internacional</MenuItem>
              <MenuItem value='Carrera ecologica'>Carrera ecologica</MenuItem>
            </Select>
          </div>
          <div>
            <InputLabel>Estado de la carrera</InputLabel>
            <Select
              variant='outlined'
              name='estadocarrera'
              value={nuevaCarrera.estadocarrera}
            
              fullWidth
            >
              <MenuItem value='Activa'>Activa</MenuItem>
              <MenuItem value='Inactiva'>Inactiva</MenuItem>
              <MenuItem value='En configuracion'>Configuracion</MenuItem>
            </Select>
          </div>
          <div>
            <InputLabel>Responsable</InputLabel>
            <TextField
              label='responsable'
              variant='outlined'
              name='responsable'
              value={nuevaCarrera.responsable}
              onChange={handleChange}
              fullWidth
            />
          </div>
          <div>
            <InputLabel>Contacto</InputLabel>
            <TextField
              label='contacto'
              variant='outlined'
              name='contacto'
              value={nuevaCarrera.contacto}
              onChange={handleChange}
              fullWidth
            />
          </div>
          <Button
            variant='contained'
            type='submit'
            color='primary'
            className='botones'
          >
            Agregar Carrera
          </Button>
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
      </div>
    </>
  );
}

export default Administradorcarreras;
