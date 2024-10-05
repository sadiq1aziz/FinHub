"use client";

import React from "react";
import Image from "next/image";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { sidebarLinks } from "@/constants";
import { usePathname } from "next/navigation";
import Footer from "./Footer";
const MobileNav = ({ user }: MobileNavProps) => {
  const pathName = usePathname();

  return (
    <section>
      <Sheet>
        <SheetTrigger>
          <Image
            src="/icons/hamburger.svg"
            alt="menu-icon"
            width={30}
            height={30}
          />
        </SheetTrigger>
        {/* attribute to position navbar/sheet + set to opaque */}
        <SheetContent side="left" className=" bg-white ">
          <Link
            href="/"
            // flex to make the logo and title appear side by side
            className="flex gap-2"
          >
            <Image
              src="/icons/logo.svg"
              alt="FinHub logo"
              height={30}
              width={30}
            />
            <h1 className="mobilenav-label">FinHub</h1>
          </Link>
          <div className="mobilenav-sheet">
            <SheetClose asChild>
              {/* css for top margin spacing and between elements */}
              <nav className="flex flex-col h-full gap-5 pt-10 text-white">
                {
                  /* Here we are done with the Logo and assigning a link to it
                     We then focus on iterating thruough the various links that we showcase to the user
                     applying selective styling based on pathname  */
                  sidebarLinks.map((item) => {
                    // we perform the logic to activate the style if current page/path
                    // matches with the link that is clicked
                    const isActive =
                      pathName === item.route ||
                      pathName.startsWith(`${item.route}/`);

                    return (
                      <SheetClose asChild key={item.label}>
                        <Link
                          href={item.route}
                          // here we use cn lib from utils to apply css based on activation
                          // Note: the sidebar-link class has a flex prop, therefore the child elements
                          // namely the img and label will be positioned next to each other
                          className={cn("mobilenav-sheet-link", {
                            "bg-bank-gradient": isActive,
                          })}
                        >
                          {/* relative positioning for the parent div therefore, styles on child elements will be relative to this div */}
                          <div className="relative size-6">
                            {/*We then create the img + selective styling */}
                            <Image
                              src={item.imgURL}
                              alt={item.label}
                              fill
                              // apply selective css on img when selected
                              className={cn('mobilenav-sheet-img',{
                                "brightness-[3] invert-0": isActive,
                              })}
                            />
                          </div>
                          {/*We then create the title + selective styling */}
                          <p
                            className={cn("mobilenav-sheet-link-text", {
                              "!text-white": isActive,
                            })}
                          >
                            {item.label}
                          </p>
                        </Link>
                      </SheetClose>
                    );
                  })
                }
              </nav>
            </SheetClose>
           <Footer user={user} type='mobile'/>
          </div>
        </SheetContent>
      </Sheet>
    </section>
  );
};

export default MobileNav;
