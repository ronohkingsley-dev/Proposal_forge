import { Hammer } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-slate-800 pb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4 text-white">
              <Hammer className="h-6 w-6 text-indigo-500" />
              <span className="text-xl font-bold tracking-tight">ProposalForge</span>
            </div>
            <p className="max-w-xs text-sm leading-relaxed">
              Crafting win-ready proposals with intelligence. Empowering freelancers and agencies to scale through automation and tracking.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Product</h4>
            <ul className="space-y-2 text-sm font-medium">
              <li><Link href="/templates" className="hover:text-indigo-400 transition-colors">Templates</Link></li>
              <li><Link href="/dashboard" className="hover:text-indigo-400 transition-colors">Pricing Engine</Link></li>
              <li><Link href="/dashboard" className="hover:text-indigo-400 transition-colors">Analytics</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Support</h4>
            <ul className="space-y-2 text-sm font-medium">
              <li><Link href="#" className="hover:text-indigo-400 transition-colors">Documentation</Link></li>
              <li><Link href="#" className="hover:text-indigo-400 transition-colors">Help Center</Link></li>
              <li><Link href="/settings" className="hover:text-indigo-400 transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase font-bold tracking-widest">
          <p className="text-slate-500">© {new Date().getFullYear()} ProposalForge. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors underline-offset-4 hover:underline">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors underline-offset-4 hover:underline">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
