
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";

const navLinks = [
  { href: "/#features", text: "Features" },
  { href: "/#faq", text: "FAQ" },
];

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { status } = useSession();
  const isLoggedIn = status === "authenticated";

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "py-4" : "py-6"
        }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <nav className={`flex items-center justify-between px-6 py-3 rounded-2xl transition-all duration-300 ${isScrolled ? "glass-dark border border-white/10" : "bg-transparent"
          }`}>
          {/* Logo Area */}
          <Link href="/" className="flex items-center group">
            <Image src="/prepkitty_logo.png" alt="Prepkitty Logo" width={120} height={40} />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                {link.text}
              </a>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {isLoggedIn ? (
              <Link
                href="/dashboard"
                className="px-6 py-2.5 bg-blue-500 text-white text-sm font-bold rounded-xl hover:bg-blue-600 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/25"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-5 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className="px-6 py-2.5 bg-blue-500 text-white text-sm font-bold rounded-xl hover:bg-blue-600 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/25"
                >
                  Start Practicing
                </Link>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            className="md:hidden p-2 text-slate-900 hover:text-blue-600 transition-colors z-50"
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            aria-label="Toggle navigation"
          >
            {mobileNavOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </nav>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileNavOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 md:hidden glass-dark pt-24 px-6 h-screen"
          >
            <div className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-3xl font-bold text-slate-900 hover:text-blue-500 transition-colors"
                  onClick={() => setMobileNavOpen(false)}
                >
                  {link.text}
                </a>
              ))}
              <hr className="border-slate-200" />
              {isLoggedIn ? (
                <Link
                  href="/dashboard"
                  className="w-full py-4 bg-blue-500 text-white text-center rounded-xl font-bold text-lg shadow-xl shadow-blue-500/20"
                  onClick={() => setMobileNavOpen(false)}
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-xl font-medium text-slate-500"
                    onClick={() => setMobileNavOpen(false)}
                  >
                    Log In
                  </Link>
                  <Link
                    href="/signup"
                    className="w-full py-4 bg-blue-500 text-white text-center rounded-xl font-bold text-lg shadow-xl shadow-blue-500/20"
                    onClick={() => setMobileNavOpen(false)}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
