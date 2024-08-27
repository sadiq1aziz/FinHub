"use client";

import { sidebarLinks } from "@/constants";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";

// we pass user data to the sidebar to render content accordingly
const SideBar = ({ user }: SiderbarProps) => {
  const pathName = usePathname();

  return (
    <section className="sidebar">
      <nav className="flex flex-col gap-4">
        <Link
          href="/"
          // flex to make the logo and title appear side by side
          className="mb-15 flex
                gap-2 items-center cursor-pointer"
        >
          <Image
            src="/icons/logo.svg"
            alt="FinHub logo"
            height={34}
            width={34}
            className="size-[35px]
                    max-xl:size-14
                    "
          />
          <h1 className="sidebar-logo">FinHub</h1>
        </Link>
        {
          /* Here we are done with the Logo and assigning a link to it
            We then focus on iterating thruough the various links that we showcase to the user
            applying selective styling based on pathname      
  
        */
          sidebarLinks.map((item) => {
            // we perform the logic to activate the style if current page/path
            // matches with the link that is clicked
            const isActive =
              pathName === item.route || pathName.startsWith(`${item.route}/`);

            return (
              <Link
                href={item.route}
                key={item.label}
                // here we use cn lib from utils to apply css based on activation
                // Note: the sidebar-link class has a flex prop, therefore the child elements
                // namely the img and label will be positioned next to each other
                className={cn("sidebar-link", {
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
                    className={cn({
                      "brightness-[3] invert-0": isActive,
                    })}
                  />
                </div>
                 {/*We then create the title + selective styling */}
                 <p
                    className={cn('sidebar-label', {
                      "!text-white": isActive,
                    })}
                  >
                    {item.label}
                  </p>
              </Link>
            );
          })
        }
      </nav>
    </section>
  );
};

export default SideBar;
