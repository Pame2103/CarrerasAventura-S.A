'use client'
import React, { useState, ChangeEvent, FormEvent } from 'react';
import {
  TextField,
  Button,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import { db } from '../../../../firebase/firebase';
import { collection, addDoc } from 'firebase/firestore';


interface Carrera {
  nombre: string;
  fecha: string;
  costo: string;
  distancia: string;
  edicion: string;
  tipocarrera: string;
  estadocarrera: string;
  responsable: string;
  contacto: string;
  lugar: string;
  hora: string;
  cupo: string;
}

function Administradorcarreras() {
  const [nuevaCarrera, setNuevaCarrera] = useState<Carrera>({
    nombre: '',
    fecha: '',
    costo: '',
    distancia: '',
    edicion: '',
    tipocarrera: '',
    estadocarrera: '',
    responsable: '',
    contacto: '',
    lugar: '',
    hora:'',
    cupo: '',
  });

  const [operacionExitosa, setOperacionExitosa] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleChange = (event: ChangeEvent<{ name?: string; value: unknown }>) => {
    const { name, value } = event.target;
    setNuevaCarrera({ ...nuevaCarrera, [name as string]: value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      setErrorMessage('Por favor, completa todos los campos correctamente.');
      return;
    }

    try {
      await addFormDataToFirebase(nuevaCarrera);
      console.log('Form Data:', nuevaCarrera);

      setOperacionExitosa(true);
      setErrorMessage('');
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
        cupo: '',
        lugar: '',
        hora: ''
      });
    } catch (error) {
      console.error('Error adding form data to Firebase:', error);
      setOperacionExitosa(false);
    }
  };

  const addFormDataToFirebase = async (nuevaCarrera: Carrera) => {
    try {
      const docRef = await addDoc(collection(db, 'Configuracion Carreeras'), nuevaCarrera);
      console.log('Form data added with ID: ', docRef.id);
    } catch (error) {
      console.error('Error adding form data: ', error);
      throw error;
    }
  };

  const validateForm = () => {
    if (
      nuevaCarrera.nombre.trim() === '' ||
      nuevaCarrera.edicion.trim() === '' ||
      nuevaCarrera.fecha.trim() === '' ||
      nuevaCarrera.distancia.trim() === '' ||
      nuevaCarrera.costo.trim() === '' ||
      nuevaCarrera.tipocarrera.trim() === '' ||
      nuevaCarrera.estadocarrera.trim() === '' ||
      nuevaCarrera.responsable.trim() === '' ||
      nuevaCarrera.contacto.trim() === '' ||
      nuevaCarrera.lugar.trim() === '' ||
      nuevaCarrera.cupo.trim() === ''
    ) {
      return false;
    }

    // Aquí puedes agregar más validaciones según tus requisitos, como el formato de fecha, números de teléfono, etc.

    return true;
  };

  return (
    <div className="container">
      {/* Estilos */}
      <style>
        {`
          .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #ccc;
            border-radius: 8px;
            background: #f9f9f9;
          }

          .form-container {
            text-align: left;
          }

          .form-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 16px;
          }

          .form-field {
            flex: 0 0 calc(33.33% - 8px);
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

      {/* Contenido del componente */}
      <h2 style={{ textAlign: 'center', fontSize: '2em', fontWeight: 'bold' }}>Administrador de carreras</h2>
      <div className="form-container">
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
              <InputLabel>Cupos Dispinibles:</InputLabel>
              <TextField
                label=''
                variant='outlined'
                name='cupo'
                value={nuevaCarrera.cupo}
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
              <InputLabel>Tipo de carrera:</InputLabel>
              <Select
                variant='outlined'
                name='tipocarrera'
                value={nuevaCarrera.tipocarrera}
                //onChange={handleChange}
                fullWidth
                placeholder='carreras de Montaña'
              >
                <MenuItem value='Carreras de Montaña'>Carreras de Montaña</MenuItem>
                <MenuItem value='Carrera Internacional'>Carrera internacional</MenuItem>
                <MenuItem value='Carrera Ecologica'>Carrera ecologica</MenuItem>
              </Select>
            </div>
            <div className="form-field">
              <InputLabel>Estado de la carrera:</InputLabel>
              <Select
                variant='outlined'
                name='estadocarrera'
                value={nuevaCarrera.estadocarrera}
                //onChange={handleChange}
                fullWidth
              >
                <MenuItem value='Activa'>Activa</MenuItem>
                <MenuItem value='Inactiva'>Inactiva</MenuItem>
                <MenuItem value='En configuracion'>Configuracion</MenuItem>
              </Select>
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
          {/* Botón de envío */}
          <Button variant='contained' type='submit' color='primary' className='botones'>
            Agregar Carrera
          </Button>
        </form>

        {/* Mensajes de éxito o error */}
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
  );
}

export default Administradorcarreras;
