import React from 'react';
import { FaRunning, FaInfoCircle, FaDumbbell, FaEnvelope, FaTrophy, FaFileAlt, FaHistory, FaSignInAlt } from 'react-icons/fa';
import Link from 'next/link';

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
                <Link href="/">
                  <span className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center">
                    <FaRunning className="mr-1" /> Inicio
                  </span>
                </Link>
                <Link href="/Cliente/carreras">
                  <span className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center">
                    <FaInfoCircle className="mr-1" /> Carreras
                  </span>
                </Link>
                <Link href="/Cliente/Inscripciones">
                  <span className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center">
                    <FaDumbbell className="mr-1" /> Inscripciones
                  </span>
                </Link>
                <Link href="/Cliente/Historico">
                  <span className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center">
                    <FaTrophy className="mr-1" /> Histórico
                  </span>
                </Link>
                <Link href="/Cliente/resultados">
                  <span className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center">
                    <FaInfoCircle className="mr-1" /> Resultados
                  </span>
                </Link>
                <Link href="/Cliente/record">
                  <span className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center">
                    <FaTrophy className="mr-1" /> Records
                  </span>
                </Link>
                <Link href="/Cliente/Contact">
                  <span className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center">
                    <FaEnvelope className="mr-1" /> Contacto
                  </span>
                </Link>
              </div>
              <br />
              <br />
              <br />
            </div>
          </div>
          <div className="flex">
            <Link href="/Login" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium flex items-center">
              <FaSignInAlt className="mr-2" /> Cerrar sesión
            </Link>
          </div>
        </div>
        <div className="ml-10 text-gray-600 text-sm font-medium">¡Corre hacia tus metas con Carrera Aventura! ¡Cruzando la meta juntos!</div>
      </div>
    </nav>
  );
}

const Sidebar: React.FC<MenuItemProps> = ({ link, text, description }) => (
  <div className="flex flex-col items-start cursor-pointer group p-4 bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-300">
    <br />
    <Link href={link}>
      <span className="text-white group-hover:text-yellow-300 text-lg font-semibold">{text}</span>
    </Link>
    <span className="text-xs text-gray-300 group-hover:text-white">{description}</span>
  </div>
);

const EventCard: React.FC<EventCardProps> = ({ name, date, description }) => (
  <div className="border border-gray-300 p-4 rounded-md">
    <h3 className="text-lg font-semibold">{name}</h3>
    <p className="text-gray-500 text-sm mb-2">{new Date(date).toLocaleDateString()}</p>
    <p className="text-gray-700">{description}</p>
  </div>
);

const MainMenu: React.FC = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
  };

  return (
    <div className="flex">
       <br />
      <br />
      <br />
      <Navbar />
      <br />
      <br />
      <br />
      <nav className="bg-white p-10 w-1/4">
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <div className="flex flex-col space-y-4">
  <Sidebar link="/Admin/administradorCarreras" text="Administrar Carreras" description="" />
  <Sidebar link="/Admin/administrarTiempos" text="Administrar Tiempos" description="" />
  <Sidebar link="/Admin/carreras" text="Carreras" description="" />
  <Sidebar link="/Admin/confirmaciones" text="Confirmación de Pagos" description="" />
  <Sidebar link="/Admin/editarcarreras" text="Editar Carreras" description="" />
  <Sidebar link="/Admin/historicosadmin" text="Históricos" description="" />
  <Sidebar link="/Admin/listaParticipantes" text="Lista de Participantes" description="" />
  <Sidebar link="/Admin/record" text="Records" description="" />
  <Sidebar link="/Admin/resultados" text="Resultados" description="" />
</div>

      </nav>
      <div className="w-3/4 relative">
        <div className="container mx-auto p-10 text-center relative z-10">
        
          <p className="text-lg text-white-200 mb-4">
          
          <br />
      <br />
      <br />
      <br />
      <br />
      <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '2rem', color: '#333', textAlign: 'center' }}>Perfil Administrador</h1>
      <img src="\Git.gif" alt="Descripción de la imagen" className="mx-auto mb-8" />
      <br />
           
          </p>
          <div className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Próximos eventos */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface MenuItemProps {
  link: string;
  text: string;
  description: string;
}

interface EventCardProps {
  name: string;
  date: string;
  description: string;
}

export default MainMenu;
