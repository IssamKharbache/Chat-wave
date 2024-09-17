import { Satisfy } from "next/font/google";
import "./globals.css";
import StyledComponentRegistry from "@/lib/AntRegistry";
import { Toaster } from "sonner";
import { AuthProvider } from "./Providers";

const satisfy = Satisfy({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  variable: "--font-satisfy",
});

export const metadata = {
  title: "Chat wave",
  description: "Social media app to chat and interact with other friends",
};

export const viewPort = {
  width: "device-width",
  initialScale: 1.0,
  minimumScale: 1.0,
  maximumScale: 1.0,
  userScalable: "no",
};

export default async function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${satisfy.variable}`}>
        <AuthProvider>
          <StyledComponentRegistry>
            <Toaster richColors position="top-center" />
            {children}
          </StyledComponentRegistry>
        </AuthProvider>
      </body>
    </html>
  );
}
