export const metadata = {
  title: "London Roof Connect",
  description: "Roofing Jobs. Real People. London.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}