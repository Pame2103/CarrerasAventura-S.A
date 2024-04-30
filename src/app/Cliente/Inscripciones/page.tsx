'use client'
import React, { useState, useEffect, ChangeEvent } from 'react';
import { db } from '../../../../firebase/firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import Navbar from '@/app/componentes/navbar';

interface Carrera {
  nombre: string;
  cupoDisponible: string;
}

export default function Inscripciones() {
  const initialFormData = {
    nombre: '',
    apellidos: '',
    cedula: '',
    sexo: '',
    edad: '',
    email: '',
    telefono: '',
    nacimiento: '',
    tallaCamisa: '',
lateralidad: '',
    nombreEmergencia: '',
    telefonoEmergencia: '',
    parentescoEmergencia: '',
    beneficiarioPoliza: '',
    metodoPago: '',
    aceptarTerminos: false,
    discapacidad: '',
    tipoDiscapacidad: '',
    alergiaMedicamento: '',
    medicamentoAlergia: '',
    pais: '',
    evento: '',
    codigoComprobante: '',
  };

  const [formData, setFormData] = useState(initialFormData);
  const [eventoSeleccionado, setEventoSeleccionado] = useState<string | null>(null);
  const [carreras, setCarreras] = useState<Carrera[]>([]);
  const [carreraSeleccionada, setCarreraSeleccionada] = useState<Carrera | null>(null);

  useEffect(() => {
    const obtenerCarreras = async () => {
      const carrerasCollection = collection(db, 'Configuracion Carreeras');
      const snapshot = await getDocs(carrerasCollection);
      const carrerasData: Carrera[] = [];
      snapshot.forEach((doc) => {
        const carrera = doc.data() as Carrera;
        carrerasData.push(carrera);
      });
      setCarreras(carrerasData);
    };

    obtenerCarreras();
  }, []);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    if (name === 'nacimiento') {
      const edad = calcularEdad(value);
      setFormData({ ...formData, [name]: value, edad: edad.toString() });
    } else if (name === 'alergiaMedicamento' && value === 'si') {
      setFormData({ ...formData, [name]: value, medicamentoAlergia: '' });
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

  const carouselImages = [
    "\Carre.gif",
    "\Carreras Aventura (1).gif",
    "\Ca(1).gif",
  ];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await addFormDataToFirebase();
      console.log('Form Data:', formData);
    } catch (error) {
      console.error('Error adding form data to Firebase:', error);
    }

    // Reset the form data
    setFormData(initialFormData);
  };

  const addFormDataToFirebase = async () => {
    try {
      const docRef = await addDoc(collection(db, 'inscripciones'), formData);
      console.log('Form data added with ID: ', docRef.id);
    } catch (error) {
      console.error('Error adding form data: ', error);
      throw error;
    }
  };

  return (
    <div>
      <Navbar />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <div className="min-h-screen flex flex-col justify-center items-center" style={{ background: 'linear-gradient(to bottom right, #FFFFF, #B1CEE3)' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 'bold',marginBottom: '2rem', color: '#333', textAlign: 'center' }}>INSCRIPCIÓN A CARRERAS</h1>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', border: '1px solid #ddd', padding: '20px', borderRadius: '5px', boxShadow: '2px 2px 5px #ccc', fontFamily: 'Arial, sans-serif', maxWidth: '400px', textAlign: 'center' }}>
            <h2 style={{ fontWeight: 'bold', marginBottom: '1rem' }}>Sinpe Movil</h2>
            <p style={{ fontSize: '16px', lineHeight: '1.5', color: '#333', textAlign: 'justify' }}>
              Para inscribirse, puede realizar el pago a través de SINPE Móvil (al número 87460160, a nombre de Pamela Barrantes) o mediante transferencia bancaria (cuenta en colones IBAN CR0000000000000000000000000, a nombre de Carreras Aventura S.A). Complete el formulario adjunto, incluyendo el número de comprobante del SINPE, y envíelo. Recibirá una confirmación por correo electrónico. Su solicitud pasará al departamento de confirmaciones de pago, donde se verificará la validez del pago. Posteriormente, recibirá otra confirmación de su participación en la carrera seleccionada.
            </p>
          </div>
          <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', border: '1px solid #ddd', padding: '20px', borderRadius: '5px', boxShadow: '2px 2px 5px #ccc', fontFamily: 'Arial, sans-serif', maxWidth: '400px', textAlign: 'center' }}>
            <h2 style={{ fontWeight: 'bold', marginBottom: '1rem' }}>Patrocinador</h2>
            <p style={{ fontSize: '16px', lineHeight: '1.5', color: '#333', textAlign: 'justify' }}>
              Si su pago es realizado por un patrocinador, por favor seleccione esta opción y complete el campo correspondiente con el nombre del mismo. Una vez completado, envíe los datos a través del formulario proporcionado. Recibirá un correo electrónico de confirmación indicando que sus datos han sido recibidos correctamente. Su solicitud será gestionada por nuestro departamento de confirmaciones de pago. Será notificado por correo electrónico una vez que su patrocinador haya efectuado el pago correctamente. Una vez confirmado el pago, estará oficialmente inscrito y podrá participar en la carrera que ha seleccionado.
            </p>
          </div>
        </div>
        <br />
        <br />
        <br />
        <br />
        <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '2rem', color: '#333', textAlign: 'center' }}>Formulario:</h1>
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: '1200px' }}>
          <form onSubmit={handleSubmit} style={{ width: '45%', marginRight: '5%' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <h1 style={{ fontWeight: 'bold', marginBottom: '40px' }}>Datos Personales:</h1>

              <div style={{ marginBottom: '20px' }}>
                <label htmlFor="nombre" style={{ display: 'inline-block', width:'150px' }}>Nombre:</label>
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
                  <option value="">Seleccione</option>
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
                  <option value="">Seleccione</option>
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
                  <option value="">Seleccione</option>
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
                  <option value="">Seleccione</option>
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
                  <option value="">Seleccione</option>
                  <option value="no">No</option>
                  <option value="si">Sí</option>
                </select>
              </div>

              {formData.discapacidad === 'si' && (
                <div style={{ marginBottom: '20px' }}>
                  <label htmlFor="tipoDiscapacidad" style={{ display: 'inline-block', width: '150px' }}>Tipo deDiscapacidad:</label>
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
                  <option value="">Seleccione</option>
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
                    value={formData.medicamentoAlergia}
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

            <div style={{ marginBottom: '20px' }}>
              <label htmlFor="evento" style={{ display: 'inline-block', width: '150px' }}>Carreras Disponibles:</label>
              <select
                id="evento"
                name="evento"
                value={formData.evento}
                onChange={(event) => {
                  handleInputChange(event);
                  const carrera = carreras.find(carrera => carrera.nombre === event.target.value);
                  if (carrera) {
                    setCarreraSeleccionada(carrera);
                  }
                }}
                required
                style={{ display: 'inline-block' }}
              >
                <option value="">Selecciona una carrera</option>
                {carreras
                  .filter(carrera => parseInt(carrera.cupoDisponible) > 0)
                  .map((carrera, index) => (
                    <option key={index} value={carrera.nombre}>{carrera.nombre}</option>
                  ))}
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
                <option value="">Seleccione</option>
                <option value="sinpe">Sinpe</option>
                <option value="Patrocinador">Patrocinador</option>
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

          </form>
        </div>
      </div>
    </div>
  );
}