"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { House, Info, List, Phone, Briefcase, Users } from "@phosphor-icons/react";

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Map icons to corresponding labels
  const navItems = [
    { label: "Home", href: "/", icon: <House size={18} className="opacity-0 group-hover:opacity-100 group-hover:-translate-y-2 transition-all duration-500 text-yellow" /> },
    { label: "About", href: "/about", icon: <Info size={18} className="opacity-0 group-hover:opacity-100 group-hover:-translate-y-2 transition-all duration-500 text-yellow" /> },
    { label: "More", href: "#", icon: <List size={18} className="opacity-0 group-hover:opacity-100 group-hover:-translate-y-2 transition-all duration-500 text-yellow" />, dropdown: true },
    { label: "Contact", href: "/contact", icon: <Phone size={18} className="opacity-0 group-hover:opacity-100 group-hover:-translate-y-2 transition-all duration-500 text-yellow" /> },
  ];

  return (
    <nav className="bg-backgroundblack80 shadow-md fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto flex items-center justify-center py-4">
        {/* Centered Navbar Items */}
        <div className="flex items-center gap-x-16">
          {/* Left Links */}
          <ul className="flex space-x-14 text-lg font-medium">
            {navItems.slice(0, 2).map((item, index) => (
              <li key={index} className="group relative">
                <Link href={item.href} className="flex flex-col items-center text-white hover:text-yellow transition-all duration-200">
                  {item.icon}
                  <span className="group-hover:scale-110 transition-all duration-200">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>

          {/* Logo in the center */}
          <Link href="/" className="flex items-center">
            <Image src="/images/navlogo.png" alt="Logo" width={80} height={80} className="cursor-pointer" />
          </Link>

          {/* Right Links */}
          <ul className="flex space-x-14 text-lg font-medium">
            {navItems.slice(2).map((item, index) => (
              <li key={index} className="group relative">
                {item.dropdown ? (
                  <div
                    onMouseEnter={() => setIsDropdownOpen(true)}
                    onMouseLeave={() => setIsDropdownOpen(false)}
                  >
                    <button className="flex flex-col items-center text-white hover:text-yellow transition-all duration-500">
                      {item.icon}
                      <span className="group-hover:scale-110 transition-all duration-500">{item.label}</span>
                    </button>

                    {/* Dropdown Menu */}
                    {isDropdownOpen && (
                      <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-44 bg-white shadow-lg rounded-lg py-2">
                        <Link href="/services" className="block px-4 py-2 hover:bg-gray-100 flex items-center">
                          <Briefcase size={16} className="mr-2 text-titletextblack" /> Services
                        </Link>
                        <Link href="/projects" className="block px-4 py-2 hover:bg-gray-100 flex items-center">
                          <List size={16} className="mr-2 text-titletextblack" /> Projects
                        </Link>
                        <Link href="/team" className="block px-4 py-2 hover:bg-gray-100 flex items-center">
                          <Users size={16} className="mr-2 text-titletextblack" /> Team
                        </Link>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link href={item.href} className="flex flex-col items-center text-white hover:text-yellow transition-all duration-200">
                    {item.icon}
                    <span className="group-hover:scale-110 transition-all duration-200">{item.label}</span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}
