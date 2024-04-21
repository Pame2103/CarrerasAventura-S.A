import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Navbar from '@/app/componentes/navbar';
import {
  faFacebook,
  faTwitter,
  faInstagram,
  faLinkedin,
} from '@fortawesome/free-brands-svg-icons';


export default function Contact() {
  return (
    <div>
      <Navbar />
      <br />
      <br />
     <div className="container mx-auto p-4 text-center bg-blue-100">
        
        <h1 className="text-4xl font-bold mb-4 text-blue-900">Contáctanos</h1>
        <p className="text-lg mb-4 mx-auto max-w-xl">
          ¿Tienes alguna pregunta o comentario? ¡Estamos aquí para ayudarte!
        </p>

        <div className="flex justify-between mb-8">
          {/* Sección para la primera persona */}
          <div className="w-1/3 text-left"> {/* Cambié el ancho a 1/3 */}
            <h2 className="text-2xl font-bold mb-2 text-blue-900">Gabriela Alemán</h2>

            <a
              href="https://www.facebook.com/gaby.aleman.08?locale=es_LA"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500"
            >
              <FontAwesomeIcon icon={faFacebook} className="mr-2" />
              Facebook
            </a>
            <br />
            <a
              href="https://twitter.com/Gabriela_A31"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500"
            >
              <FontAwesomeIcon icon={faTwitter} className="mr-2" />
              Twitter
            </a>
            <br />
            <a
              href="https://www.instagram.com/gabyaleman08/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500"
            >
              <FontAwesomeIcon icon={faInstagram} className="mr-2" />
              Instagram
            </a> 
            <br />
            <a
              href="https://www.linkedin.com/in/gabriela-ramirez-aleman-54974a274/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500"
            >
              <FontAwesomeIcon icon={faLinkedin} className="mr-2" />
              LinkedIn
            </a>
          </div>

          {/* Sección para la segunda persona */}
          <div className="w-1/3 text-right pr-16"> {/* Cambié el ancho a 1/3 y añadí margen a la derecha */}
            <h2 className="text-2xl font-bold mb-2 text-blue-900">Pamela Barrantes</h2>
            <a
              href="https://www.facebook.com/gaby.aleman.08?locale=es_LA"
              
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500"
            >
              <FontAwesomeIcon icon={faFacebook} className="mr-2" />
              Facebook
            </a>
            <br />
            <a
              href="https://twitter.com/Gabriela_A31"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500"
            >
              <FontAwesomeIcon icon={faTwitter} className="mr-2" />
              Twitter
            </a>
            <br />
            <a
              href="https://www.instagram.com/gabyaleman08/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500"
            >
              <FontAwesomeIcon icon={faInstagram} className="mr-2" />
              Instagram
            </a> 
            <br />
            <a
              href="https://www.linkedin.com/in/gabriela-ramirez-aleman-54974a274/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500"
            >
              <FontAwesomeIcon icon={faLinkedin} className="mr-2" />
              LinkedIn
            </a>
          </div>
        </div>

        <p>
          También puedes contactarnos a través de nuestro correo electrónico:
        </p>
        <p className="text-blue-500 font-bold">
          gabyaleman52@gmail.com
          <br />
          barrantespamela@gmail.com
        </p>
      </div>   

    </div>
  )
}
