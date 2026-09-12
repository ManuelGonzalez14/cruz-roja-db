// @ts-ignore
import './globals.css';
import { Toaster } from 'react-hot-toast';

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
    <html lang="es">
      <body>
        <Toaster position="top-right" />
        {children}
      </body>
    </html>
  );
}
