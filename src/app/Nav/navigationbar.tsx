"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <nav className="bg-ke7li50 shadow-md fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto flex items-center justify-center py-4">
        {/* Centered Navbar Items */}
        <div className="flex items-center gap-x-16"> {/* Increased from gap-x-12 to gap-x-16 */}
          
          {/* Left Links */}
          <ul className="flex space-x-14 text-lg font-medium"> {/* Increased from space-x-10 to space-x-14 */}
            <li>
              <Link href="/" className="hover:text-yellow transition text-white">Home</Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-yellow transition text-white">About</Link>
            </li>
          </ul>

          {/* Logo in the center */}
          <Link href="/" className="flex items-center">
            <Image src="/images/navlogo.png" alt="Logo" width={80} height={80} className="cursor-pointer" />
          </Link>

          {/* Right Links */}
          <ul className="flex space-x-14 text-lg font-medium"> {/* Increased from space-x-10 to space-x-14 */}
            {/* More Dropdown */}
            <li
              className="relative"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <button className="hover:text-yellow transition text-white">More</button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-44 bg-white shadow-lg rounded-lg py-2">
                  <Link href="/services" className="block px-4 py-2 hover:bg-gray-100">Services</Link>
                  <Link href="/projects" className="block px-4 py-2 hover:bg-gray-100">Projects</Link>
                  <Link href="/team" className="block px-4 py-2 hover:bg-gray-100">Team</Link>
                </div>
              )}
            </li>

            <li>
              <Link href="/contact" className="hover:text-yellow transition text-white">Contact</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
