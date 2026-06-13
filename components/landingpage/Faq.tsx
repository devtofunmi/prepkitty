
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    question: "How does the AI interviewer work?",
    answer: "The AI uses advanced natural language processing to understand your responses and provide relevant follow-up questions, creating a realistic interview simulation."
  },
  {
    question: "Is my data private?",
    answer: "Yes, all your practice sessions and personal data are kept completely private and secure."
  },
  {
    question: "Can I get feedback on specific skills?",
    answer: "Absolutely. Our feedback system analyzes your communication, clarity, and confidence, and provides tailored suggestions for improvement."
  },
  {
    question: "What kind of roles can I practice for?",
    answer: "You can practice for a wide range of roles from Banking to Tech."
  }
];

export const Faq = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <section id="faq" className="relative py-24 bg-slate-50">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-6 text-slate-900">Frequently Asked Questions</h2>
          <p className="text-slate-600 text-lg">Find answers to the most common questions about Prepkitty.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div 
              key={index}
              className={`rounded-2xl border transition-all duration-300 ${
                openFaq === index ? "bg-white border-blue-200 shadow-lg shadow-blue-500/5" : "border-slate-200 hover:border-slate-300 bg-white/50"
              }`}
            >
              <button 
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="flex justify-between items-center w-full text-left p-6 md:p-8 focus:outline-none group"
              >
                <h3 className="text-lg md:text-xl font-bold text-slate-800 group-hover:text-slate-900 transition-colors uppercase tracking-tight">{faq.question}</h3>
                <div className={`p-2 rounded-xl transition-all duration-300 ${openFaq === index ? "bg-blue-500 text-white rotate-180" : "bg-slate-100 text-slate-400"}`}>
                  <ChevronDown size={20} />
                </div>
              </button>
              
              <AnimatePresence>
                {openFaq === index && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 md:px-8 pb-8">
                      <p className="text-slate-600 text-base md:text-lg leading-relaxed">{faq.answer}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};