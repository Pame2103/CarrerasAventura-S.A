import React from 'react';

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
      {/* Sidebar */}
      <nav className="bg-blue-500 p-10 w-1/4">
        <div className="flex flex-col space-y-4">
          <Sidebar link="/Admin/administradorCarreras" text="Administrar Carreras" description="" />
          <Sidebar link="/Admin/configuraciones" text="Configuraciones" description="" />
          <Sidebar link="/Admin/resultados" text="Resultados" description="" />
          <Sidebar link="/Admin/historicosadmin" text="Históricos" description="" />
          <Sidebar link="/Admin/administrarTiempos" text="Administrar Tiempos" description="" />
          <Sidebar link="/Admin/confirmaciones" text="Confirmación de Pagos" description="" />
          <Sidebar link="/Admin/carreras" text="Carreras" description="" />
          <Sidebar link="/Admin/listaParticipantes" text="Lista de Participantes" description="" />
        </div>
      </nav>
      
      {/* Main Content */}
      <div className="w-3/4 relative">
        {/* Background image with transparency */}
        <div className="bg-cover bg-center absolute inset-0" style={{ backgroundImage: `url('/carrerasfondo.jpg')`, opacity: 0.8 }}></div>
        {/* Main content */}
        <div className="container mx-auto p-10 text-center relative z-10">
          <h1 className="text-2xl font-bold mb-4 text-white">Perfil Administrador</h1>
          <br />
          <br />
          {/* Description */}
          <p className="text-lg text-gray-200 mb-4">
            El perfil de administrador en una carrera de atletismo desempeña un papel crucial en la planificación, organización y ejecución del evento. Esto incluye la coordinación con proveedores, la gestión de inscripciones de participantes, la asignación de recursos, la seguridad del evento y la supervisión de la logística durante todo el proceso. Además, el administrador es responsable de garantizar que todas las actividades se desarrollen de manera eficiente y segura, con el objetivo final de proporcionar una experiencia positiva tanto para los participantes como para los espectadores.
          </p>

          {/* Sección de Próximos Eventos */}
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

const Sidebar: React.FC<MenuItemProps> = ({ link, text, description }) => (
  <div className="flex flex-col items-start cursor-pointer group p-4 bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-300">
    <a href={link} className="text-white group-hover:text-yellow-300 text-lg font-semibold">{text}</a>
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
