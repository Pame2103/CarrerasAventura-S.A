import React from 'react'

export default function Main() {
    const images = ['/25Aniversario.png', '/FECODEM.png', '/RECORRIDO.png']

    const upcomingEvents = [
        {
            name: 'Carrera de Montaña',
            date: '2023-12-15',
            description: 'Desafío en la montaña con increíbles paisajes.',
        },
        {
            name: 'Carrera Ecologica',
            date: '2024-01-10',
            description: 'Corre bajo la proteccin del medio ambiente.',
        },
        {
            name: 'Carrera Internacional',
            date: '2024-01-10',
            description: 'Corre con personas de todo el mundo.',
        },
    ]

    return (
        <div>
            <nav className="bg-blue-700 p-4">
                <div className="container mx-auto flex justify-center space-x-4">
                    {images.map((image, index) => (
                        <img
                            key={index}
                            src={image}
                            alt={`Imagen ${index}`}
                            className="h-32"
                        />
                    ))}
                </div>
            </nav>
            <div className="container mx-auto p-4 text-center">
                <h1 className="text-2xl font-bold mb-4">CARRERA AVENTURA</h1>

                {/* Sección de Próximos Eventos */}
                <div className="my-8">
                    <h2 className="text-xl font-bold mb-4">Próximos Eventos</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {upcomingEvents.map((event, index) => (
                            <div key={index} className="bg-gray-200 p-4 rounded-lg">
                                <h3 className="text-lg font-bold mb-2">{event.name}</h3>
                                <p className="text-gray-600 mb-2">{event.date}</p>
                                <p>{event.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}