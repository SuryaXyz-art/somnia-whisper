import type { Metadata } from "next";
import { Syne } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const syne = Syne({ 
  subsets: ["latin"],
  variable: '--font-syne',
});

export const metadata: Metadata = {
  title: "SomniaWhisper — On-Chain Fortune Telling",
  description: "AI-powered fortunes from your on-chain activity, mintable as NFTs on Somnia",
  openGraph: {
    title: "SomniaWhisper — On-Chain Fortune Telling",
    description: "Discover your destiny on the Somnia Testnet",
    images: ["/og-image.png"], // Placeholder path
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${syne.variable} font-sans bg-[#07080f] text-white overflow-x-hidden min-h-screen relative`}>
        {/* Global UI Elements */}
        <div className="scroll-progress" id="scroll-indicator" />
        <div className="starfield"><div className="star-layer-3" /></div>
        
        <script dangerouslySetInnerHTML={{ __html: `
          window.addEventListener('scroll', () => {
            const indicator = document.getElementById('scroll-indicator');
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            if (indicator) indicator.style.width = scrolled + "%";
          });
        ` }} />

        <Providers>
          <div className="relative z-10">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
