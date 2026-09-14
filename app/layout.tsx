// @ts-ignore
import './globals.css';
import { Toaster } from 'react-hot-toast';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata = {
  title: 'Cruz Roja Panameña - Las Tablas',
  description: 'Sistema integral de gestión para la Cruz Roja Panameña, sede Las Tablas.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={inter.className}>
      <body>
        <Toaster 
          position="top-center" 
          containerStyle={{
            top: '40%'
          }}
          toastOptions={{
            style: {
              background: '#fff',
              color: '#363636',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              padding: '16px',
              borderRadius: '12px',
              border: '1px solid #f3f4f6'
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
