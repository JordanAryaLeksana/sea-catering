"use client"
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { Menu,  Waves } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";

const links = [
  { name: "Home", path: "/" },
  { name: "Menu", path: "/menu" },
  { name: "Subscription", path: "/subscription" },
  { name: "Contact Us", path: "/contact" },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  const handleNavigation = (path: string) => {
    router.push(path);
    setIsOpen(false); 
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
            {links.map((link) => (
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
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-10 w-10">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle className="flex items-center space-x-2">
                    <Waves className="h-6 w-6 text-yellow-600" />
                    <span className="bg-gradient-to-r from-yellow-600 to-cyan-600 bg-clip-text text-transparent">
                      SEA Catering
                    </span>
                  </SheetTitle>
                  <SheetDescription>
                    Navigate to explore our premium catering services
                  </SheetDescription>
                </SheetHeader>
                
                <div className="mt-8 flex flex-col space-y-3">
                  {links.map((link) => (
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
                  ))}
                </div>

                {/* Mobile Menu Footer */}
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="rounded-lg bg-gradient-to-r from-yellow-50 to-cyan-50 p-4 text-center">
                    <p className="text-sm text-gray-600">
                      Premium catering services for your special occasions
                    </p>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}