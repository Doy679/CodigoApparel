"use client";

import { useState, useEffect } from "react";
import IntroLoader from "./IntroLoader";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [showLoader, setShowLoader] = useState(true);

  // Lock body scroll while loader is active
  useEffect(() => {
    if (showLoader) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [showLoader]);

  const handleLoaderComplete = () => {
    setShowLoader(false);
  };

  return (
    <>
      {showLoader && <IntroLoader onComplete={handleLoaderComplete} />}
      <div
        className="transition-opacity duration-1000 ease-in-out"
        style={{
          opacity: showLoader ? 0 : 1,
          pointerEvents: showLoader ? "none" : "auto"
        }}
      >
        {children}
      </div>
    </>
  );
}
