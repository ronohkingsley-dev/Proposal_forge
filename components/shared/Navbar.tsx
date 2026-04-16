"use client";

import Link from "next/link";
import { Hammer } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 glass border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="p-2 bg-brand-600 rounded-lg group-hover:rotate-12 transition-transform">
                <Hammer className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-brand-800">
                ProposalForge
              </span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm font-medium text-slate-600 hover:text-brand-600 transition-colors">Features</Link>
            <Link href="#pricing" className="text-sm font-medium text-slate-600 hover:text-brand-600 transition-colors">Pricing</Link>
            <Link href="/dashboard" className="btn-secondary py-1.5 px-4 text-sm">Dashboard</Link>
            <Link href="/proposals/new" className="btn-primary py-1.5 px-4 text-sm shadow-none">Create Proposal</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
