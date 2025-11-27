import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Studio Ghibli Films Explorer",
  description: "Explore the magical world of Studio Ghibli films with detailed information about movies, characters, and species. Built with Next.js for optimal performance and sustainability.",
  keywords: ["Studio Ghibli", "films", "movies", "anime", "Miyazaki"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {/* Animated background elements */}
        <div className="clouds"></div>
        
        {children}
        
        <footer>
          <div className="container">
            <p>Data provided by <a href="https://ghibliapi.vercel.app/" target="_blank" rel="noopener noreferrer">Ghibli API</a></p>
            <p>&copy; 2025 Studio Ghibli Fan Site</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
