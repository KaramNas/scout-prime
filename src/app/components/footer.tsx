"use client";

export default function MainFooter() {
  const bgImage = "/backgrounds/blacktools.jpg"; // Change this to your image

  return (
    <footer
      className="relative text-white py-16 bg-cover bg-center"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark Overlay for readability */}
      <div className="absolute inset-0" />

      {/* Footer Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        {/* Logo or Title */}
        <h2 className="text-3xl font-bold mb-4">Your Project Name</h2>

        {/* Navigation Links */}
        <ul className="flex flex-wrap justify-center gap-6 text-lg mb-6">
          <li><a href="/about" className="hover:text-gray-300">About Us</a></li>
          <li><a href="/contact" className="hover:text-gray-300">Contact</a></li>
          <li><a href="/privacy" className="hover:text-gray-300">Privacy Policy</a></li>
          <li><a href="/terms" className="hover:text-gray-300">Terms of Use</a></li>
        </ul>

        {/* Social Links */}
        <div className="flex justify-center space-x-6 text-xl">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300">🌍</a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300">🐦</a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300">📸</a>
        </div>

        {/* Copyright */}
        <p className="mt-6 text-gray-300 text-sm">
          © {new Date().getFullYear()} Your Project. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
