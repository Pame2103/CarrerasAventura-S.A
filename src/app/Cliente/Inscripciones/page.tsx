'use client'
import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';

import { collection, doc, DocumentData, DocumentReference, updateDoc, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../../../../firebase/firebase';


interface Carrera {
  id: string;
  evento: string;
  edicion: string;
  fecha: string;
  distancia: string;
  costo: string;
  responsable: string;
  contacto: string;
  cupo: number;
  nombre: string;
  cupoDisponible: string;
  limiteParticipante: string;
  Nombrepatrocinador: string;
  apellidosEmergencia: string;
  identificacionEmergencia:string;
  identificacionCedula: string;
  identificacion : string ;
  contactoEmergencia: string;
codigoPaisEmergencia: string;
categoria: string;
}


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
  cupoDisponible: string; 
  limiteParticipante: string;
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
  codigoPais: string;
  Nombrepatrocinador:string;
  apellidosEmergencia: string;
  identificacionEmergencia:string;
  identificacionCedula: string;
  identificacion : string ;
  contactoEmergencia: string;
  codigoPaisEmergencia: string;
  categoria: string;
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
  cupoDisponible: '',  // Cambiado el nombre de la propiedad a 'cupoDisponible'
  limiteParticipante: '',
  codigoPais:'',
  Nombrepatrocinador:'',
  apellidosEmergencia: '',
  identificacionEmergencia: '',
  identificacionCedula: '',
  identificacion : '',
  contactoEmergencia: '',
  codigoPaisEmergencia: '',
  categoria:'',
};

function Inscripción() {
  const [formData, setFormData] = useState<FormData>({ ...initialFormData });
  const [eventoSeleccionado, setEventoSeleccionado] = useState<string | null>(null);
  const [carreras, setCarreras] = useState<Carrera[]>([]);

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
  const [carreraSeleccionada, setCarreraSeleccionada] = useState<Carrera | null>(null);

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

  const addFormDataToFirebase = async (formData: FormData) => {
    try {
      const docRef = await addDoc(collection(db, 'Inscripciones'), formData);
      console.log('Form data added with ID: ', docRef.id);
    } catch (error) {
      console.error('Error adding form data: ', error);
      throw error;
    }
  };
  
  // Definir la función handleSubmit
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
  
    try {
      // Tu lógica para disminuir el cupo y otras acciones
  
      // Luego procede a enviar el formulario llamando a addFormDataToFirebase
      await addFormDataToFirebase(formData);
      console.log('Form Data:', formData);
    } catch (error) {
      console.error('Error adding form data to Firebase:', error);
    }
  
    // Restablecer el formulario
    setFormData({ ...initialFormData });
  };



  return (

    <>
      <div className="min-h-screen flex flex-col justify-center items-center" style={{ background: 'linear-gradient(to bottom right, #FFFFF, #B1CEE3)' }}>
        <br />
        <br />
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded absolute top-0 right-0 mt-4 mr-4"
          onClick={() => window.history.back()}
        >
          Volver
        </button>
        
        <h1>Si desea inscribirse pagando a través de SINPE Móvil (al número 87460160, a nombre de Pamela Barrantes) o mediante transferencia bancaria</h1>
        <h1>(cuenta en colones IBAN CR0000000000000000000000000), a nombre de (Carreras Aventura S.A),le solicitamos </h1>
        <h1>que complete el formulario adjunto.Asegúrese de incluir el número de comprobante del SINPE y haga clic en'Enviar'.Una vez enviado,recibirá   </h1>
        <h1>una confirmación por correo electrónico de que sus datos han sido recibidos correctamente. Su solicitud pasará al departamento de confirmaciones  </h1>
        <h1>pago donde uno de nuestros administradores verificará la validez de su pago. Posteriormente, recibirá un nuevo correo electrónico con la </h1>
        <h1>confirmación de su participación en la carrera que ha seleccionado. </h1>
        <br />
        <br />
        <h1>Si su pago es realizado por un patrocinador, por favor seleccione esta opción y complete el campo correspondiente con el nombre del mismo.</h1>
        <h1>Una vez completado, envíe los datos a través del formulario proporcionado. Recibirá un correo electrónico de confirmación indicando que sus </h1>
        <h1> datos han sido recibidos correctamente.Su solicitud será gestionada por nuestro departamento de confirmaciones de pago.Será notificado por</h1>
        <h1>correo electrónico una vez que su patrocinador haya efectuado el pago correctamente.Una vez confirmado el pago, estará oficialmente inscrito</h1>
        <h1>y podrá participar en la carrera que ha seleccionado.</h1>
        <h1></h1>
       
        <br />
        <br />
        <br />
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
        <label htmlFor="identificacion" style={{ display: 'inline-block', width: '150px' }}>Identificación:</label>
        <select
          id="identificacion"
          name="identificacion"
          value={formData.identificacion}
          onChange={handleInputChange}
          required
          style={{ display: 'inline-block' }}
        >
          <option value="">Seleccione</option>
          <option value="cedula">Cédula</option>
          <option value="pasaporte">Pasaporte</option>
        </select>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="ID" style={{ display: 'inline-block', width: '150px' }}>ID:</label>
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
  <label htmlFor="Pais" style={{ display: 'inline-block', width: '150px' }}>Pais:</label>
  <select
    id="pais"
    name="pais"
    value={formData.pais}
    onChange={handleInputChange}
    required
    style={{ display: 'inline-block' }}
  >
    <option value="">Seleccione un país</option>
    <optgroup label="África">
      <option value="Algeria">Argelia</option>
      <option value="Nigeria">Nigeria</option>
      <option value="Egypt">Egipto</option>
      <option value="South Africa">Sudáfrica</option>
      <option value="Kenya">Kenia</option>
    </optgroup>
    <optgroup label="América del Norte">
      <option value="Canada">Canadá</option>
      <option value="United States">Estados Unidos</option>
      <option value="Mexico">México</option>
      <option value="Cuba">Cuba</option>
      <option value="Haiti">Haití</option>
    </optgroup>
    <optgroup label="América Central">
      <option value="Guatemala">Guatemala</option>
      <option value="Costa Rica">Costa Rica</option>
      <option value="Panama">Panamá</option>
      <option value="El Salvador">El Salvador</option>
      <option value="Honduras">Honduras</option>
    </optgroup>
    <optgroup label="Caribe">
      <option value="Jamaica">Jamaica</option>
      <option value="Dominican Republic">República Dominicana</option>
      <option value="Trinidad and Tobago">Trinidad y Tobago</option>
      <option value="Barbados">Barbados</option>
      <option value="Bahamas">Bahamas</option>
    </optgroup>
    <optgroup label="América del Sur">
      <option value="Brazil">Brasil</option>
      <option value="Argentina">Argentina</option>
      <option value="Peru">Perú</option>
      <option value="Colombia">Colombia</option>
      <option value="Venezuela">Venezuela</option>
    </optgroup>
    <optgroup label="Asia">
      <option value="China">China</option>
      <option value="India">India</option>
      <option value="Japan">Japón</option>
      <option value="Indonesia">Indonesia</option>
      <option value="Saudi Arabia">Arabia Saudita</option>
    </optgroup>
    <optgroup label="Europa">
      <option value="Russia">Rusia</option>
      <option value="Germany">Alemania</option>
      <option value="United Kingdom">Reino Unido</option>
      <option value="France">Francia</option>
      <option value="Italy">Italia</option>
    </optgroup>
    <optgroup label="Oceanía">
      <option value="Australia">Australia</option>
      <option value="New Zealand">Nueva Zelanda</option>
      <option value="Fiji">Fiyi</option>
      <option value="Papua New Guinea">Papúa Nueva Guinea</option>
      <option value="Solomon Islands">Islas Salomón</option>
    </optgroup>
  </select>
</div>

<div style={{ marginBottom: '20px' }}>
  <label htmlFor="Codido telefonico" style={{ display: 'inline-block', width: '150px' }}>Codigo telefonico:</label>
  <select
    id="pais"
    name="pais"
    value={formData.pais}
    onChange={handleInputChange}
    required
    style={{ display: 'inline-block' }}
  >
         <option value="">Seleccione</option>
 
    <optgroup label="África">
      <option value="Algeria">Argelia (+213)</option>
      <option value="Nigeria">Nigeria (+234)</option>
      <option value="Egypt">Egipto (+20)</option>
      <option value="South Africa">Sudáfrica (+27)</option>
      <option value="Kenya">Kenia (+254)</option>
    </optgroup>
    <optgroup label="América del Norte">
      <option value="Canada">Canadá (+1)</option>
      <option value="United States">Estados Unidos (+1)</option>
      <option value="Mexico">México (+52)</option>
      <option value="Cuba">Cuba (+53)</option>
      <option value="Haiti">Haití (+509)</option>
    </optgroup>
    <optgroup label="América Central">
      <option value="Guatemala">Guatemala (+502)</option>
      <option value="Costa Rica">Costa Rica (+506)</option>
      <option value="Panama">Panamá (+507)</option>
      <option value="El Salvador">El Salvador (+503)</option>
      <option value="Honduras">Honduras (+504)</option>
    </optgroup>
    <optgroup label="Caribe">
      <option value="Jamaica">Jamaica (+1)</option>
      <option value="Dominican Republic">República Dominicana (+1)</option>
      <option value="Trinidad and Tobago">Trinidad y Tobago (+1)</option>
      <option value="Barbados">Barbados (+1)</option>
      <option value="Bahamas">Bahamas (+1)</option>
    </optgroup>
    <optgroup label="América del Sur">
      <option value="Brazil">Brasil (+55)</option>
      <option value="Argentina">Argentina (+54)</option>
      <option value="Peru">Perú (+51)</option>
      <option value="Colombia">Colombia (+57)</option>
      <option value="Venezuela">Venezuela (+58)</option>
    </optgroup>
    <optgroup label="Asia">
      <option value="China">China (+86)</option>
      <option value="India">India (+91)</option>
      <option value="Japan">Japón (+81)</option>
      <option value="Indonesia">Indonesia (+62)</option>
      <option value="Saudi Arabia">Arabia Saudita (+966)</option>
    </optgroup>
    <optgroup label="Europa">
      <option value="Russia">Rusia (+7)</option>
      <option value="Germany">Alemania (+49)</option>
      <option value="United Kingdom">Reino Unido (+44)</option>
      <option value="France">Francia (+33)</option>
      <option value="Italy">Italia (+39)</option>
    </optgroup>
    <optgroup label="Oceanía">
      <option value="Australia">Australia (+61)</option>
      <option value="New Zealand">Nueva Zelanda (+64)</option>
      <option value="Fiji">Fiyi (+679)</option>
      <option value="Papua New Guinea">Papúa Nueva Guinea (+675)</option>
      <option value="Solomon Islands">Islas Salomón (+677)</option>
    </optgroup>
  </select>
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
    <optgroup label="Femenino - Niños">
      <option value="F-N-XS">XS</option>
      <option value="F-N-S">S</option>
      <option value="F-N-M">M</option>
      <option value="F-N-L">L</option>
      <option value="F-N-XL">XL</option>
    </optgroup>
    <optgroup label="Femenino - Adolescentes">
      <option value="F-A-XS">XS</option>
      <option value="F-A-S">S</option>
      <option value="F-A-M">M</option>
      <option value="F-A-L">L</option>
      <option value="F-A-XL">XL</option>
    </optgroup>
    <optgroup label="Femenino - Adultos">
      <option value="F-AD-XS">XS</option>
      <option value="F-AD-S">S</option>
      <option value="F-AD-M">M</option>
      <option value="F-AD-L">L</option>
      <option value="F-AD-XL">XL</option>
      <option value="F-AD-XXL">XXL</option>
    </optgroup>
    <optgroup label="Masculino - Niños">
      <option value="M-N-XS">XS</option>
      <option value="M-N-S">S</option>
      <option value="M-N-M">M</option>
      <option value="M-N-L">L</option>
      <option value="M-N-XL">XL</option>
    </optgroup>
    <optgroup label="Masculino - Adolescentes">
      <option value="M-A-XS">XS</option>
      <option value="M-A-S">S</option>
      <option value="M-A-M">M</option>
      <option value="M-A-L">L</option>
      <option value="M-A-XL">XL</option>
    </optgroup>
    <optgroup label="Masculino - Adultos">
      <option value="M-AD-XS">XS</option>
      <option value="M-AD-S">S</option>
      <option value="M-AD-M">M</option>
      <option value="M-AD-L">L</option>
      <option value="M-AD-XL">XL</option>
      <option value="M-AD-XXL">XXL</option>
    </optgroup>
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
    <option value="ambidiestro">Ambidiestro</option>
  </select>
</div>
<div style={{ marginBottom: '20px' }}>
  <label htmlFor="discapacidad" style={{ display: 'inline-block', width: '150px' }}>Discapacidad:</label>
  <select
    id="discapacidad"
    name="discapacidad"
    value={formData.discapacidad}
    onChange={handleInputChange}
    required
    style={{ display: 'inline-block' }}
  >
    <option value="">Seleccione</option>
    <option value="No aplica">No aplica</option>
    <option value="sordo">Sordo</option>
    <option value="mudo">Mudo</option>
    <option value="autismo">Autismo</option>
    <option value="discapacidad física">Discapacidad física</option>
    <option value="discapacidad visual">Discapacidad visual</option>
    <option value="discapacidad auditiva">Discapacidad auditiva</option>
    <option value="discapacidad del habla">Discapacidad del habla</option>
    <option value="otra discapacidad">Otra discapacidad</option>
  </select>
</div>
<div style={{ marginBottom: '20px' }}>
  <label htmlFor="alergiaMedicamento" style={{ display: 'inline-block', width: '150px' }}>Alergia a Medicamento:</label>
  <select
    id="alergiaMedicamento"
    name="alergiaMedicamento"
    value={formData.alergiaMedicamento}
    onChange={handleInputChange}
    required
    style={{ display: 'inline-block' }}
  >
    <option value="">Seleccione</option>
    <option value="No aplica">No aplica</option>
    <option value="penicilina">Penicilina</option>
    <option value="aspirina">Aspirina</option>
    <option value="ibuprofeno">Ibuprofeno</option>
    <option value="amoxicilina">Amoxicilina</option>
    <option value="sulfamidas">Sulfamidas</option>
    <option value="codeína">Codeína</option>
 
    <option value="otroMedicamento">Otro medicamento</option>
  </select>
</div>

</div>
          </form>
          <form onSubmit={handleSubmit} style={{ width: '45%', marginLeft: '5%' }}>
          
          <h1 style={{ fontWeight: 'bold', marginBottom: '40px' }}>Contacto en caso de emeregencia y beneficiario:</h1>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
 
  <div style={{ marginBottom: '20px' }}>
    <label htmlFor="nombreEmergencia" style={{ display: 'inline-block', width: '150px' }}>Nombre Completo:</label>
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
  <label htmlFor="identificacionEmergencia" style={{ display: 'inline-block', width: '150px' }}>Identificación:</label>
  <select
    id="identificacionEmergencia"
    name="identificacionEmergencia"
    value={formData.identificacionEmergencia}
    onChange={handleInputChange}
    required
    style={{ display: 'inline-block' }}
  >
    <option value="">Seleccione</option>
    <option value="cedula">Cédula</option>
    <option value="pasaporte">Pasaporte</option>
  </select>
</div>


<div style={{ marginBottom: '20px' }}>
  <label htmlFor="identificacionCedula" style={{ display: 'inline-block', width: '150px' }}>ID:</label>
  <input
    type="text"
    id="identificacionCedula"
    name="identificacionCedula"
    value={formData.identificacionCedula}
    onChange={handleInputChange}
    required
    style={{ display: 'inline-block' }}
  />
</div>



<div style={{ marginBottom: '20px' }}>
  <label htmlFor="codigoPaisEmergencia" style={{ display: 'inline-block', width: '150px' }}>Código Pais:</label>
  <select
    id="codigoPaisEmergencia"
    name="codigoPaisEmergencia"
    value={formData.codigoPaisEmergencia}
    onChange={handleInputChange}
    required
    style={{ display: 'inline-block' }}
  >
    <option value="">Seleccione</option>
    <optgroup label="África">
      <option value="+213">Argelia (+213)</option>
      <option value="+234">Nigeria (+234)</option>
      <option value="+20">Egipto (+20)</option>
      <option value="+27">Sudáfrica (+27)</option>
      <option value="+254">Kenia (+254)</option>
    </optgroup>
    <optgroup label="América del Norte">
      <option value="+1">Canadá (+1)</option>
      <option value="+1">Estados Unidos (+1)</option>
      <option value="+52">México (+52)</option>
      <option value="+53">Cuba (+53)</option>
      <option value="+509">Haití (+509)</option>
    </optgroup>
    <optgroup label="América Central">
      <option value="+502">Guatemala (+502)</option>
      <option value="+506">Costa Rica (+506)</option>
      <option value="+507">Panamá (+507)</option>
      <option value="+503">El Salvador (+503)</option>
      <option value="+504">Honduras (+504)</option>
    </optgroup>
    <optgroup label="Caribe">
      <option value="+1">Jamaica (+1)</option>
      <option value="+1">República Dominicana (+1)</option>
      <option value="+1">Trinidad y Tobago (+1)</option>
      <option value="+1">Barbados (+1)</option>
      <option value="+1">Bahamas (+1)</option>
    </optgroup>
    <optgroup label="América del Sur">
      <option value="+55">Brasil (+55)</option>
      <option value="+54">Argentina (+54)</option>
      <option value="+51">Perú (+51)</option>
      <option value="+57">Colombia (+57)</option>
      <option value="+58">Venezuela (+58)</option>
    </optgroup>
    <optgroup label="Asia">
      <option value="+86">China (+86)</option>
      <option value="+91">India (+91)</option>
      <option value="+81">Japón (+81)</option>
      <option value="+62">Indonesia (+62)</option>
      <option value="+966">Arabia Saudita (+966)</option>
    </optgroup>
    <optgroup label="Europa">
      <option value="+7">Rusia (+7)</option>
      <option value="+49">Alemania (+49)</option>
      <option value="+44">Reino Unido (+44)</option>
      <option value="+33">Francia (+33)</option>
      <option value="+39">Italia (+39)</option>
    </optgroup>
    <optgroup label="Oceanía">
      <option value="+61">Australia (+61)</option>
      <option value="+64">Nueva Zelanda (+64)</option>
      <option value="+679">Fiyi (+679)</option>
      <option value="+675">Papúa Nueva Guinea (+675)</option>
      <option value="+677">Islas Salomón (+677)</option>
    </optgroup>
  </select>
</div>

<div style={{ marginBottom: '20px' }}>
  <label htmlFor="telefonoEmergencia" style={{ display: 'inline-block', width: '150px' }}>Teléfono:</label>
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
  <label htmlFor="parentescoEmergencia" style={{ display: 'inline-block', width: '130px', marginRight: '20px' }}>Parentesco:</label>
  <select
    id="parentescoEmergencia"
    name="parentescoEmergencia"
    value={formData.parentescoEmergencia}
    onChange={handleInputChange}
    required
    style={{ display: 'inline-block' }}
  >
    <option value="">Seleccione</option>
    <optgroup label="Grados de Consanguinidad">
      <option value="padre">Padre</option>
      <option value="madre">Madre</option>
      <option value="abuelo">Abuelo</option>
      <option value="abuela">Abuela</option>
      <option value="hermano">Hermano</option>
      <option value="hermana">Hermana</option>
      <option value="hijo">Hijo</option>
      <option value="hija">Hija</option>
      <option value="nieto">Nieto</option>
      <option value="nieta">Nieta</option>
      <option value="tio">Tío</option>
      <option value="tia">Tía</option>
      <option value="sobrino">Sobrino</option>
      <option value="sobrina">Sobrina</option>
      <option value="primo">Primo</option>
      <option value="prima">Prima</option>
      <option value="bisabuelo">Bisabuelo</option>
      <option value="bisabuela">Bisabuela</option>
      <option value="bisnieto">Bisnieto</option>
      <option value="bisnieta">Bisnieta</option>
      <option value="tatarabuelo">Tatarabuelo</option>
      <option value="tatarabuela">Tatarabuela</option>
      <option value="tataranieto">Tataranieto</option>
      <option value="tataranieta">Tataranieta</option>
    </optgroup>
    <optgroup label="Otros Parentescos">
      <option value="esposo">Esposo/a</option>
      <option value="amigo">Amigo/a</option>
      <option value="compañero_trabajo">Compañero/a de trabajo</option>
      <option value="vecino">Vecino/a</option>
      <option value="novio">Novio/a</option>
      <option value="compañero_estudio">Compañero/a de estudio</option>
      <option value="conocido">Conocido/a</option>
    </optgroup>
  </select>
</div>



</div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
  <h1 style={{ fontWeight: 'bold', marginBottom: '40px' }}>Evento en el que desea participar:</h1>

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

  <h1 style={{ fontWeight: 'bold', marginBottom: '40px' }}>Formas de pago:</h1>

  <div style={{ marginBottom: '20px' }}>
  <label htmlFor="metodoPago" style={{ display: 'inline-block', width: '150px' }}>Método de Pago:</label>
  <select
    id="metodoPago"
    name="metodoPago"
    value={formData.metodoPago}
    onChange={handleInputChange}
    required
    style={{ display: 'inline-block' }}
  >
    <option value="">Seleccione</option>
    <option value="sinpe">SINPE Móvil</option>
    <option value="Patrocinador">Patrocinador</option>
  </select>
</div>

{/* Render input field for sponsor's name if the payment method is "Patrocinador" */}
{formData.metodoPago === "Patrocinador" && (
  <div style={{ marginBottom: '20px' }}>
    <label htmlFor="Nombrepatrocinador" style={{ display: 'inline-block', width: '250px' }}>Nombre del patrocinador:</label>
    <input
      type="text"
      id="Nombrepatrocinador"
      name="Nombrepatrocinador"
      value={formData.Nombrepatrocinador}
      onChange={handleInputChange}
      required
      style={{ display: 'inline-block' }}
    />
  </div>
)}


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
