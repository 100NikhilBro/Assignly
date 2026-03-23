// // "use client";

// // import "./globals.css";
// // import { GoogleOAuthProvider } from "@react-oauth/google";
// // import { Toaster } from "react-hot-toast";
// // import { Inter } from "next/font/google";

// // const inter = Inter({ subsets: ["latin"] });

// // export default function RootLayout({
// //   children,
// // }: {
// //   children: React.ReactNode;
// // }) {
// //   return (
// //     <html lang="en">
// //       <head>
// //         <meta charSet="UTF-8" />
// //         <meta name="viewport" content="width=device-width, initial-scale=1.0" />
// //         <meta name="description" content="AI-powered assignment generator for educators. Create structured exam papers in seconds." />
// //         <meta name="keywords" content="AI, assignment generator, exam paper, education, teaching tools" />
// //         <meta name="author" content="VedaAI" />
// //         <meta property="og:title" content="VedaAI - AI Assignment Generator" />
// //         <meta property="og:description" content="Create structured exam papers with AI in seconds" />
// //         <meta property="og:type" content="website" />
// //         <meta name="twitter:card" content="summary_large_image" />
// //         <title>VedaAI - AI Powered Assignment Generator</title>
// //       </head>
// //       <body className={inter.className}>
// //         <GoogleOAuthProvider
// //           clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}
// //         >
// //           {children}
// //           <Toaster 
// //             position="top-left"
// //             toastOptions={{
// //               duration: 4000,
// //               style: {
// //                 background: "#1a1a1a",
// //                 color: "#fff",
// //                 border: "1px solid #333",
// //               },
// //               success: {
// //                 iconTheme: {
// //                   primary: "#22c55e",
// //                   secondary: "#fff",
// //                 },
// //               },
// //               error: {
// //                 iconTheme: {
// //                   primary: "#ef4444",
// //                   secondary: "#fff",
// //                 },
// //               },
// //             }}
// //           />
// //         </GoogleOAuthProvider>
// //       </body>
// //     </html>
// //   );
// // }



// "use client";

// import "./globals.css";
// import { GoogleOAuthProvider } from "@react-oauth/google";
// import { Toaster } from "react-hot-toast";
// import { Inter } from "next/font/google";

// const inter = Inter({ subsets: ["latin"] });

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en">
//       <head>
//         <meta charSet="UTF-8" />
//         <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//         <meta name="description" content="AI-powered assignment generator for educators. Create structured exam papers in seconds." />
//         <meta name="keywords" content="AI, assignment generator, exam paper, education, teaching tools" />
//         <meta name="author" content="PaperMind" />
//         <meta property="og:title" content="PaperMind - AI Assignment Generator" />
//         <meta property="og:description" content="Create structured exam papers with AI in seconds" />
//         <meta property="og:type" content="website" />
//         <meta name="twitter:card" content="summary_large_image" />
//         <title>PaperMind - Forge Better Assignments</title>
//       </head>
//       <body className={`${inter.className} bg-gray-50 text-gray-900`}>
//         <GoogleOAuthProvider
//           clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}
//         >
//           {children}
//           <Toaster 
//             position="top-right"
//             toastOptions={{
//               duration: 4000,
//               style: {
//                 background: "#fff",
//                 color: "#111827",
//                 border: "1px solid #e5e7eb",
//                 borderRadius: "12px",
//                 boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
//               },
//               success: {
//                 iconTheme: {
//                   primary: "#10b981",
//                   secondary: "#fff",
//                 },
//               },
//               error: {
//                 iconTheme: {
//                   primary: "#ef4444",
//                   secondary: "#fff",
//                 },
//               },
//             }}
//           />
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
        <meta name="author" content="Assignly" />
        <meta property="og:title" content="Assignly - AI Assignment Generator" />
        <meta property="og:description" content="Create structured exam papers with AI in seconds" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <title>Assignly - Craft smarter assignments</title>
      </head>
      <body className={`${inter.className} bg-gray-50 text-gray-900`}>
        <GoogleOAuthProvider
          clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}
        >
          {children}
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#fff",
                color: "#111827",
                border: "1px solid #e5e7eb",
                borderRadius: "12px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              },
              success: {
                iconTheme: {
                  primary: "#10b981",
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
