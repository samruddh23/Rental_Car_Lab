import React, { useState, useEffect, useRef } from 'react';
import { sendSupportMessage, subscribeToSupportReplies } from '../services/socket';

export const SahayakChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'ApexDrive Sahayak 🤖',
      text: 'Namaste! I am ApexDrive Sahayak 🚗. Need help with Indian fleet availability, FASTag toll passes, or GST invoices?',
      timestamp: 'Just now'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const unsubscribe = subscribeToSupportReplies((reply) => {
      setMessages((prev) => [...prev, reply]);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSend = (textToSend) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg = {
      id: 'user-' + Date.now(),
      sender: 'You',
      text,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    sendSupportMessage({ sender: 'Customer', text });
    if (!textToSend) setInputText('');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-2xl flex items-center gap-2.5 transition transform hover:scale-105 border-2 border-white/40"
          title="Open Real-Time Sahayak Support (Experiment 9 WebSockets)"
        >
          <span className="text-xl">🚗</span>
          <span className="text-xs font-bold uppercase tracking-wider pr-1">Apex Sahayak 💬</span>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
        </button>
      )}

      {/* Real-Time Chat Drawer */}
      {isOpen && (
        <div className="bg-white rounded-3xl w-80 sm:w-96 shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[480px] animate-in fade-in slide-in-from-bottom-6 duration-200">
          {/* Header */}
          <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-lg shadow-sm">
                🚗
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-black text-sm">ApexDrive Sahayak</h3>
                  <span className="text-[9px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.2 rounded font-bold uppercase">
                    Live
                  </span>
                </div>
                <p className="text-[10px] text-slate-400">Exp 9: Real-Time WebSocket Support</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white font-bold text-sm p-1"
            >
              ✕
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50 text-xs">
            {messages.map((m) => {
              const isUser = m.sender === 'You';
              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <span className="text-[9px] text-slate-400 mb-0.5 px-1">{m.sender} • {m.timestamp}</span>
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl ${
                      isUser
                        ? 'bg-indigo-600 text-white rounded-br-none'
                        : 'bg-white text-slate-800 border border-slate-200 shadow-sm rounded-bl-none'
                    }`}
                  >
                    <p className="leading-relaxed">{m.text}</p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="p-2 bg-white border-t border-slate-100 flex gap-1.5 overflow-x-auto text-[10px]">
            <button
              onClick={() => handleSend('Tell me about FASTag')}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded-full whitespace-nowrap"
            >
              🛣️ FASTag Rules
            </button>
            <button
              onClick={() => handleSend('Is GST invoice provided?')}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded-full whitespace-nowrap"
            >
              📄 GST Invoice
            </button>
            <button
              onClick={() => handleSend('How is security deposit refunded?')}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded-full whitespace-nowrap"
            >
              💰 Deposit Refund
            </button>
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-white border-t border-slate-100 flex gap-2"
          >
            <input
              type="text"
              placeholder="Ask Sahayak about fleet, tolls..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600"
            />
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-sm"
            >
              ➤
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default SahayakChat;
