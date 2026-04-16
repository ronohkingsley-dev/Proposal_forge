import { Hammer } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-slate-800 pb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4 text-white">
              <Hammer className="h-6 w-6 text-brand-500" />
              <span className="text-xl font-bold tracking-tight">ProposalForge</span>
            </div>
            <p className="max-w-xs text-sm leading-relaxed">
              Crafting win-ready proposals with intelligence. Empowering freelancers and agencies to scale through automation and tracking.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-brand-400 transition-colors">Templates</a></li>
              <li><a href="#" className="hover:text-brand-400 transition-colors">Pricing Engine</a></li>
              <li><a href="#" className="hover:text-brand-400 transition-colors">Analytics</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-brand-400 transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-brand-400 transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-brand-400 transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <p>© 2026 ProposalForge. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
