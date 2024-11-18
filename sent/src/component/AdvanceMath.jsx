import React, { useState, useEffect, useRef } from 'react';
import "./Message.css"
const MessageApp = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isFirstMessage, setIsFirstMessage] = useState(true);
  const [countdown, setCountdown] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const startCountdown = () => {
    setCountdown(10);
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const newMessage = {
      id: Date.now(),
      text: inputText,
      status: 'sending',
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');
    setIsTyping(true);

    // Only first message has countdown and 10 second delay
    if (isFirstMessage) {
      startCountdown();
      await new Promise(resolve => setTimeout(resolve, 10000));
      setIsFirstMessage(false);
    } else {
      await new Promise(resolve => setTimeout(resolve, 500)); // Quick 0.5s delay for subsequent messages
    }
    
    setMessages(prev => 
      prev.map(msg => 
        msg.id === newMessage.id 
          ? { ...msg, status: 'sent' }
          : msg
      )
    );
    setIsTyping(false);

    // Show delivered status quickly after sent
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === newMessage.id 
            ? { ...msg, status: 'delivered' }
            : msg
        )
      );
    }, 300);
  };

  return (
    <div className="app-container">
      <div className="chat-container">
        <div className="messages">
          {messages.map((message) => (
            <div key={message.id} className="message">
              <div className="message-content">
                {message.text}
                <span className="timestamp">{message.timestamp}</span>
              </div>
              <div className="message-status">
                {message.status === 'sending' && (
                  <>
                    Sending...
                    {countdown !== null && <span className="countdown">{countdown}s</span>}
                  </>
                )}
                {message.status === 'sent' && '✓'}
                {message.status === 'delivered' && '✓✓'}
              </div>
            </div>
          ))}
         
          <div ref={messagesEndRef} />
        </div>
        <div className="input-container">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
          />
          <button onClick={handleSend}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default MessageApp;