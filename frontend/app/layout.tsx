"use client";

import "./globals.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useAuth } from "./hooks/useAuth";

export default function RootLayout({ children }: any) {
  useAuth();
  return (
    <html lang="en">
      <body>
        <GoogleOAuthProvider
          clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}
        >
          {children}
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}