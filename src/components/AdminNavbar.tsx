"use client";

import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import { Separator } from "./ui/separator";
import { SidebarTrigger } from "./ui/sidebar";
import React from "react";

function capitalize(str: string) {
  return str.slice(0, 1).toUpperCase() + str.slice(1);
}

export function AdminNavbar() {
  const pathname = usePathname();
  return (
    <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb>
          <BreadcrumbList>
            {pathname
              .split("/")
              .slice(1)
              .map((x, i) => (
                <React.Fragment key={i}>
                  <BreadcrumbItem>
                    <BreadcrumbLink
                      href={pathname
                        .split("/")
                        .slice(0, i + 2)
                        .join("/")}
                    >
                      {capitalize(x)}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  {i != pathname.split("/").length - 2 && (
                    <BreadcrumbSeparator />
                  )}
                </React.Fragment>
              ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
}
