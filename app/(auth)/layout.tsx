import React from "react";
import Image from "next/image";

// here we use tsx to define the children props being read only
// and also being renderable types such as JSX, frags, etc
// will apply style to child elements that it encompasses

// we use nested layout structure to have one layout for a set of pages
// i.e auth layout for auth pages

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="flex  min-h-screen w-full justify-between font-inter">
      {children}
      <div className="auth-asset">
        <div>
          <Image
            src="/icons/auth-res.png"
            alt="auth image background"
            width={600}
            height={900}
          />
        </div>
      </div>
    </main>
  );
}
