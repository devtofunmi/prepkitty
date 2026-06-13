
import React, { useRef, useEffect } from 'react';
import { Bot, User as UserIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface ChatViewProps {
  conversationHistory: Array<{ role: string; parts: string }>;
}

const ChatView: React.FC<ChatViewProps> = ({ conversationHistory }) => {
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversationHistory]);

  const formatMessage = (text: string) => {
    const formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong class="font-black">$1</strong>');
    return <div dangerouslySetInnerHTML={{ __html: formattedText.replace(/\n/g, '<br />') }} />;
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 text-left font-sans pb-10 overflow-hidden">
      {conversationHistory.map((msg, index) => (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          key={index}
          className={`flex w-full min-w-0 items-start gap-4 ${msg.role === 'User' ? 'flex-row-reverse' : ''}`}
        >
          {msg.role === 'AI' ? (
             <div className="w-11 h-11 rounded-2xl bg-blue-600 border border-blue-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-600/20">
                <Bot size={20} className="text-white" />
             </div>
          ) : (
             <div className="w-11 h-11 rounded-2xl bg-slate-950 flex items-center justify-center flex-shrink-0 shadow-lg shadow-slate-950/15">
                <UserIcon size={20} className="text-white" />
             </div>
          )}

          <div 
            className={`min-w-0 max-w-[85%] overflow-hidden break-words [overflow-wrap:anywhere] px-6 py-4 rounded-3xl text-sm leading-relaxed shadow-sm ${
              msg.role === 'AI' 
                ? 'bg-white/90 border border-white text-slate-900 font-medium shadow-[0_14px_35px_rgba(15,23,42,0.08)]' 
                : 'bg-slate-950 text-white font-bold shadow-[0_14px_35px_rgba(15,23,42,0.16)]'
            }`}
          >
            {formatMessage(msg.parts)}
          </div>
        </motion.div>
      ))}
      <div ref={chatEndRef} />
    </div>
  );
};

export default ChatView;
