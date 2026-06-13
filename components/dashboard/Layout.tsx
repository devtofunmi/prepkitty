import React, { useState } from "react";
import Sidebar from "./Sidebar";
import PricingModal from "../dashboard/practice/PricingModal";
import { Menu, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const { status } = useSession();
  const { data } = useSWR(
    status === "authenticated" ? "/api/user" : null,
    fetcher
  );

  if (status === "loading" || (status === "authenticated" && !data)) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <Loader2 className="animate-spin h-10 w-10 text-blue-400" />
      </div>
    );
  }

  const { user } = data || {};

  return (
    <div className="flex bg-white min-h-screen font-sans">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed left-0 top-0 h-screen w-[280px] bg-white border-r border-slate-100">
        <Sidebar user={user} onOpenPricing={() => setShowPricingModal(true)} />
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 h-full w-[280px] bg-white shadow-2xl flex flex-col"
            >
                <div className="flex-1 overflow-y-auto">
                <Sidebar isMobile={true} user={user} onOpenPricing={() => setShowPricingModal(true)} />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {showPricingModal && <PricingModal setShowPricingModal={setShowPricingModal} />}

      {/* Main Content */}
      <div className="flex-1 lg:ml-[280px] min-h-screen relative">
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        
        <header className="lg:hidden fixed top-0 right-0 left-0 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 h-20 flex items-center justify-between z-40">
           <Image src="/prepkitty_logo.png" alt="PrepKitty" width={110} height={35} />
           <button
             onClick={() => setIsMobileMenuOpen(true)}
             className="text-slate-900 hover:bg-slate-50 p-2.5 rounded-2xl border border-slate-100 transition-all active:scale-95"
             aria-label="Open menu"
           >
             <Menu size="22" />
           </button>
        </header>

        <main className="pt-24 lg:pt-0 min-h-screen relative z-10">
           <div className="max-w-[1240px] mx-auto p-6 md:p-12 lg:p-16">
              {children}
           </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;