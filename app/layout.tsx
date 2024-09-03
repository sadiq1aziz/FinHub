//type -> importing jsut the type of the object will be used as a standard
//at compile time to see conformity of the object definition that is being exported
//helps reduce unnecessary runtime complications and code

import type { Metadata } from "next";

//importing Inter which is a function from google fonts is done so
//as a named export due to the google module containing tons of exports
//which of course need to be named exports to distinguish between them
//as opposed to a single function exported as default by a module

import { Inter, IBM_Plex_Serif } from "next/font/google";
import "./globals.css";
import React from "react";

//creating instance of Inter function with a config object aka options
//we define that we need only the latin subsets of fonts
//it has a classname prop that can be used to apply on the actual element

//also we assign custom CSS variables to the latin subset that we get
//to make it easier for usage. Also, we procure only the fonts that are needed
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const ibmPlexSerif = IBM_Plex_Serif({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-ibm-plex-serif",
});
export const metadata: Metadata = {
  title: "FinHub Banking",
  description: "A Personal Finance Application",
  icons: {
    icon: "/icons/logo.svg",
  },
};

// here we use tsx to define the children props being read only
// and also being renderable types such as JSX, frags, etc
// will apply style to child elements that it encompasses
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  //html
  //apply the custom styles we hav earlier on child elements
  return (
    <html lang="en">
      <body className={`${inter.variable}${ibmPlexSerif.variable}`}>
        {children}
      </body>
    </html>
  );
}
