import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { FaPaperPlane } from 'react-icons/fa';
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
  const url = 'http://localhost:11434/api/generate';
  // Función para manejar el envío de mensajes
  const sendMessage = () => {
    if (input.trim() === '') return;

    const newMessage = { text: input, sender: 'user' };
    setMessages([...messages, newMessage]);
    setInput('');

    // Respuesta del "bot"
    axios.post(url, {
      model: 'demo2', // Cambiar nombre al modelo requerido
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
          <img src="https://via.placeholder.com/40" alt="Bot Avatar" />
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
    </div>
  );
}

export default App;