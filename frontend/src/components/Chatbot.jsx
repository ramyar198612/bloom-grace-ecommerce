
import { useState } from 'react';
import { MessageCircle, X, Send, Bot, LoaderCircle } from 'lucide-react';
import api from '../services/api';

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! Welcome to Bloom & Grace. 🌸 How can I help you today?',
    },
  ]);
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();

    const userMessage = input.trim();

    if (!userMessage || loading) return;

    const history = messages.map((message) => ({
      role: message.role,
      content: message.content,
    }));

    setMessages((previous) => [
      ...previous,
      { role: 'user', content: userMessage },
    ]);

    setInput('');
    setLoading(true);

    try {
      const response = await api.post('/chatbot/', {
        message: userMessage,
        history,
      });

      setMessages((previous) => [
        ...previous,
        {
          role: 'assistant',
          content: response.data.reply,
        },
      ]);
    } catch (error) {
      console.error('Chatbot error:', error);

      setMessages((previous) => [
        ...previous,
        {
          role: 'assistant',
          content: 'Sorry, I am unable to respond right now. Please try again.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <div className="mb-4 flex h-[500px] w-[340px] max-w-[calc(100vw-48px)] flex-col overflow-hidden rounded-2xl border border-[#eadbd5] bg-white shadow-2xl">

          {/* Chat Header */}
          <div className="flex items-center justify-between bg-[#a66b65] p-4 text-white">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-white/20 p-2">
                <Bot size={22} />
              </div>

              <div>
                <h3 className="font-serif text-lg">
                  Bloom & Grace
                </h3>
                <p className="text-xs text-white/80">
                  AI Shopping Assistant
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="rounded-full p-2 transition hover:bg-white/20"
              aria-label="Close chatbot"
            >
              <X size={20} />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 space-y-4 overflow-y-auto bg-[#fffaf7] p-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === 'user'
                    ? 'justify-end'
                    : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[85%] whitespace-pre-wrap break-words rounded-2xl px-4 py-3 text-sm leading-6 ${
                    message.role === 'user'
                      ? 'rounded-br-sm bg-[#a66b65] text-white'
                      : 'rounded-bl-sm border border-[#eadbd5] bg-white text-[#49352f]'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-sm text-[#806b63]">
                <LoaderCircle size={17} className="animate-spin" />
                Bloom & Grace AI is typing...
              </div>
            )}
          </div>

          {/* Message Input */}
          <form
            onSubmit={handleSend}
            className="flex items-center gap-2 border-t border-[#eadbd5] bg-white p-3"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              disabled={loading}
              className="min-w-0 flex-1 rounded-full border border-[#eadbd5] px-4 py-3 text-sm outline-none focus:border-[#a66b65] disabled:opacity-60"
            />

            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="rounded-full bg-[#a66b65] p-3 text-white transition hover:bg-[#87534e] disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Send message"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}

      {/* Floating Chat Button */}
      <div className="flex justify-end">
        <button
          onClick={() => setIsOpen((previous) => !previous)}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-[#a66b65] text-white shadow-lg transition hover:scale-105 hover:bg-[#87534e]"
          aria-label={isOpen ? 'Close chatbot' : 'Open chatbot'}
        >
          {isOpen ? <X size={25} /> : <MessageCircle size={25} />}
        </button>
      </div>
    </div>
  );
}

export default Chatbot;
