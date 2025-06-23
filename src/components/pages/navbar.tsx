"use client"
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Waves, Menu, X, User, LogIn, UserPlus, LayoutDashboard, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu"
import { useSession, signOut } from "next-auth/react";


const links = [
  { name: "Home", path: "/" },
  {
    name: "Menu",
    path: "/menu",
    children: [
      { name: "Meal Plan", path: "/menu/mealplans" },
      { name: "Special Menu", path: "/menu/special" },
      { name: "Catering Packages", path: "/menu/packages" },
    ],
  },
  { name: "Subscription", path: "/subscription" },
  { name: "Contact Us", path: "/contact" },
];


export default function Navbar() {


  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;
  const { data: session, status } = useSession();
  const isAdmin = status === "authenticated" && session?.user?.role?.toLowerCase() === "admin";
  const authLinks = [
    { name: "Login", path: "/login", icon: LogIn },
    { name: "Register", path: "/register", icon: UserPlus },
    { name: "Dashboard", path: isAdmin ? "/dashboard/admin" : "/dashboard/user", icon: LayoutDashboard },
  ];
  const handleNavigation = (path: string) => {
    router.push(path);
    setIsMobileMenuOpen(false);
    setIsMobileDropdownOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setIsMobileDropdownOpen(false);
  };
  // console.log("Session:", session);
  // console.log("Status:", status);
  // console.log("Role dari session:", session?.user?.role);
  // console.log(isAdmin)

  return (
    <nav className="fixed top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm">
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
                        relative px-4 py-2 text-sm font-medium transition-all duration-200 flex items-center gap-1
                        ${isActive(link.path)
                          ? "bg-yellow-600 text-white shadow-md"
                          : "text-gray-700 hover:text-yellow-600 hover:bg-yellow-50"
                        }
                      `}
                    >
                      {link.name}
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-48">
                    {link.children.map((child) => (
                      <DropdownMenuItem
                        key={child.path}
                        onClick={() => handleNavigation(child.path)}
                        className={`cursor-pointer ${isActive(child.path) ? "bg-yellow-100 text-yellow-800" : ""}`}
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

          {/* Desktop Auth Buttons */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="md:flex hidden items-center gap-2 border-yellow-200 hover:bg-yellow-50">
                <User className="h-4 w-4" />
                Account
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {status === "loading" ? (
                <DropdownMenuItem disabled>Loading...</DropdownMenuItem>
              ) : session ? (
                <>
                  <DropdownMenuItem disabled className="font-semibold text-yellow-600">
                    👋 {session.user?.name || session.user?.email}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleNavigation(isAdmin ? "dashboard/admin" : "/dashboard/user")}>
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>
                    <LogIn className="h-4 w-4 mr-2 rotate-180" />
                    Logout
                  </DropdownMenuItem>
                </>
              ) : (
                authLinks.map((authLink, index) => (
                  <div key={authLink.path}>
                    <DropdownMenuItem
                      onClick={() => handleNavigation(authLink.path)}
                      className={`cursor-pointer flex items-center gap-2 ${isActive(authLink.path) ? "bg-yellow-100 text-yellow-800" : ""}`}
                    >
                      <authLink.icon className="h-4 w-4" />
                      {authLink.name}
                    </DropdownMenuItem>
                    {index < authLinks.length - 1 && <DropdownMenuSeparator />}
                  </div>
                ))
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMobileMenu}
              className="h-10 w-10 p-0 hover:bg-yellow-50"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 text-gray-700" />
              ) : (
                <Menu className="h-6 w-6 text-gray-700" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t bg-white/95 backdrop-blur">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {links.map((link) =>
                link.children ? (
                  <div key={link.name} className="space-y-1">
                    <Button
                      variant="ghost"
                      className={`
                        w-full justify-between text-left h-12 text-base font-medium transition-all duration-200
                        ${isActive(link.path)
                          ? "bg-yellow-600 text-white shadow-md"
                          : "text-gray-700 hover:text-yellow-600 hover:bg-yellow-50"
                        }
                      `}
                      onClick={() => setIsMobileDropdownOpen(!isMobileDropdownOpen)}
                    >
                      {link.name}
                      <ChevronDown
                        className={`h-4 w-4 transition-transform duration-200 ${isMobileDropdownOpen ? "rotate-180" : ""
                          }`}
                      />
                    </Button>
                    {isMobileDropdownOpen && (
                      <div className="ml-4 space-y-1 animate-in slide-in-from-top-2 duration-200">
                        {link.children.map((child) => (
                          <Button
                            key={child.path}
                            variant={isActive(child.path) ? "default" : "ghost"}
                            className={`
                              w-full justify-start text-left h-10 text-sm font-normal
                              ${isActive(child.path)
                                ? "bg-yellow-600 text-white shadow-md"
                                : "text-gray-600 hover:text-yellow-600 hover:bg-yellow-50"
                              }
                            `}
                            onClick={() => handleNavigation(child.path)}
                          >
                            {child.name}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Button
                    key={link.path}
                    variant={isActive(link.path) ? "default" : "ghost"}
                    className={`
                      w-full justify-start text-left h-12 text-base font-medium transition-all duration-200
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

              {/* Mobile Auth Section */}
              <div className="pt-4 mt-4 border-t border-gray-200">
                <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Account
                </p>
                {status === "loading" ? (
                  <p className="px-3 text-sm text-gray-500">Loading...</p>
                ) : session ? (
                  <>
                    <p className="px-3 text-sm font-semibold text-yellow-600">
                      👋 {session.user?.name || session.user?.email}
                    </p>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-left h-12 text-base font-medium flex items-center gap-3 text-gray-700 hover:text-yellow-600 hover:bg-yellow-50"
                      onClick={() => handleNavigation(isAdmin ? "dashboard/admin" : "/dashboard/user")}
                    >
                      <LayoutDashboard className="h-5 w-5" />
                      Dashboard
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-left h-12 text-base font-medium flex items-center gap-3 text-gray-700 hover:text-yellow-600 hover:bg-yellow-50"
                      onClick={async () =>

                        await signOut({ callbackUrl: "/" })}
                    >
                      <LogIn className="h-5 w-5 rotate-180" />
                      Logout
                    </Button>
                  </>
                ) : (
                  authLinks.map((authLink) => (
                    <Button
                      key={authLink.path}
                      variant={isActive(authLink.path) ? "default" : "ghost"}
                      className={`w-full justify-start text-left h-12 text-base font-medium flex items-center gap-3
          ${isActive(authLink.path)
                          ? "bg-yellow-600 text-white shadow-md"
                          : "text-gray-700 hover:text-yellow-600 hover:bg-yellow-50"
                        }`}
                      onClick={() => handleNavigation(authLink.path)}
                    >
                      <authLink.icon className="h-5 w-5" />
                      {authLink.name}
                    </Button>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}