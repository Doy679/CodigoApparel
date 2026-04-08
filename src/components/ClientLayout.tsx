"use client";

import { SessionProvider } from "next-auth/react";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <div className="transition-opacity duration-1000 ease-in-out">{children}</div>
    </SessionProvider>
  );
}
