"use client"
import { useRouter, usePathname } from "next/navigation";
import { Waves } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"

const links = [
  { name: "Home", path: "/" },
  {
    name: "Menu",
    path: "/menu",
    children: [
      { name: "Meal Plan", path: "/menu/mealplans" },
    ],
  },
  { name: "Subscription", path: "/subscription" },
  { name: "Contact Us", path: "/contact" },
];


export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  

  const isActive = (path: string) => pathname === path;

  const handleNavigation = (path: string) => {
    router.push(path);

  };
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div
            className="flex items-center space-x-2 cursor-pointer transition-all duration-200 hover:scale-105"
            onClick={() => handleNavigation("/")}
          >
            <div className="relative">
              <Waves className="h-8 w-8 text-yellow-600" />
              <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-yellow-100 animate-pulse" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-yellow-600 to-cyan-600 bg-clip-text text-transparent">
              SEA Catering
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {links.map((link) =>
              link.children ? (
                <DropdownMenu key={link.name}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant={isActive(link.path) ? "default" : "ghost"}
                      className={`
              relative px-4 py-2 text-sm font-medium transition-all duration-200
              ${isActive(link.path)
                          ? "bg-yellow-600 text-white shadow-md"
                          : "text-gray-700 hover:text-yellow-600 hover:bg-yellow-50"
                        }
            `}
                    >
                      {link.name}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    {link.children.map((child) => (
                      <DropdownMenuItem
                        key={child.path}
                        onClick={() => handleNavigation(child.path)}
                        className={isActive(child.path) ? "bg-yellow-100" : ""}
                      >
                        {child.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  key={link.path}
                  variant={isActive(link.path) ? "default" : "ghost"}
                  className={`
          relative px-4 py-2 text-sm font-medium transition-all duration-200
          ${isActive(link.path)
                      ? "bg-yellow-600 text-white shadow-md"
                      : "text-gray-700 hover:text-yellow-600 hover:bg-yellow-50"
                    }
        `}
                  onClick={() => handleNavigation(link.path)}
                >
                  {link.name}
                  {isActive(link.path) && (
                    <div className="absolute -bottom-1 left-1/2 h-1 w-8 -translate-x-1/2 rounded-full bg-white" />
                  )}
                </Button>
              )
            )}
          </div>


          {/* Mobile Menu Button */}
          <div className="mt-8 flex flex-col space-y-3">
            {links.map((link) =>
              link.children ? (
                <div key={link.name}>
                  <p className="px-2 text-sm font-semibold text-gray-500">{link.name}</p>
                  <div className="ml-4 mt-1 flex flex-col space-y-2">
                    {link.children.map((child) => (
                      <Button
                        key={child.path}
                        variant={isActive(child.path) ? "default" : "ghost"}
                        className={`
                justify-start text-left h-10 text-sm font-normal
                ${isActive(child.path)
                            ? "bg-yellow-600 text-white shadow-md"
                            : "text-gray-700 hover:text-yellow-600 hover:bg-yellow-50"}
              `}
                        onClick={() => handleNavigation(child.path)}
                      >
                        {child.name}
                      </Button>
                    ))}
                  </div>
                </div>
              ) : (
                <Button
                  key={link.path}
                  variant={isActive(link.path) ? "default" : "ghost"}
                  className={`
          justify-start text-left h-12 text-base font-medium transition-all duration-200
          ${isActive(link.path)
                      ? "bg-yellow-600 text-white shadow-md"
                      : "text-gray-700 hover:text-yellow-600 hover:bg-yellow-50"
                    }
        `}
                  onClick={() => handleNavigation(link.path)}
                >
                  {link.name}
                </Button>
              )
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}