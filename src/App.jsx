import { useState, useRef, useEffect } from 'react';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [showChat, setShowChat] = useState(false);
  const chatContainerRef = useRef(null);
  const chatBoxRef = useRef(null);

  const userAvatar = '👨🏻';  // Emoji para el usuario
  const botAvatar = '🤖';   // Emoji para el bot

  // Función para manejar el envío de mensajes
  const sendMessage = () => {
    if (input.trim() === '') return;

    const newMessage = { text: input, sender: 'user' };
    setMessages([...messages, newMessage]);
    setInput('');

    // Respuesta automática del "bot"
    setTimeout(() => {
      const botMessage = { text: "Hola, ¿cómo puedo ayudarte?", sender: 'bot' };
      setMessages(prevMessages => [...prevMessages, botMessage]);
    }, 1000);
  };

  // Función para manejar el clic fuera del chat
  const handleClickOutside = (e) => {
    if (chatContainerRef.current && !chatContainerRef.current.contains(e.target)) {
      setShowChat(false);
    }
  };

  // Función para manejar el evento de presionar Enter
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      sendMessage();
    }
  };

  // Función para cerrar el chat manualmente con el botón
  const closeChat = () => {
    setShowChat(false);
  };

  useEffect(() => {
    if (showChat) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showChat]);

  // Efecto para hacer scroll hacia abajo cada vez que los mensajes cambian
  useEffect(() => {
    // Desplazamos hacia abajo el contenedor de mensajes
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="app-container">
       {/* Header */}
       <header className="header">
        <h1>Bienvenido a nuestro Chat</h1>
      </header>

      {/* Contenido principal */}
      <main className="main-content">
        <h2>Contenido adicional</h2>
        <p>Este es un contenido adicional. Puedes agregar aquí lo que desees.</p>
        <p>Por ejemplo, instrucciones o información sobre cómo utilizar el chat.</p>
      </main>

      {/* Burbuja flotante */}
      {!showChat && (
        <div className="chat-bubble" onClick={() => setShowChat(true)}>
          {botAvatar}
        </div>
      )}

      {/* Contenedor del chat */}
      {showChat && (
        <div className="chat-container" ref={chatContainerRef}>
          {/* Botón de cierre */}
          <button className="close-button" onClick={closeChat}>
            ✖
          </button>

          <div className="chat-box" ref={chatBoxRef}>
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender}-message`}>
                <div className="avatar">{msg.sender === 'user' ? userAvatar : botAvatar}</div>
                <div className="message-text">{msg.text}</div>
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
            <button onClick={sendMessage}>Enviar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
