import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Core ATS Resume Checker | AI Resume Intelligence & Career Platform',
  description: 'Production-quality AI resume analysis, ATS optimization, job description matching, bullet intelligence, and application tracking.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-slate-50 text-slate-900 min-h-screen">
        {children}
      </body>
    </html>
  );
}
