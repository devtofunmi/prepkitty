
import Image from "next/image";
import NextLink from "next/link";

export const Footer = () => {
  return (
    <footer className="relative pt-24 pb-12 border-t border-slate-200 overflow-hidden bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
          <div className="col-span-2">
            <NextLink href="/" className="flex items-center gap-2 mb-10 group">
              <Image src="/prepkitty_logo.png" alt="Prepkitty Logo" width={140} height={45} />
            </NextLink>
            <p className="text-slate-500 max-w-sm text-lg leading-relaxed font-medium">
              PrepKitty helps you master high-stakes job interviews in top industries with real-time AI feedback.
            </p>
          </div>

          <div>
            <h4 className="text-slate-900 font-black mb-8 text-xs italic uppercase tracking-[0.2em]">Platform</h4>
            <ul className="space-y-4">
              {['Features', 'FAQ'].map((link) => (
                <li key={link}>
                  <a href={`/#${link.toLowerCase()}`} className="text-slate-500 hover:text-blue-600 text-base font-medium transition-colors">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-slate-900 font-black mb-8 text-xs italic uppercase tracking-[0.2em]">Company</h4>
            <ul className="space-y-4">
              {[
                { name: 'About', href: '/about' },
                { name: 'Privacy Policy', href: '/privacy' },
                { name: 'Terms of Service', href: '/terms' },
                { name: 'Contact', href: '/contact' }
              ].map((link) => (
                <li key={link.name}>
                  <NextLink href={link.href} className="text-slate-500 hover:text-blue-600 text-base font-medium transition-colors">
                    {link.name}
                  </NextLink>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-12 border-t border-slate-200">
          <div className="text-left">
            <p className="text-sm text-slate-500 font-medium">© {new Date().getFullYear()} Prepkitty. All rights reserved.</p>
            <p className="text-xs text-slate-400 mt-1 italic">Practice sessions are confidential and securely stored.</p>
          </div>
          <div className="flex gap-8">
            <NextLink href="/privacy" className="text-xs text-slate-400 hover:text-blue-600 transition-colors uppercase tracking-widest font-black">Privacy Policy</NextLink>
            <NextLink href="/terms" className="text-xs text-slate-400 hover:text-blue-600 transition-colors uppercase tracking-widest font-black">Terms of Service</NextLink>
          </div>
        </div>
      </div>
    </footer>
  );
};
