import React, { useState, useEffect } from 'react';
import websocketService from '../../services/webSocketService';
import Message from './newMessage';


interface MessageType {
  content: string;
  sender: string;
}

const Chat: React.FC = () => {
    const [messages, setMessages] = useState<MessageType[]>([]);
    const [input, setInput] = useState('');
  
    useEffect(() => {
      const handleMessage = (event: MessageEvent) => {
        const message: MessageType = JSON.parse(event.data);
        setMessages((prevMessages) => [...prevMessages, message]);
      };
  
      websocketService.websocket?.addEventListener('message', handleMessage);
  
      return () => {
        websocketService.websocket?.removeEventListener('message', handleMessage);
      };
    }, []);
  
    const handleSend = () => {
      const message: MessageType = { content: input, sender: 'user' };
      setMessages([...messages, message]);
      websocketService.sendMessage(message);
      setInput('');
    };
  
    return (
      <div className="chat-container">
        <div className="message-list">
          {messages.map((msg, index) => (
            <Message key={index} message={msg} />
          ))}
        </div>
        <div className="message-input">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
          />
          <button onClick={handleSend}>Send</button>
        </div>
      </div>
    );
  };
  
  export default Chat;