import type { Metadata } from 'next';
import './globals.css';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';

export const metadata: Metadata = {
  title: 'Zoho API Migration & Data Mapping Documentation',
  description:
    'Comprehensive technical documentation covering Zoho CRM & Zoho Books data extraction, field mappings, enum normalizations, and fallback strategies.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0b1120] text-slate-100 antialiased font-sans selection:bg-sky-500/20 selection:text-sky-300">
        <Header />
        <div className="flex min-h-[calc(100vh-4rem)]">
          <Sidebar />
          <main className="flex-1 min-w-0 p-6 lg:p-10 max-w-7xl mx-auto">{children}</main>
        </div>
      </body>
    </html>
  );
}

