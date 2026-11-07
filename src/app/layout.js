import { Geist, Geist_Mono } from "next/font/google";
import { StackProvider, StackTheme } from "@stackframe/stack";
import { stackServerApp } from "../../stack";
import "./globals.css";
import Provider from "./provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "NextGen Tutor – AI-Powered Interview Coaching",
  description: "Master every interview with real-time AI voice coaching, adaptive mock sessions, and personalized feedback powered by NextGen Tutor.",
  icons: {
    icon: "/homeicon.svg",
    shortcut: "/homeicon.svg",
    apple: "/homeicon.svg",
  },
  openGraph: {
    title: "NextGen Tutor – AI-Powered Interview Coaching",
    description: "Master every interview with real-time AI voice coaching and personalized feedback.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      ><StackProvider app={stackServerApp}><StackTheme>
        <Provider>
          {children}
        </Provider>
      </StackTheme></StackProvider></body>
    </html>
  );
}
