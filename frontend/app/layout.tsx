// "use client";

// import "./globals.css";
// import { GoogleOAuthProvider } from "@react-oauth/google";
// import { useAuth } from "./hooks/useAuth";
// import { Toaster } from "react-hot-toast";

// export default function RootLayout({ children }: any) {
//   <Toaster position="top-right"></Toaster>
//   useAuth();
//   return (
//     <html lang="en">
//       <body>
//         <GoogleOAuthProvider
//           clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}
//         >
//           {children}
//         </GoogleOAuthProvider>
//       </body>
//     </html>
//   );
// }



"use client";

import "./globals.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "react-hot-toast";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="AI-powered assignment generator for educators. Create structured exam papers in seconds." />
        <meta name="keywords" content="AI, assignment generator, exam paper, education, teaching tools" />
        <meta name="author" content="VedaAI" />
        <meta property="og:title" content="VedaAI - AI Assignment Generator" />
        <meta property="og:description" content="Create structured exam papers with AI in seconds" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <title>VedaAI - AI Powered Assignment Generator</title>
      </head>
      <body className={inter.className}>
        <GoogleOAuthProvider
          clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}
        >
          {children}
          <Toaster 
            position="top-left"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#1a1a1a",
                color: "#fff",
                border: "1px solid #333",
              },
              success: {
                iconTheme: {
                  primary: "#22c55e",
                  secondary: "#fff",
                },
              },
              error: {
                iconTheme: {
                  primary: "#ef4444",
                  secondary: "#fff",
                },
              },
            }}
          />
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}