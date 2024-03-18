'use client'
import React, { useState, ChangeEvent, FormEvent } from 'react';

import { db } from '../../../../firebase/firebase';
import { collection, addDoc } from 'firebase/firestore';

interface FormData {
  nombre: string;
  apellidos: string;
  cedula: string;
  sexo: string;
  edad: string;
  email: string;
  confirmarEmail: string;
  telefono: string;
  nacimiento: string;
  tallaCamisa: string;
  lateralidad: string;
  nombreEmergencia: string;
  telefonoEmergencia: string;
  parentescoEmergencia: string;
  provincia: string;
  totalMonto: string;
  beneficiarioPoliza: string;
  metodoPago: string;
  guardarDatos: boolean;
  aceptarTerminos: boolean;
  discapacidad: string;
  tipoDiscapacidad: string;
  alergiaMedicamento: string;
  pais: string;
  evento: string;
  codigoComprobante: string;
}

const initialFormData: FormData = {
  nombre: '',
  apellidos: '',
  cedula: '',
  sexo: '',
  edad: '',
  email: '',
  confirmarEmail: '',
  telefono: '',
  nacimiento: '',
  tallaCamisa: '',
  lateralidad: '',
  nombreEmergencia: '',
  telefonoEmergencia: '',
  parentescoEmergencia: '',
  provincia: '',
  totalMonto: '',
  beneficiarioPoliza: '',
  metodoPago: '',
  guardarDatos: false,
  aceptarTerminos: false,
  discapacidad: '',
  tipoDiscapacidad: '',
  alergiaMedicamento: '',
  pais: '',
  evento: '',
  codigoComprobante: '',
};

function Inscripción() {
  const [formData, setFormData] = useState<FormData>({ ...initialFormData });

  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'nacimiento') {
      const edad = calcularEdad(value);
      setFormData({ ...formData, [name]: value, edad: edad.toString() });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const calcularEdad = (fechaNacimiento: string): number => {
    const hoy = new Date();
    const cumpleanos = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - cumpleanos.getFullYear();
    const mes = hoy.getMonth() - cumpleanos.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < cumpleanos.getDate())) {
      edad--;
    }
    return edad;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      await addFormDataToFirebase(formData);
      console.log('Form Data:', formData);
    } catch (error) {
      console.error('Error adding form data to Firebase:', error);
    }

    setFormData({ ...initialFormData });
  };

  const addFormDataToFirebase = async (formData: FormData) => {
    try {
      const docRef = await addDoc(collection(db, 'Inscripciones'), formData);
      console.log('Form data added with ID: ', docRef.id);
    } catch (error) {
      console.error('Error adding form data: ', error);
      throw error;
    }
  };

  return (

    <>
      <div className="min-h-screen flex flex-col justify-center items-center" style={{ background: 'linear-gradient(to bottom right, #FFFFF, #B1CEE3)',}}>
      <br />
            <br />
            <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded absolute top-0 right-0 mt-4 mr-4"
          onClick={() => window.history.back()}
        >
          Volver
        </button>

      <h1 style={{ fontWeight: 'bold', marginBottom: '80px' }}>FORMULARIO DE INCRIPCION A CARRERAS</h1>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: '1200px' }}>
          <form onSubmit={handleSubmit} style={{ width: '45%', marginRight: '5%' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
  <h1 style={{ fontWeight: 'bold', marginBottom: '40px' }}>Datos Personales:</h1>

  <div style={{ marginBottom: '20px' }}>
    <label htmlFor="nombre" style={{ display: 'inline-block', width: '150px' }}>Nombre:</label>
    <input
      type="text"
      id="nombre"
      name="nombre"
      value={formData.nombre}
      onChange={handleInputChange}
      required
      style={{ display: 'inline-block' }}
    />
  </div>

  <div style={{ marginBottom: '20px' }}>
    <label htmlFor="apellidos" style={{ display: 'inline-block', width: '150px' }}>Apellidos:</label>
    <input
      type="text"
      id="apellidos"
      name="apellidos"
      value={formData.apellidos}
      onChange={handleInputChange}
      required
      style={{ display: 'inline-block' }}
    />
  </div>

  <div style={{ marginBottom: '20px' }}>
    <label htmlFor="cedula" style={{ display: 'inline-block', width: '150px' }}>Cédula/Pasaporte:</label>
    <input
      type="text"
      id="cedula"
      name="cedula"
      value={formData.cedula}
      onChange={handleInputChange}
      required
      style={{ display: 'inline-block' }}
    />
  </div>

  <div style={{ marginBottom: '20px' }}>
    <label htmlFor="sexo" style={{ display: 'inline-block', width: '150px' }}>Sexo:</label>
    <select
      id="sexo"
      name="sexo"
      value={formData.sexo}
      onChange={handleInputChange}
      required
      style={{ display: 'inline-block' }}
    >
      <option value="femenino">Femenino</option>
      <option value="masculino">Masculino</option>
    </select>
  </div>

  <div style={{ marginBottom: '20px' }}>
    <label htmlFor="nacimiento" style={{ display: 'inline-block', width: '150px' }}>Fecha de Nacimiento:</label>
    <input
      type="date"
      id="nacimiento"
      name="nacimiento"
      value={formData.nacimiento}
      onChange={handleInputChange}
      required
      style={{ display: 'inline-block' }}
    />
  </div>

  <div style={{ marginBottom: '20px' }}>
    <label htmlFor="edad" style={{ display: 'inline-block', width: '150px' }}>Edad en años cumplidos:</label>
    <input
      type="number"
      id="edad"
      name="edad"
      value={formData.edad}
      onChange={handleInputChange}
      min="0"
      max="100"
      required
      style={{ display: 'inline-block' }}
    />
  </div>

  <div style={{ marginBottom: '20px' }}>
    <label htmlFor="email" style={{ display: 'inline-block', width: '150px' }}>Email:</label>
    <input
      type="email"
      id="email"
      name="email"
      value={formData.email}
      onChange={handleInputChange}
      required
      style={{ display: 'inline-block' }}
    />
  </div>

  <div style={{ marginBottom: '20px' }}>
    <label htmlFor="telefono" style={{ display: 'inline-block', width: '150px' }}>Teléfono:</label>
    <input
      type="tel"
      id="telefono"
      name="telefono"
      value={formData.telefono}
      onChange={handleInputChange}
      required
      style={{ display: 'inline-block' }}
    />
  </div>

  <div style={{ marginBottom: '20px' }}>
    <label htmlFor="pais" style={{ display: 'inline-block', width: '150px' }}>País:</label>
    <select
      id="pais"
      name="pais"
      value={formData.pais}
      onChange={handleInputChange}
      required
      style={{ display: 'inline-block' }}
    >
      <option value="">Argentina</option>
      <option value="Argentina">Argentina</option>
      <option value="Colombia">Colombia</option>
      <option value="Costa Rica">Costa Rica</option>
      <option value="Ecuador">Ecuador</option>
      <option value="Honduras">Honduras</option>
      <option value="Guatemala">Guatemala</option>
      <option value="Salvador">Salvador</option>
      <option value="Nicaragua">Nicaragua</option>
      <option value="Mexico">Mexico</option>
      <option value="Panama">Panama</option>
    </select>
  </div>

  <div style={{ marginBottom: '20px' }}>
    <label htmlFor="tallaCamisa" style={{ display: 'inline-block', width: '150px' }}>Talla de camisa:</label>
    <select
      id="tallaCamisa"
      name="tallaCamisa"
      value={formData.tallaCamisa}
      onChange={handleInputChange}
      required
      style={{ display: 'inline-block' }}
    >
      <option value="">XS</option>
      <option value="XS">XS</option>
      <option value="S">S</option>
      <option value="M">M</option>
      <option value="L">L</option>
      <option value="XL">XL</option>
      <option value="XXL">XXL</option>
    </select>
  </div>

  <div style={{ marginBottom: '20px' }}>
    <label htmlFor="lateralidad" style={{ display: 'inline-block', width: '150px' }}>Lateralidad:</label>
    <select
      id="lateralidad"
      name="lateralidad"
      value={formData.lateralidad}
      onChange={handleInputChange}
      required
      style={{ display: 'inline-block' }}
    >
      <option value="derecha">Derecha</option>
      <option value="izquierda">Izquierda</option>
    </select>
  </div>

  <div style={{ marginBottom: '20px' }}>
    <label htmlFor="discapacidad" style={{ display: 'inline-block', width: '150px' }}>¿Presenta alguna discapacidad?</label>
    <select
      id="discapacidad"
      name="discapacidad"
      value={formData.discapacidad}
      onChange={handleInputChange}
      required
      style={{ display: 'inline-block' }}
    >
      <option value="no">No</option>
      <option value="si">Sí</option>
    </select>
  </div>

  {formData.discapacidad === 'si' && (
    <div style={{ marginBottom: '20px' }}>
      <label htmlFor="tipoDiscapacidad" style={{ display: 'inline-block', width: '150px' }}>Tipo de Discapacidad:</label>
      <input
        type="text"
        id="tipoDiscapacidad"
        name="tipoDiscapacidad"
        value={formData.tipoDiscapacidad}
        onChange={handleInputChange}
        required
        style={{ display: 'inline-block' }}
      />
    </div>
  )}

  <div style={{ marginBottom: '20px' }}>
    <label htmlFor="alergiaMedicamento" style={{ display: 'inline-block', width: '150px' }}>¿Presenta alergia a algún medicamento?</label>
    <select
      id="alergiaMedicamento"
      name="alergiaMedicamento"
      value={formData.alergiaMedicamento}
      onChange={handleInputChange}
      required
      style={{ display: 'inline-block' }}
    >
      <option value="no">No</option>
      <option value="si">Sí</option>
    </select>
  </div>

  {formData.alergiaMedicamento === 'si' && (
    <div style={{ marginBottom: '20px' }}>
      <label htmlFor="medicamentoAlergia" style={{ display: 'inline-block', width: '150px' }}>Medicamento alérgico:</label>
      <input
        type="text"
        id="medicamentoAlergia"
        name="medicamentoAlergia"
        value={formData.alergiaMedicamento}
        onChange={handleInputChange}
        required
        style={{ display: 'inline-block' }}
      />
    </div>
  )}

</div>



          </form>
          <form onSubmit={handleSubmit} style={{ width: '45%', marginLeft: '5%' }}>
          
          <h1 style={{ fontWeight: 'bold', marginBottom: '40px' }}>Contacto en caso de emeregencia y beneficiario:</h1>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
 
  <div style={{ marginBottom: '20px' }}>
    <label htmlFor="nombreEmergencia" style={{ display: 'inline-block', width: '250px' }}>Nombre de contacto:</label>
    <input
      type="text"
      id="nombreEmergencia"
      name="nombreEmergencia"
      value={formData.nombreEmergencia}
      onChange={handleInputChange}
      required
      style={{ display: 'inline-block' }}
    />
  </div>

  <div style={{ marginBottom: '20px' }}>
    <label htmlFor="beneficiarioPoliza" style={{ display: 'inline-block', width: '250px' }}>Identificación:</label>
    <input
      type="text"
      id="beneficiarioPoliza"
      name="beneficiarioPoliza"
      value={formData.beneficiarioPoliza}
      onChange={handleInputChange}
      required
      style={{ display: 'inline-block' }}
    />
  </div>

  <div style={{ marginBottom: '20px' }}>
    <label htmlFor="telefonoEmergencia" style={{ display: 'inline-block', width: '250px' }}>Teléfono:</label>
    <input
      type="tel"
      id="telefonoEmergencia"
      name="telefonoEmergencia"
      value={formData.telefonoEmergencia}
      onChange={handleInputChange}
      required
      style={{ display: 'inline-block' }}
    />
  </div>

  <div style={{ marginBottom: '20px' }}>
    <label htmlFor="beneficiarioPoliza" style={{ display: 'inline-block', width: '250px' }}>Beneficiario Póliza:</label>
    <input
      type="text"
      id="beneficiarioPoliza"
      name="beneficiarioPoliza"
      value={formData.beneficiarioPoliza}
      onChange={handleInputChange}
      style={{ display: 'inline-block' }}
    />
  </div>
<div style={{ marginBottom: '20px' }}>
  <label htmlFor="parentescoEmergencia" style={{ display: 'inline-block', width: '150px', marginRight: '20px' }}>Parentesco:</label>
  <select
    id="parentescoEmergencia"
    name="parentescoEmergencia"
    value={formData.parentescoEmergencia}
    onChange={handleInputChange}
    required
    style={{ display: 'inline-block' }}
  >
    {[
      "Abuelo", "Abuela", "Amigo", "Esposa", "Esposo", "Hermano", "Hermana", "Hijo", "Hija", "Madre", "Padre", "Primo", "Prima", "Sobrino", "Sobrina", "Tío", "Tía",
    ].sort().map((parentesco) => (
      <option key={parentesco} value={parentesco}>
        {parentesco}
      </option>
    ))}
  </select>
</div>




</div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
  <h1 style={{ fontWeight: 'bold', marginBottom: '40px' }}>Evento en el que desea participar:</h1>

  <div style={{ marginBottom: '20px' }}>
    <label htmlFor="evento" style={{ display: 'inline-block', width: '250px' }}>Carreras Disponibles:</label>
    <select
      id="evento"
      name="evento"
      value={formData.evento}
      onChange={handleInputChange}
      required
      style={{ display: 'inline-block' }}
    >
      <option value=""></option>
      <option value="Carrera Montaña">Carrera Montaña</option>
      <option value="carrera Ecologica">carrera Ecologica</option>
      <option value="Carrera Internacional">Carrera Internacional</option>
    </select>
  </div>

  <h1 style={{ fontWeight: 'bold', marginBottom: '40px' }}>Formas de pago:</h1>

  <div style={{ marginBottom: '20px' }}>
    <label htmlFor="metodoPago" style={{ display: 'inline-block', width: '250px' }}>Método de pago:</label>
    <select
      id="metodoPago"
      name="metodoPago"
      value={formData.metodoPago}
      onChange={handleInputChange}
      style={{ display: 'inline-block' }}
    >
      <option value="sinpe">Sinpe</option>
      <option value="Patrocinador">Patrocinador</option>
      <option value="Otro">Otro</option>
    </select>
  </div>

  <div style={{ marginBottom: '20px' }}>
    <label htmlFor="codigoComprobante" style={{ display: 'inline-block', width: '250px' }}>Código de Comprobante:</label>
    <input
      type="text"
      id="codigoComprobante"
      name="codigoComprobante"
      value={formData.codigoComprobante}
      onChange={handleInputChange}
      required
      style={{ display: 'inline-block' }}
    />
  </div>
  <br />
            <br />
            <div style={{ marginBottom: '20px' }}>
  <label htmlFor="aceptarTerminos" style={{ display: 'flex', alignItems: 'center' }}>
    <input
      type="checkbox"
      id="aceptarTerminos"
      name="aceptarTerminos"
      checked={formData.aceptarTerminos}
      onChange={handleInputChange}
      required
      style={{ marginRight: '10px' }}
    />
    <strong>He leído y acepto los siguientes términos y condiciones</strong>
  </label>
</div>

</div>
<br />
            <br />
            <input 
              type="submit" 
              value="Enviar Inscripción" 
              style={{ 
                padding: '10px 20px', 
                fontSize: '16px',
                background: 'blue',  
                color: 'white',       
              }} 
            />
          </form>
        </div>
      </div>
    </>
  );
}

export default Inscripción;
