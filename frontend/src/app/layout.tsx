import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import TopBar from "@/components/layouts/topbar";
import { ToastContainer } from "react-toastify";


const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});


export const metadata: Metadata = {
  title: "Task Board",
  description: "Real-TimeTaskBoard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ToastContainer position="top-right" autoClose={3000} closeButton={true}/>
        <TopBar/>
        <main className="flex-1 w-full px-3 sm:px-6 lg:px-8 bg-gray-100">
          {children}
        </main>
        </body>
    </html>
  );
}
