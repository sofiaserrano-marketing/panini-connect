import './globals.css';

export const metadata = {
  title: 'Panini Connect - World Cup 2026',
  description: 'Crea tu sticker del Mundial 2026',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
