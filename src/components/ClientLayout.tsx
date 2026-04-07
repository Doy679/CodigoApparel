"use client";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="transition-opacity duration-1000 ease-in-out">{children}</div>
    </>
  );
}
