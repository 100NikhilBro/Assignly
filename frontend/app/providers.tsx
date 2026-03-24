"use client";

import { useEffect } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    
    const originalError = console.error;
    console.error = (...args) => {
      if (
        typeof args[0] === "string" &&
        (args[0].includes("Cross-Origin-Opener-Policy") ||
         args[0].includes("window.postMessage"))
      ) {
        return; 
      }
      originalError.apply(console, args);
    };

    return () => {
      console.error = originalError; 
    };
  }, []);

  return <>{children}</>;
}
