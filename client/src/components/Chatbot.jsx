import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { FiSend, FiMessageCircle, FiX, FiMinimize2 } from 'react-icons/fi';
import { PiGraduationCapFill } from 'react-icons/pi';
import { motion, AnimatePresence } from 'framer-motion';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your Marocademy assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    const userMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    
    try {
      // Make sure we're using the full URL and sending the data correctly
      const response = await axios.post('http://localhost:8000/api/chatbot/query', {
        query: userMessage.text,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      // Check if the response has the expected format
      const responseText = response.data.response || "I received your message but I'm not sure how to respond.";
      
      const botMessage = {
        id: messages.length + 2,
        text: responseText,
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message to chatbot:', error);
      
      // Create a more detailed error message for debugging
      let errorText = 'Sorry, I encountered an error. Please try again later.';
      
      // If we have a specific error message from the server, display it
      if (error.response && error.response.data && error.response.data.message) {
        console.log('Server error:', error.response.data.message);
        // In production, you might want to show a simplified message instead
        // errorText = `Server error: ${error.response.data.message}`;
      }
      
      const errorMessage = {
        id: messages.length + 2,
        text: errorText,
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Chatbot toggle button */}
      <motion.button
        onClick={toggleChatbot}
        className={`${
          isOpen ? 'hidden' : 'flex'
        } items-center justify-center w-14 h-14 rounded-full bg-primary text-white shadow-lg hover:shadow-[-6px_0px_12px_rgba(0,98,51,0.6)] transition-all duration-300`}
        aria-label="Open chatbot"
        animate={{
          scale: [1, 1.1, 1],
          y: [0, -5, 0]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          repeatType: "loop"
        }}
      >
        <div className="relative">
          <FiMessageCircle size={24} />
          <motion.div 
            className="absolute -top-2 -right-2"
            animate={{
              scale: [1, 1.2, 1],
              y: [0, -3, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              repeatType: "loop",
              delay: 0.5
            }}
          >
            <PiGraduationCapFill size={16} className="text-amber-400" />
          </motion.div>
        </div>
      </motion.button>

      {/* Chatbot window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-lg shadow-xl w-80 sm:w-96 h-[450px] flex flex-col overflow-hidden border border-neutral-200"
          >
            {/* Chatbot header */}
            <div className="bg-primary text-white p-4 flex justify-between items-center">
              <div className="flex items-center">
                <FiMessageCircle size={20} className="mr-2" />
                <h3 className="font-medium">Marocademy Assistant</h3>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleChatbot}
                  className="text-white hover:text-neutral-200 transition-colors"
                  aria-label="Minimize chatbot"
                >
                  <FiMinimize2 size={18} />
                </button>
                <button
                  onClick={toggleChatbot}
                  className="text-white hover:text-neutral-200 transition-colors"
                  aria-label="Close chatbot"
                >
                  <FiX size={18} />
                </button>
              </div>
            </div>

            {/* Chatbot messages */}
            <div className="flex-1 p-4 overflow-y-auto bg-neutral-50">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`mb-4 flex ${
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.sender === 'user'
                        ? 'bg-primary text-white rounded-tr-none'
                        : 'bg-white text-neutral-800 rounded-tl-none shadow-sm border border-neutral-200'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <span className="text-xs opacity-70 mt-1 block text-right">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start mb-4">
                  <div className="bg-white text-neutral-800 p-3 rounded-lg rounded-tl-none shadow-sm border border-neutral-200">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Chatbot input */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-neutral-200 bg-white">
              <div className="flex items-center">
                <input
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                  placeholder="Type your message..."
                  className="flex-1 py-2 px-3 border border-neutral-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  className="bg-primary text-white p-2 rounded-r-md hover:bg-primary-dark transition-colors"
                  disabled={isLoading || !inputValue.trim()}
                >
                  <FiSend size={20} />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Chatbot;
