import { Navbar } from '@/components/Navbar'
import '../styles/globals.css'

export const metadata = {
  title: 'ProposalForge | High-End Proposals',
  description: 'Forge proposals that close deals.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col font-sans relative text-slate-100 bg-slate-950">
        <div className="fixed inset-0 z-[-2] bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950" />
        <div className="fixed inset-0 z-[-1] opacity-30 mix-blend-overlay bg-[url('/abstract-bg.png')] bg-cover bg-center" />
        
        <Navbar />

        <main className="flex-grow w-full">
          {children}
        </main>
      </body>
    </html>
  )
}
