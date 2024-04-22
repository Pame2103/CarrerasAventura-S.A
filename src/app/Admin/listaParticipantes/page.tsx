'use client'
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { db } from '../../../../firebase/firebase';
import { collection, onSnapshot, addDoc, query, where, getDocs } from 'firebase/firestore';
import Link from 'next/link';
import { FaRunning, FaInfoCircle, FaDumbbell, FaEnvelope, FaTrophy, FaSignInAlt } from 'react-icons/fa';
import {
  faCog,
  faChartBar,
  faHistory,
  faMoneyCheckAlt,
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
                  <span className="text-gray-600 hover:text-gray-900 px-0 py-0 rounded-md text-sm font-medium flex items-center">
                    <FaTrophy className="mr-1" />Editar Carreras
                  </span>
                </Link>
                <Link href="/Admin/historicosadmin">
                  <span className="text-gray-600 hover:text-gray-900 px-0 py-0 rounded-md text-sm font-medium flex items-center">
                    <FaInfoCircle className="mr-1" /> Históricos
                  </span>
                </Link>
                <Link href="/Admin/listaParticipantes">
                  <span className="text-gray-600 hover:text-gray-900 px-0 py-0 rounded-md text-sm font-medium flex items-center">
                    <FaTrophy className="mr-1" /> Lista de Participantes
                  </span>
                </Link>
                <Link href="/Admin/record">
                  <span className="text-gray-600 hover:text-gray-900 px-0 py-0 rounded-md text-sm font-medium flex items-center">
                    <FaEnvelope className="mr-1" /> Records
                  </span>
                </Link>
                <Link href="/Admin/resultados">
                  <span className="text-gray-600 hover:text-gray-900 px-0 py-0 rounded-md text-sm font-medium flex items-center">
                    <FaEnvelope className="mr-1" /> Resultados
                  </span>
                </Link>
              </div>
            </div>
          </div>
          <div className="flex">
            <Link href="/Login" className="bg-blue-600 hover:bg-blue-700 text-white px-0 py-0 rounded-md font-medium flex items-center">
              <FaSignInAlt className="mr-1" /> Cerrar sesión
            </Link>
          </div>
        </div>
        <div className="ml-10 text-gray-600 text-sm font-medium">¡Corre hacia tus metas con Carrera Aventura! ¡Cruzando la meta juntos!</div>
      </div>
    </nav>
  );
}

function ListaParticipantes(): JSX.Element {
  const [eventoSeleccionado, setEventoSeleccionado] = useState<string>('Todos');
  const [participantes, setParticipantes] = useState<Participante[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [carreras, setCarreras] = useState<string[]>([]);

  useEffect(() => {
    const inscripcionesCollection = collection(db, 'listaparticipantes');
  
    const unsubscribe = onSnapshot(inscripcionesCollection, (snapshot) => {
      const inscripcionesData = snapshot.docs.map((doc) => doc.data() as Participante);
      setParticipantes(inscripcionesData);
      setLoading(false);
    });
  
    return () => unsubscribe();
  }, []);

  const cargarCarreras = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'listaparticipantes'));
      const carrerasData = querySnapshot.docs.map(doc => doc.data().nombre);
      setCarreras(carrerasData);
    } catch (error) {
      console.error('Error al cargar las carreras:', error);
    }
  };

  useEffect(() => {
    cargarCarreras();
  }, []);

  const handleAprobar = async (id: string) => {
    const updatedParticipantes = participantes.map(participante => {
      if (participante.id === id) {
        return { ...participante, estado: 'Aprobado' };
      }
      return participante;
    });
    setParticipantes(updatedParticipantes);

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

    try {
      await addDoc(collection(db, 'listaparticpantes'), participantes.find(p => p.id === id));
      console.log('Datos actualizados en la colección listaparticpantes.');
    } catch (error) {
      console.error('Error al agregar datos a Firebase:', error);
    }
  };

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Participantes');
    const headers = [
      'Evento',
      'Nombre',
      'Apellidos',
      'Cedula',
      'Sexo',
      'Nacimiento',
      'Edad',
      'Email',
      'Telefono',
      'Pais',
      'Talla Camisa',
      'Lateralidad',
      'Discapacidad',
      'Tipo Discapacidad',
      'Alergia Medicamento',
      'Nombre Emergencia',
      'Telefono Emergencia',
      'Parentesco Emergencia',
      'Beneficiario Poliza',
    ];

    worksheet.addRow(headers).font = { bold: true };

    filteredParticipantes.forEach((participante) => { // Cambio aquí
      worksheet.addRow([
        participante.evento || '-',
        participante.nombre || '-',
        participante.apellidos || '-',
        participante.cedula,
        participante.sexo || '-',
        participante.nacimiento || '-',
        participante.edad || '-',
        participante.email || '-',
        participante.telefono || '-',
        participante.pais || '-',
        participante.tallaCamisa || '-',
        participante.lateralidad || '-',
        participante.discapacidad || '-',
        participante.tipoDiscapacidad || '-',
        participante.alergiaMedicamento || '-',
        participante.nombreEmergencia || '-',
        participante.telefonoEmergencia || '-',
        participante.parentescoEmergencia || '-',
        participante.beneficiarioPoliza || '-',
      ]).eachCell((cell) => {
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
      });
    });

    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'C0C0C0' },
    };

    worksheet.columns.forEach((column) => {
      if (column && typeof column.eachCell === 'function') {
        let max = 0;
        column.eachCell({ includeEmpty: true }, (cell) => {
          const length = cell.value ? String(cell.value).length : 10;
          if (length > max) {
            max = length;
          }
        });
        column.width = max < 10 ? 10 : max;
      }
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
  const filteredParticipantes = eventoSeleccionado === 'Todos' ? participantes : participantes.filter(participante => participante.evento === eventoSeleccionado);
  const eventos = Array.from(new Set(participantes.map(participante => participante.evento)) || []);

  return (
    <>
      <Navbar />
      <br />
      <br />
      <br />
      <div className="container mx-auto p-4">
        <h2 style={{ textAlign: 'center', fontSize: '2em', fontWeight: 'bold' }}>Lista de Participantes</h2>
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
              <tr>
                <td colSpan={4} className="text-center py-4">No hay participantes.</td>
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
