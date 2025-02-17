"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function HomeParalax() {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setOffset(window.scrollY * 0.5);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative w-full h-[600px] overflow-hidden">
      {/* Parallax Image */}
      <div
        className="absolute top-0 left-0 w-full h-full bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: "url('/images/parallaxmainimage.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        
        }}
      />

      {/* Overlay Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 bg-black/50 text-white">
        <h1 className="text-4xl font-bold">Explore Lebanon’s<span className="text-titletextyellow"> Nature</span></h1>
        <p className="mt-4 max-w-xl text-lg">
          Join our Scouts in mapping Lebanon’s wildlife, trees, and natural ecosystems.
        </p>
        <Link href="/about">
          <button className="mt-6 px-6 py-3 bg-titletextyellow text-titletextblack font-semibold rounded-lg shadow-md hover:bg-opacity-80 transition">
            Learn More
          </button>
        </Link>
      </div>
    </div>
  );
}
