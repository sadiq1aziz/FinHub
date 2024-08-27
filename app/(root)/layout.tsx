import SideBar from "@/components/ui/SideBar";
import React from "react";

// here we use tsx to define the children props being read only
// and also being renderable types such as JSX, frags, etc
// will apply style to child elements that it encompasses

// we use nested layout structure to have one layut for a set of pages
// i.e sidebar layout for app pages except auth

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  //create dummy user
  const localUser = {firstName:'Aashiq', lastName:'Aziz'};

  return (
    /* We add some custom style to make the sidebar appear on the left section of page */
    <main className="flex h-screen font-inter w-full">
      <SideBar user={localUser} />
      {children}
    </main>
  );
}
