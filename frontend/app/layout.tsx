import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "Arch-Cost AI — High-Precision CAD-to-Cost Estimation Engine",
  description:
    "Secure estimation accuracy up to 99.8%. Arch-Cost AI parses complex multi-layered .DWG, .DXF, .DWT and .DWS drawings with CAD-aware AI and LLMs to produce instant, verified line-item cost reports.",
  keywords: [
    "CAD estimation",
    "DWG to cost",
    "AI quantity takeoff",
    "construction cost estimate",
    "LLM CAD parser",
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
