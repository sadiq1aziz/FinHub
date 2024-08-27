import React from "react";


// here we use tsx to define the children props being read only 
// and also being renderable types such as JSX, frags, etc
// will apply style to child elements that it encompasses


// we use nested layout structure to have one layout for a set of pages
// i.e auth layout for auth pages 

export default function RootLayout({
  children
}: Readonly<{children: React.ReactNode;}>){
  return (
    <main>
        {children}    
    </main>
  );
}