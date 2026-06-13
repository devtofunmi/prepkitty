
import React from "react";
import Image from 'next/image';
import Link from "next/link";
import { useRouter } from "next/router";
import {
  LayoutGrid,
  Mic,
  LogOut,
  Zap,
  Briefcase
} from "lucide-react";
import { signOut } from "next-auth/react";

interface SidebarProps {
  user: {
    name?: string;
    image?: string;
  };
  onOpenPricing?: () => void;
  isMobile?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ user, onOpenPricing, isMobile }) => {
  const router = useRouter();
  
  const navItems = [
    { name: "Dashboard", icon: LayoutGrid, href: "/dashboard" },
    { name: "Practice", icon: Mic, href: "/practice" },
    { name: "CV Profile", icon: Briefcase, href: "/cv" },
  ];

  return (
  <aside data-is-mobile={isMobile ? 'true' : 'false'} className={`p-6 md:p-8 h-full flex flex-col font-sans bg-white`}>
      <div className="mb-10 lg:mb-12">
        <Link href="/">
           <Image src="/prepkitty_logo.png" alt="PrepKitty" width={120} height={40} className="priority" />
        </Link>
      </div>

      <div className="mb-4 px-1">
         <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 italic">Menu</p>
      </div>

      <nav className="flex-1 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = router.pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center space-x-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 font-black' 
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 border border-transparent hover:border-slate-100 font-medium'
                  }`}
                >
                  <item.icon
                    size="18"
                    className={`${isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-500'} transition-colors`}
                  />
                  <span className="text-sm tracking-tight">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mt-auto space-y-6 lg:space-y-8">
        <div className="px-1">
           <button
             onClick={() => onOpenPricing && onOpenPricing()}
             className="w-full relative group p-5 rounded-[1.5rem] bg-slate-900 text-white overflow-hidden transition-all hover:brightness-110 active:scale-[0.98]"
           >
             <div className="absolute top-0 right-0 p-2 opacity-20"><Zap size={32} className="text-blue-400" /></div>
             <div className="relative z-10 text-left py-1">
                <p className="text-xs font-black leading-tight">Go Unlimited</p>
             </div>
           </button>
        </div>

        <div className="space-y-4">
           <div className="flex items-center justify-between px-4 py-3 bg-slate-50 rounded-2xl border border-slate-100">
              <p className="font-black text-xs text-slate-900 truncate max-w-[180px]">{user?.name || 'User'}</p>
              <button 
                onClick={() => signOut()}
                className="text-slate-400 hover:text-red-500 transition-all ml-2"
                title="Logout"
              >
                <LogOut size={16} />
              </button>
           </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;