import React, { useState, useEffect, useRef } from 'react';
import { AlertCircle, ArrowRight, Bot, BrainCircuit, CheckCircle2, Loader2, MessageSquare, Mic2, Volume2, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import PracticeModeSwitcher from './PracticeModeSwitcher';
import ChatView from './ChatView';
import QuizView from './QuizView';
import ChatInput from './ChatInput';
import ActionResult from './ActionResult';
import ChatActionResult from './ChatActionResult';


// Minimal SpeechRecognition type for browser compatibility
interface SpeechRecognition extends EventTarget {
  start(): void;
  stop(): void;
  abort(): void;
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: SpeechRecognitionEventType) => void) | null;
  onerror: ((event: Event) => void) | null;
  onend: ((event: Event) => void) | null;
}
declare global {
  interface Window {
    SpeechRecognition: {
      new (): SpeechRecognition;
    };
    webkitSpeechRecognition: {
      new (): SpeechRecognition;
    };
  }
}

type SpeechRecognitionEventType = Event & {
  results: SpeechRecognitionResultList;
};


interface QuizData {
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: string;
}

interface WrongAnswer {
  question: string;
  yourAnswer: string;
  correctAnswer: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
}


interface User {
  id: string;
  name: string | null;
  practiceProfile: {
    jobTitle: string | null;
    jobDescription: string | null;
    employmentHistory: string | null;
    skills: string | null;
    additionalDetails: string | null;
  } | null;
}

interface MainContentProps {
  user: User;
  enableTTS?: boolean;
}

const MainContent: React.FC<MainContentProps> = ({ user, enableTTS = true }) => {
  const [practiceMode, setPracticeMode] = useState('chat'); // 'chat' or 'quiz'
  const [conversationHistory, setConversationHistory] = useState<Array<{ role: string; parts: string }>>([]);
  const [userResponse, setUserResponse] = useState('');
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [score, setScore] = useState(0);
  const [chatCompleted, setChatCompleted] = useState(false);
  const [currentQuestionNumber, setCurrentQuestionNumber] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [wrongAnswers, setWrongAnswers] = useState<WrongAnswer[]>([]);
  const [chatSummary, setChatSummary] = useState('');
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [practiceError, setPracticeError] = useState('');
  // Local state for toggling AI voice inside the chat modal. Initialized from prop.
  const [enableTTSState, setEnableTTSState] = useState<boolean>(enableTTS);

  const profileTitle = user.practiceProfile?.jobTitle || 'Interview role';
  const hasStarted =
    (practiceMode === 'chat' && conversationHistory.length > 0) ||
    (practiceMode === 'quiz' && (quizData !== null || quizCompleted));

  const getFriendlyAIError = (status?: number, apiMessage?: string) => {
    const normalizedMessage = apiMessage?.toLowerCase() || '';

    if (
      status === 429 ||
      normalizedMessage.includes('quota') ||
      normalizedMessage.includes('rate limit') ||
      normalizedMessage.includes('exceeded')
    ) {
      return 'The AI usage limit has been reached for now. Please try again later.';
    }

    if (status && status >= 500) {
      return 'The AI service is having trouble right now. Please try again in a few minutes.';
    }

    return 'The AI could not respond right now. Please try again.';
  };

  const showPracticeError = (message: string) => {
    setPracticeError(message);
    return message;
  };

  const handleAIResponseError = async (response: Response) => {
    const errorData = await response.json().catch(() => ({ message: '' }));
    const message = getFriendlyAIError(response.status, errorData?.message);
    console.error('AI request failed:', errorData);
    return showPracticeError(message);
  };


  useEffect(() => {
    setConversationHistory([]);
    setScore(0);
    setChatCompleted(false);
    setQuizCompleted(false);
    setCurrentQuestionNumber(0);
    setQuizData(null);
    setSelectedOption(null);
    setWrongAnswers([]);
    setChatSummary('');
    setPracticeError('');
    if (enableTTSState) stopSpeaking(); // Stop TTS when switching mode (only if TTS enabled)
  }, [practiceMode, enableTTSState]);

  const parseQuizResponse = (responseText: string): QuizData | null => {
    const questionMatch = responseText.match(/Question: (.*)/);
    const optionAMatch = responseText.match(/A\) (.*)/);
    const optionBMatch = responseText.match(/B\) (.*)/);
    const optionCMatch = responseText.match(/C\) (.*)/);
    const optionDMatch = responseText.match(/D\) (.*)/);
    const answerMatch = responseText.match(/Answer: ([A-D])/);

    if (questionMatch && optionAMatch && optionBMatch && optionCMatch && optionDMatch && answerMatch) {
      return {
        question: questionMatch[1].trim(),
        options: {
          A: optionAMatch[1].trim(),
          B: optionBMatch[1].trim(),
          C: optionCMatch[1].trim(),
          D: optionDMatch[1].trim(),
        },
        correctAnswer: answerMatch[1].trim(),
      };
    }
    return null;
  };

  const savePracticeResult = async (finalScore: number) => {
    try {
      const payload = {
        userId: user.id,
        mode: practiceMode,
        score: finalScore,
        totalQuestions: 10,
        jobTitle: user.practiceProfile?.jobTitle || '',
        jobDescription: user.practiceProfile?.jobDescription || '',
      };
      const response = await fetch('/api/save-practice-result', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success('Practice result saved!');
      } else {
        toast.error('Failed to save practice result.');
      }
    } catch {
      toast.error('Error saving practice result.');
    }
  };

  const getChatSummary = async (history: Array<{ role: string; parts: string }>) => {
    setIsSummarizing(true);
    setPracticeError('');
    try {
      const payload = {
        jobTitle: user.practiceProfile?.jobTitle || '',
        jobDescription: user.practiceProfile?.jobDescription || '',
        skills: user.practiceProfile?.skills || '',
        employmentHistory: user.practiceProfile?.employmentHistory || '',
        additionalDetails: user.practiceProfile?.additionalDetails || '',
        mode: 'summarize_chat',
        conversationHistory: history,
      };
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        setChatSummary(data.response);
      } else {
        const message = await handleAIResponseError(response);
        setChatSummary(message);
      }
    } catch {
      const message = showPracticeError('The AI could not create your review. Please try again later.');
      setChatSummary(message);
    } finally {
      setIsSummarizing(false);
      setChatCompleted(true);
    }
  };

  const startInterview = async () => {
    setIsGenerating(true);
    setPracticeError('');
    setConversationHistory([]);
    setQuizData(null);
    setSelectedOption(null);
    setScore(0);
    setCurrentQuestionNumber(0);
    setQuizCompleted(false);
    setWrongAnswers([]);
    setChatSummary('');
    if (practiceMode === 'chat') {
      setChatCompleted(false);
    }

    const payload = {
      jobTitle: user.practiceProfile?.jobTitle || '',
      jobDescription: user.practiceProfile?.jobDescription || '',
      skills: user.practiceProfile?.skills || '',
      employmentHistory: user.practiceProfile?.employmentHistory || '',
      additionalDetails: user.practiceProfile?.additionalDetails || '',
      mode: practiceMode,
      numberOfQuestions: 10,
      conversationHistory: [],
    };

    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        if (practiceMode === 'chat') {
          setConversationHistory([{ role: 'AI', parts: data.response }]);
          if (enableTTSState) speak(data.response);
        } else if (practiceMode === 'quiz') {
          const parsedQuiz = parseQuizResponse(data.response);
          if (parsedQuiz) {
            setQuizData(parsedQuiz);
          } else {
            console.error('Failed to parse quiz response:', data.response);
            showPracticeError('The AI sent a quiz question we could not read. Please try again.');
          }
        }
      } else {
        await handleAIResponseError(response);
      }
    } catch (err) {
      console.error('Network error:', err);
      showPracticeError('The AI could not connect. Please check your connection and try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  const speak = (text: string): Promise<void> => {
    return new Promise((resolve) => {
      stopSpeaking();
      if ('speechSynthesis' in window && enableTTSState) {
        const utter = new window.SpeechSynthesisUtterance(text);
        utter.onend = () => resolve();
        utter.onerror = () => resolve(); // Resolve even on error
        window.speechSynthesis.speak(utter);
      } else {
        resolve(); // Resolve immediately if TTS is disabled or not available
      }
    });
  };

  const handleMicClick = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      toast.error('Speech recognition not supported in this browser.');
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!recognitionRef.current) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';
      recognitionRef.current.onresult = (event: SpeechRecognitionEventType) => {
        const transcript = event.results[0][0].transcript;
        setUserResponse(transcript);
        setIsRecording(false);
      };
      recognitionRef.current.onerror = () => {
        setIsRecording(false);
      };
      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }
    setIsRecording(true);
    recognitionRef.current.start();
  };

  const sendUserResponse = async () => {
    if (!userResponse.trim() && practiceMode === 'chat') return;
    if (!selectedOption && practiceMode === 'quiz') return;

    setIsGenerating(true);
    setPracticeError('');
    let updatedHistory = [...conversationHistory];
    let currentResponse = '';

    if (practiceMode === 'chat') {
      updatedHistory = [...conversationHistory, { role: 'User', parts: userResponse }];
      currentResponse = userResponse;
      setUserResponse('');
      if (updatedHistory.filter(msg => msg.role === 'User').length >= 10) {
        const finalHistory = [...updatedHistory, { role: 'AI', parts: "The interview has now concluded. Thank you for your time." }];
        setConversationHistory(finalHistory);
        await speak("The interview has now concluded. Thank you for your time.");
        getChatSummary(finalHistory);
        setIsGenerating(false);
        savePracticeResult(score);
        return;
      }
    } else if (practiceMode === 'quiz' && quizData && selectedOption) {
      const isCorrect = selectedOption === quizData.correctAnswer;
      let finalScore = score;

      if (isCorrect) {
        finalScore = score + 1;
        setScore(finalScore);
      } else {
        setWrongAnswers(prev => [...prev, {
          question: quizData.question,
          yourAnswer: quizData.options[selectedOption as keyof typeof quizData.options],
          correctAnswer: quizData.options[quizData.correctAnswer as keyof typeof quizData.options],
          options: quizData.options,
        }]);
      }

      if (currentQuestionNumber + 1 === 10) {
        setQuizCompleted(true);
        setIsGenerating(false);
        savePracticeResult(finalScore);
        return;
      }
    }

    setConversationHistory(updatedHistory);

    const payload = {
      jobTitle: user.practiceProfile?.jobTitle || '',
      jobDescription: user.practiceProfile?.jobDescription || '',
      skills: user.practiceProfile?.skills || '',
      employmentHistory: user.practiceProfile?.employmentHistory || '',
      additionalDetails: user.practiceProfile?.additionalDetails || '',
      mode: practiceMode,
      numberOfQuestions: 10,
      conversationHistory: updatedHistory,
      userResponse: currentResponse,
    };

    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        if (practiceMode === 'chat') {
          const finalHistory = [...updatedHistory, { role: 'AI', parts: data.response }];
          setConversationHistory(finalHistory);
          
          const endInterviewPhrases = [
            "interview has now concluded",
            "not interested in continuing",
            "end the interview"
          ];

          if (endInterviewPhrases.some(phrase => data.response.toLowerCase().includes(phrase))) {
            await speak(data.response);
            getChatSummary(finalHistory);
            savePracticeResult(score);
            setIsGenerating(false);
            return;
          } else {
            speak(data.response);
          }

          if (/\b(correct|good job|well done|excellent|right answer)\b/i.test(data.response)) {
            setScore(prevScore => prevScore + 1);
          }

        } else if (practiceMode === 'quiz') {
          if (currentQuestionNumber + 1 >= 10) {
            setQuizCompleted(true);
            savePracticeResult(score);
          } else {
            const parsedQuiz = parseQuizResponse(data.response);
            if (parsedQuiz) {
              setQuizData(null);
              setSelectedOption(null);
              setTimeout(() => {
                setQuizData(parsedQuiz);
                setCurrentQuestionNumber(prev => prev + 1);
              }, 0);
            } else {
              console.error('Failed to parse quiz response:', data.response);
              showPracticeError('The AI sent a quiz question we could not read. Please try again.');
            }
          }
        }
      } else {
        await handleAIResponseError(response);
      }
    } catch (error) {
      console.error('Network error:', error);
      showPracticeError('The AI could not connect. Please check your connection and try again.');
    } finally {
      setIsGenerating(false);
    }
  };  

  return (
    <div className="space-y-12 md:space-y-16">
      {!hasStarted && (
        <section className="relative">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-px bg-slate-200" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic">Practice</span>
              </div>
              <h1 className="text-4xl md:text-7xl font-black text-slate-900 tracking-tighter leading-none mb-4">
                Train for <br />
                <span className="italic text-blue-600 underline decoration-blue-100 underline-offset-4">{profileTitle}.</span>
              </h1>
              <p className="text-slate-500 font-medium italic text-lg">Pick a mode and start practicing.</p>
            </div>
            <PracticeModeSwitcher practiceMode={practiceMode} setPracticeMode={setPracticeMode} />
          </div>
        </section>
      )}

      <section className="flex flex-col items-center text-center pb-28">
        {practiceMode === 'chat' ? (
          <div className="flex flex-col items-center w-full">
            {conversationHistory.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid w-full overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white text-left shadow-xl shadow-blue-500/5 lg:grid-cols-[1.05fr_0.95fr]"
              >
                <div className="p-8 md:p-10">
                  <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-blue-600 text-white shadow-lg shadow-blue-600/20">
                    <MessageSquare size={28} />
                  </div>
                  <h2 className="text-3xl font-black tracking-tighter text-slate-900 md:text-5xl italic">Interview practice</h2>
                  <div className="mt-8 grid gap-3">
                    {[
                      { icon: Bot, text: 'AI asks interview questions' },
                      { icon: Mic2, text: 'Speak or type your answers' },
                      { icon: CheckCircle2, text: 'Get a simple review after' },
                    ].map((item) => (
                      <div key={item.text} className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white">
                          <item.icon size={18} />
                        </div>
                        <span className="text-sm font-black text-slate-700 italic">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col justify-between bg-slate-900 p-8 text-white md:p-10">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Setup</p>
                    <div className="mt-6 rounded-3xl border border-white/10 bg-white/10 p-5">
                      <label className="flex items-center justify-between gap-5 cursor-pointer group">
                        <span className="flex items-center gap-3">
                          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-slate-950">
                            <Volume2 size={19} />
                          </span>
                          <span>
                            <span className="block text-sm font-black">AI voice</span>
                            <span className="block text-xs font-bold text-slate-400">{enableTTSState ? 'On' : 'Off'}</span>
                          </span>
                        </span>
                        <span className="relative">
                          <input
                            type="checkbox"
                            className="sr-only"
                            checked={enableTTSState}
                            onChange={(e) => setEnableTTSState(e.target.checked)}
                          />
                          <span className={`block h-8 w-16 rounded-full transition-colors duration-300 ${enableTTSState ? 'bg-blue-500' : 'bg-white/20'}`} />
                          <span className={`absolute left-1 top-1 h-6 w-6 rounded-full bg-white shadow-sm transition-transform duration-300 ${enableTTSState ? 'translate-x-8' : 'translate-x-0'}`} />
                        </span>
                      </label>
                    </div>
                  </div>

                  <button
                    onClick={startInterview}
                    disabled={isGenerating}
                    className="mt-10 w-full rounded-full bg-white px-10 py-6 text-slate-900 font-black transition-all shadow-2xl shadow-slate-900/10 hover:bg-slate-50 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                  >
                    {isGenerating ? <Loader2 className="animate-spin" size={20} /> : <>Start Interview <ArrowRight size={19} /></>}
                  </button>
                </div>
              </motion.div>
            ) : chatCompleted ? (
              isSummarizing ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <Loader2 className="animate-spin h-12 w-12 text-blue-400" />
                  <p className="mt-8 text-lg font-black italic text-slate-900">Creating your review...</p>
                </div>
              ) : (
                <ChatActionResult
                  title="Your Review"
                  summary={chatSummary}
                  onStartNew={startInterview}
                  buttonText="Start Again"
                  onSecondaryAction={() => setPracticeMode('quiz')}
                  secondaryButtonText="Switch to Quiz"
                  isModal={false}
                />
              )
            ) : (
              <ChatView conversationHistory={conversationHistory} />
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center w-full">
            {quizCompleted ? (
              <ActionResult
                title="Quiz Results"
                score={score}
                total={10}
                onStartNew={startInterview}
                buttonText="Start Again"
                onSecondaryAction={() => setPracticeMode('chat')}
                secondaryButtonText="Switch to Interview"
                wrongAnswers={wrongAnswers}
                isModal={false}
              />
            ) : quizData ? (
              <QuizView
                quizData={quizData}
                currentQuestionNumber={currentQuestionNumber}
                selectedOption={selectedOption}
                setSelectedOption={setSelectedOption}
                sendUserResponse={sendUserResponse}
                isGenerating={isGenerating}
              />
            ) : (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid w-full overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white text-left shadow-xl shadow-blue-500/5 lg:grid-cols-[0.95fr_1.05fr]"
              >
                <div className="bg-slate-900 p-8 text-white md:p-10">
                  <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-blue-600 text-white shadow-lg shadow-blue-600/20">
                    <BrainCircuit size={30} />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Quiz setup</p>
                  <h2 className="mt-5 text-3xl font-black tracking-tighter md:text-5xl italic">Quiz practice</h2>
                  <div className="mt-8 grid grid-cols-3 gap-3">
                    {['10', 'A-D', 'Score'].map((item) => (
                      <div key={item} className="rounded-2xl border border-white/10 bg-white/10 p-4 text-center">
                        <p className="text-lg font-black italic">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col justify-between p-8 md:p-10">
                  <div className="grid gap-3">
                    {[
                      'Questions match your role',
                      'Answer 10 quick questions',
                      'See missed answers at the end',
                    ].map((text) => (
                      <div key={text} className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                        <CheckCircle2 className="text-blue-500" size={20} />
                        <span className="text-sm font-black text-slate-700 italic">{text}</span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={startInterview}
                    disabled={isGenerating}
                    className="mt-10 w-full rounded-full bg-slate-900 px-10 py-6 text-white font-black transition-all shadow-2xl shadow-slate-900/10 hover:bg-slate-800 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                  >
                    {isGenerating ? <Loader2 className="animate-spin" size={20} /> : <>Start Quiz <ArrowRight size={19} /></>}
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </section>

      {(practiceMode === 'chat' && conversationHistory.length > 0 && !quizCompleted && !chatCompleted) && (
        <ChatInput
          userResponse={userResponse}
          setUserResponse={setUserResponse}
          isGenerating={isGenerating}
          isRecording={isRecording}
          handleMicClick={handleMicClick}
          sendUserResponse={sendUserResponse}
        />
      )}

      {practiceError && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/40 px-6 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="relative w-full max-w-md rounded-[2rem] border border-red-100 bg-white p-8 text-left shadow-2xl shadow-slate-900/20"
            role="dialog"
            aria-modal="true"
            aria-labelledby="practice-error-title"
          >
            <button
              type="button"
              onClick={() => setPracticeError('')}
              className="absolute right-5 top-5 rounded-full bg-slate-50 p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-900"
              aria-label="Close error"
            >
              <X size={18} />
            </button>

            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
              <AlertCircle size={26} />
            </div>
            <h3 id="practice-error-title" className="mb-3 text-2xl font-black tracking-tight text-slate-900">
              Something went wrong
            </h3>
            <p className="text-sm font-medium leading-relaxed text-slate-500">{practiceError}</p>
            <button
              type="button"
              onClick={() => setPracticeError('')}
              className="mt-8 w-full rounded-full bg-slate-900 px-6 py-4 text-sm font-black text-white transition hover:bg-slate-800 active:scale-95"
            >
              Got it
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default MainContent;
