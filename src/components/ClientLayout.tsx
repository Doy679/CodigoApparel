"use client";

import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <SessionProvider refetchOnWindowFocus={false}>
      <div className="transition-opacity duration-1000 ease-in-out">{children}</div>
    </SessionProvider>
  );
}
