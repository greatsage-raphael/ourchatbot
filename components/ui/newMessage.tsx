import React from 'react';

interface MessageProps {
  message: {
    content: string;
    sender: string;
  };
}

const Message: React.FC<MessageProps> = ({ message }) => {
  return (
    <div className={`message ${message.sender}`}>
      <p>{message.content}</p>
      <span>{message.sender}</span>
    </div>
  );
};

export default Message;

