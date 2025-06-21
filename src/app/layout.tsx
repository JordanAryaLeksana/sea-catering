import type { Metadata } from "next";
import { Outfit, DM_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/pages/navbar";
import Provider from "@/components/pages/Provider";

const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' })
const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm' })

export const metadata: Metadata = {
  title: "Sea Catering",
  description: "Healthy Meals, Anytime, Anywhere",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${outfit.variable} ${dmSans.variable} antialiased`}
      >
        <Provider>
          <Navbar/>
          {children}
        </Provider>
      </body>
    </html>
  );
}
