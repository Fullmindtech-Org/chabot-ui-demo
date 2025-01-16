import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { FaPaperPlane } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './App.css';


function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const chatBoxRef = useRef(null);

  const userAvatar = '👨🏻';  // Emoji para el usuario
  const botAvatar = '🤖';   // Emoji para el bot

  const convertToBoldHTML = (text) => {
    const boldText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    return { __html: boldText };
  };

  // URL del servidor Ollama
  const url = 'https://vps-4218186-x.dattaweb.com/chatbot/api/generate';
  // Función para manejar el envío de mensajes
  const sendMessage = () => {
    if (input.trim() === '') return;

    const newMessage = { text: input, sender: 'user' };
    setMessages([...messages, newMessage]);
    setInput('');

    // Respuesta del "bot"
    axios.post(url, {
      model: 'demo', // Cambiar nombre al modelo requerido
      prompt: input,
      stream: false,
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      const botMessage = { text: response.data?.response, sender: "bot" }
      setMessages(prevMessages => [...prevMessages, botMessage])
    })
    .catch(error => {
      console.error('Error en la solicitud:', error);
    });
  };

  // Función para manejar el evento de presionar Enter
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      sendMessage();
    }
  };

  // Efecto para hacer scroll hacia abajo cada vez que los mensajes cambian
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="app-container">
      {/* Header del chat */}
      <div className="chat-header">
        <div className="profile-pic">
          <img src="https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://fullmindtech.com.ar&size=40" alt="Bot Avatar" />
        </div>
        <div className="profile-info">
          <div className="profile-name">ACINDAR</div>
          <div className="status">
            <span className="status-dot"></span>
            <span className="status-text">En línea</span>
          </div>
        </div>
      </div>
      {/* Contenedor del chat */}
      <div className="chat-container">
        <div className="chat-box" ref={chatBoxRef}>
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender}-message`}>
              <div className="avatar">{msg.sender === 'user' ? userAvatar : botAvatar}</div>
              <div className="message-text" dangerouslySetInnerHTML={convertToBoldHTML(msg.text)}></div>
            </div>
          ))}
        </div>
        <div className="input-box">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribe un mensaje..."
          />
          <button onClick={sendMessage}>
            <FaPaperPlane />
          </button>
        </div>
      </div>
      {/* Footer del chat */}
      <footer className="bg-dark py-4 pb-0 footer-custom-background-color footer-custom-text-color">
      <div className="container-fluid p-0 d-flex flex-wrap align-items-center justify-content-evenly">
        <ul className="order-md-2 col my-3 px-4 d-flex flex-column align-items-center justify-content-center list-unstyled contact-data">
          <li className="my-2">
            <a
              className="d-flex align-items-center justify-content-center text-decoration-none text-light footer-custom-text-color"
              href="https://www.google.com/maps/search/?api=1&amp;query=Formosa+550%2C+Villa+Constitucion%2C+Santa+Fe"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fa-solid fa-map-marker-alt mx-2 text-light footer-custom-text-color"></i>
              <span className="mb-0">Formosa 550, Villa Constitucion, Santa Fe</span>
            </a>
          </li>
          <li className="my-2">
            <a
              className="d-flex align-items-center justify-content-center text-decoration-none text-light footer-custom-text-color"
              href="https://wa.me/+543400660788"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fa-brands fa-whatsapp mx-2 text-light footer-custom-text-color"></i>
              <span className="mb-0">+543400660788</span>
            </a>
          </li>
          <li className="my-2">
            <a
              className="d-flex align-items-center justify-content-center text-decoration-none text-light footer-custom-text-color"
              href="mailto:contacto@fullmindtech.com.ar"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fa-regular fa-envelope mx-2 text-light footer-custom-text-color"></i>
              <span className="mb-0">contacto@fullmindtech.com.ar</span>
            </a>
          </li>
        </ul>
      </div>
      <div className="col-12 text-center d-flex justify-content-center p-3">
        <div className="justify-content-center align-items-center d-flex">
          <p className="me-3 my-0 text-light footer-custom-text-color">
            © Desarrollado por Fullmindtech
          </p>
        </div>
      </div>
    </footer>
    </div>
  );
}

export default App;
