import SideBar from "@/components/ui/SideBar";
import React from "react";
import Image from "next/image";
import MobileNav from "@/components/ui/MobileNav";

// here we use tsx to define the children props being read only
// and also being renderable types such as JSX, frags, etc
// will apply style to child elements that it encompasses

// we use nested layout structure to have one layut for a set of pages
// i.e sidebar layout for app pages except auth

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  //create dummy user
  const localUser = { firstName: "Aashiq", lastName: "Aziz" };

  return (
    /* since its flex the entire space is filled */
    <main className="flex h-screen font-inter w-full">
      <SideBar user={localUser} />
      {/* we need to present users with a mobile nav in case of insufficient screenspace
      on smaller devices as sidebar will be hidden */}
      <div className="flex size-full flex-col">
        {/*This class provides styling for the logo and hamburger icon to appear at the ends*/}
        <div className="root-layout">
          <Image src="/icons/logo.svg" alt="menu-logo" width={30} height={30} />
          <MobileNav user={localUser} />
        </div>
        {/* Note: Since the layout has the parent flex prop:
          1. Sidebar and children / Home page will appear next to each other (as expected for sidebar)
          2. When adding a MobileNav div between, the mobileNav would appear next to the home page child element.
          3. This would occur when sidebar is hidden due to nested props that control this behaviour
          4. Now when we remove the children and place it within the parent div that contains the mobileNav+logo
            the flex col applies thereby rendering the mobileNav at the top
        */}
        {children}
      </div>
    </main>
  );
}
