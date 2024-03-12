import React from 'react';
import Layout from '@/app/layout';

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

const upcomingEvents = [
  {
    name: 'Carrera de Montaña',
    date: '2023-12-15',
    description: 'Desafío en la montaña con increíbles paisajes.',
  },
  {
    name: 'Carrera Ecologica',
    date: '2024-01-10',
    description: 'Corre bajo la protección del medio ambiente.',
  },
  {
    name: 'Carrera Internacional',
    date: '2024-01-10',
    description: 'Corre con personas de todo el mundo.',
  },
];

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
    <Layout>
      <nav className="bg-blue-500 p-10">
        <div className="container mx-auto flex justify-center space-x-10">
          <MenuItem link="/administradorCarreras/administradorcarreras" text="Administrar Carreras" description="Gestiona las carreras programadas" />
          <MenuItem link="/configuraciones/configuraciones" text="Configuraciones" description="Configura ajustes generales" />
          <MenuItem link="/resultados/resultados" text="Resultados" description="Consulta los resultados de las carreras" />
          <MenuItem link="/historicosadmi/historicosadmi" text="Históricos" description="Revisa el historial de eventos" />
          <MenuItem link="/administrarTiempos/administrarTiempos" text="Administrar Tiempos" description="Controla los tiempos de las carreras" />
          <MenuItem link="/confirmacionesdepago/confirmaciones" text="Confirmación de Pagos" description="Verifica pagos realizados" />
          <MenuItem link="/listaParticipantes/listaParticipantes" text="Lista de Participantes" description="Visualiza la lista de participantes" />
        </div>
      </nav>
      <div className="container mx-auto p-10 text-center">
        <h1 className="text-2xl font-bold mb-4">CARRERA AVENTURA</h1>

        {/* Sección de Próximos Eventos */}
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">Próximos Eventos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingEvents.map((event, index) => (
              <EventCard key={index} {...event} />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

const MenuItem: React.FC<MenuItemProps> = ({ link, text, description }) => (
  <div className="flex flex-col items-center cursor-pointer group">
    <a href={link} className="text-white group-hover:text-yellow-300 flex items-center">
      <span className="text-sm">{text}</span>
    </a>
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

export default MainMenu;
