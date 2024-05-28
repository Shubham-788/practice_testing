import React, { useState } from 'react';
import axios from 'axios';

// Define the interface for the message object
interface Message {
  id: number;
  message: string;
}

const MessageBox: React.FC = () => {
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);

  const handlePost = async () => {
    try {
      const response = await axios.post('http://localhost:3000/messages', { message });
      console.log('Message posted successfully');
      // Optionally, reset the input box after posting
      setMessage('');
    } catch (error) {
      console.error('Error posting message:', error);
    }
  };

  const handleGet = async () => {
    try {
      const response = await axios.get<Message[]>('http://localhost:3000/messages');
      setMessages(response.data);
      console.log('Messages retrieved successfully:', response.data);
    } catch (error) {
      console.error('Error retrieving messages:', error);
    }
  };

  return (
    <div>
      <h1>MessageBox</h1>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Enter your message"
      />
      <button onClick={handlePost}>Post</button>
      <button onClick={handleGet}>Get</button>
      <div>
        <h2>Messages:</h2>
        <ul>
          {messages.map((msg) => (
            <li key={msg.id}>{msg.message}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MessageBox;
