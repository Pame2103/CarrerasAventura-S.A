'use client'
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { db } from '../../../../firebase/firebase';
import { collection, onSnapshot, addDoc } from 'firebase/firestore';
import {
  faCog,
  faChartBar,
  faHistory,
  faMoneyCheckAlt,
  faEnvelope,
  faFileExcel ,
} from '@fortawesome/free-solid-svg-icons';
import ExcelJS from 'exceljs';
interface Participante {
  id: string;
  nombreCarrera: string;
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
  cupoDisponible: string; 
  limiteParticipante: string;
}

function ListaParticipantes(): JSX.Element {
  const [eventoSeleccionado, setEventoSeleccionado] = useState<string>('Todos');
  const [participantes, setParticipantes] = useState<Participante[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const inscripcionesCollection = collection(db, 'listaparticipantes');
  
    const unsubscribe = onSnapshot(inscripcionesCollection, (snapshot) => {
      const inscripcionesData = snapshot.docs.map((doc) => doc.data() as Participante);
      setParticipantes(inscripcionesData);
      setLoading(false);
    });
  
    return () => unsubscribe();
  }, []);

  const handleAprobar = async (id: string) => {
    const updatedParticipantes = participantes.map(participante => {
      if (participante.id === id) {
        return { ...participante, estado: 'Aprobado' };
      }
      return participante;
    });
    setParticipantes(updatedParticipantes);

    // Agregar lógica para cargar los datos actualizados a Firebase
    try {
      await addDoc(collection(db, 'listaparticipantes'), participantes.find(p => p.id === id));
      console.log('Datos actualizados en la colección listaparticpantes.');
    } catch (error) {
      console.error('Error al agregar datos a Firebase:', error);
    }
  };

  const handleRechazar = async (id: string) => {
    const updatedParticipantes = participantes.map(participante => {
      if (participante.id === id) {
        return { ...participante, estado: 'Rechazado' };
      }
      return participante;
    });
    setParticipantes(updatedParticipantes);

    // Agregar lógica para cargar los datos actualizados a Firebase
    try {
      await addDoc(collection(db, 'listaparticpantes'), participantes.find(p => p.id === id));
      console.log('Datos actualizados en la colección listaparticpantes.');
    } catch (error) {
      console.error('Error al agregar datos a Firebase:', error);
    }
  };



  // Filtrar participantes según el evento seleccionado
  const filteredParticipantes = eventoSeleccionado === 'Todos' ? participantes : participantes.filter(participante => participante.evento === eventoSeleccionado);

  const eventos = Array.from(new Set(participantes.map(participante => participante.evento)) || []);

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Participantes');

    // Definir encabezados con todos los campos disponibles en la colección
    const headers = [
      'Nombre Carrera',
      'Nombre',
      'Apellidos',
      'Cedula',
      'Sexo',
      'Edad',
      'Email',
      'Confirmar Email',
      'Telefono',
      'Nacimiento',
      'Talla Camisa',
      'Lateralidad',
      'Nombre Emergencia',
      'Telefono Emergencia',
      'Parentesco Emergencia',
      'Provincia',
      'Total Monto',
      'Beneficiario Poliza',
      'Metodo Pago',
      'Guardar Datos',
      'Aceptar Terminos',
      'Discapacidad',
      'Tipo Discapacidad',
      'Alergia Medicamento',
      'Pais',
      'Evento',
      'Codigo Comprobante'
      
    ];
    worksheet.addRow(headers).font = { bold: true };

    participantes.forEach((participante) => {
      // Agregar todos los campos disponibles en la colección a cada fila
      worksheet.addRow([
        participante.nombreCarrera,
        participante.nombre,
        participante.apellidos,
        participante.cedula,
        participante.sexo,
        participante.edad,
        participante.email,
        participante.confirmarEmail,
        participante.telefono,
        participante.nacimiento,
        participante.tallaCamisa,
        participante.lateralidad,
        participante.nombreEmergencia,
        participante.telefonoEmergencia,
        participante.parentescoEmergencia,
        participante.provincia,
        participante.totalMonto,
        participante.beneficiarioPoliza,
        participante.metodoPago,
        participante.guardarDatos,
        participante.aceptarTerminos,
        participante.discapacidad,
        participante.tipoDiscapacidad,
        participante.alergiaMedicamento,
        participante.pais,
        participante.evento,
        participante.codigoComprobante
      ]);
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'participantes.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <nav className="bg-blue-700 p-4">
        <div className="container mx-auto">
          <ul className="flex space-x-20">
            <li>
              <FontAwesomeIcon icon={faCog} className="text-white" />
              <a href="/Admin/administradorcarreras" className="text-white">Administrar carreras</a>
            </li>  
            <li>
              <FontAwesomeIcon icon={faCog} className="text-white" /><a href="/Admin/configuraciones" className="text-white">Configuraciones</a>
            </li>
            <li>
              <FontAwesomeIcon icon={faChartBar} className="text-white" /><a href="/Admin/resultados" className="text-white">Resultados</a>
            </li>
            <li>
              <FontAwesomeIcon icon={faHistory} className="text-white" /><a href="/Admin/historicosadmi" className="text-white">Historicos</a>
            </li>
            <li>
              <FontAwesomeIcon icon={faHistory} className="text-white" /><a href="/Admin/administrarTiempos" className="text-white">Administrar tiempos</a>
            </li>
            <li>
              <FontAwesomeIcon icon={faMoneyCheckAlt} className="text-white" /><a href="/Admin/confirmaciones" className="text-white">Confirmacion de Pagos</a>
            </li> 
            <li>
              <FontAwesomeIcon icon={faEnvelope} className="text-white" /><a href="/Admin/listaParticipantes" className="text-white">Lista de Participantes </a>
            </li>
          </ul>
        </div>
      </nav>
      <div className="container mx-auto p-4">
        <h2 style={{ textAlign: 'center', fontSize: '2em', fontWeight: 'bold' }}>Comprobantes de Pago</h2>
        <div className="mb-4">
          <label htmlFor="evento">Seleccionar Evento:</label>
          <select 
            id="evento" 
            className="ml-2 p-2 border rounded" 
            value={eventoSeleccionado}
            onChange={(e) => setEventoSeleccionado(e.target.value)}
          >
            <option value="Todos">Todos</option>
            {eventos.map(evento => (
              <option key={evento} value={evento}>{evento}</option>
            ))}
          </select>
        </div>
        <button onClick={exportToExcel} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          <FontAwesomeIcon icon={faFileExcel} className="mr-2" />
          Exportar a Excel
        </button>
        <table className="table-center w-full border-collapse border border-gray-300 shadow-lg rounded-center">
          <thead style={{ backgroundColor: '#B1CEE3' }} className="">
            <tr>
              <th className="border px-4 py-2">Cedula</th>
              <th className="border px-4 py-2">Nombre</th>
              <th className="border px-4 py-2">Apellidos</th>
              <th className="border px-4 py-2">Evento</th>
            </tr>
          </thead>
          <tbody>
            {filteredParticipantes.length === 0 ? (
              <tr style={{ height: '600px' }}>
                <td colSpan={6} className="p-4 text-center" style={{ height: '600px' }}>
                  No hay participantes .
                </td>
              </tr>
            ) : (
              filteredParticipantes.map(participante => (
                <tr key={participante.id} className="hover:bg-gray-100">
                  <td className="border px-4 py-2">{participante.cedula}</td>
                  <td className="border px-4 py-2">{participante.nombre}</td>
                  <td className="border px-4 py-2">{participante.apellidos}</td>
                  <td className="border px-4 py-2">{participante.evento}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default ListaParticipantes;
