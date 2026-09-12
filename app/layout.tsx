// @ts-ignore
import './globals.css';

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
        {children}
      </body>
    </html>
  );
}
