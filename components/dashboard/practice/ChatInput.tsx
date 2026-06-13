
import React, { useState, useEffect } from 'react';
import { Loader2, ArrowUp, Mic } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatInputProps {
  userResponse: string;
  setUserResponse: (response: string) => void;
  isGenerating: boolean;
  isRecording: boolean;
  handleMicClick: () => void;
  sendUserResponse: () => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ userResponse, setUserResponse, isGenerating, isRecording, handleMicClick, sendUserResponse }) => {
  const [micPermission, setMicPermission] = useState<PermissionState | null>(null);
  const [micError, setMicError] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined' && navigator.permissions) {
      navigator.permissions.query({ name: 'microphone' as PermissionName }).then((permissionStatus) => {
        setMicPermission(permissionStatus.state);
        permissionStatus.onchange = () => {
          setMicPermission(permissionStatus.state);
        };
      });
    }
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRecording) {
      timer = setInterval(() => {
        setRecordingTime(prevTime => prevTime + 1);
      }, 1000);
    } else {
      setRecordingTime(0);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  const handleMicWithPermissionCheck = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setMicError("Microphone not detected.");
      return;
    }

    if (micPermission === 'denied') {
      setMicError("Access denied. Check settings.");
      return;
    }

    if (micPermission === 'prompt') {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch {
        setMicError("Access denied.");
        return;
      }
    }
    
    handleMicClick();
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 w-full flex justify-center pb-8 pt-4 px-6 lg:left-[280px] lg:w-[calc(100%-280px)] z-50 pointer-events-none">
      <div className="w-full max-w-4xl mx-auto pointer-events-auto">
        <AnimatePresence>
           {micError && (
             <motion.div 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: 10 }}
               className="mb-4 bg-red-50 text-red-500 text-[10px] font-black uppercase tracking-widest p-3 rounded-2xl border border-red-100 text-center shadow-xl"
             >
               {micError}
             </motion.div>
           )}
        </AnimatePresence>

        <div className="relative bg-white/90 border border-white rounded-[2rem] shadow-[0_24px_70px_rgba(15,23,42,0.18)] backdrop-blur-xl p-3 flex min-w-0 items-center gap-2">
          
          <button
            onClick={handleMicWithPermissionCheck}
            disabled={isGenerating}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
              isRecording 
                ? 'bg-red-500 text-white animate-pulse' 
                : 'bg-slate-100 text-slate-500 hover:text-slate-950 hover:bg-slate-200'
            } disabled:opacity-50`}
            title={isRecording ? 'Recording...' : 'Record voice'}
          >
            <Mic size={20} />
          </button>

          <textarea
            className="min-w-0 flex-1 p-4 bg-transparent rounded-2xl text-slate-900 font-bold text-sm focus:outline-none resize-none custom-scrollbar placeholder:text-slate-300"
            placeholder={isRecording ? "Listening..." : "Type your answer..."}
            value={userResponse}
            onChange={(e) => setUserResponse(e.target.value)}
            disabled={isGenerating}
            rows={1}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (!isGenerating) sendUserResponse();
              }
            }}
          />

          <div className="flex items-center gap-3 pr-2">
            {isRecording && (
              <span className="text-[10px] font-black text-red-500 tabular-nums">
                {`${Math.floor(recordingTime / 60).toString().padStart(2, '0')}:${(recordingTime % 60).toString().padStart(2, '0')}`}
              </span>
            )}
            
            <button
              onClick={sendUserResponse}
              disabled={isGenerating || (!userResponse.trim() && !isRecording)}
              className="w-14 h-14 rounded-full bg-slate-950 text-white transition-all flex items-center justify-center shadow-lg disabled:opacity-50 disabled:bg-slate-100 disabled:text-slate-300 transform hover:scale-105 active:scale-95"
            >
              {isGenerating ? <Loader2 className="animate-spin" size={20} /> : <ArrowUp size={20} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
