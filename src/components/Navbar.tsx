"use client"

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="fixed w-full bg-white border-b border-gray-100 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image 
            src="/logo.png" 
            alt="System Steel Engineering" 
            width={40} 
            height={40} 
            className="h-10 w-auto"
          />
          <span className="font-bold text-xl text-gray-900">

          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-gray-600 hover:text-gray-900 font-medium text-sm transition-colors">
            Home
          </Link>
          <Link href="/services" className="text-gray-600 hover:text-gray-900 font-medium text-sm transition-colors">
            Services
          </Link>
          <Link href="/projects" className="text-gray-600 hover:text-gray-900 font-medium text-sm transition-colors">
            Projects
          </Link>
          <Link href="/careers" className="text-gray-600 hover:text-gray-900 font-medium text-sm transition-colors">
            Careers
          </Link>
          <Link href="/about" className="text-gray-600 hover:text-gray-900 font-medium text-sm transition-colors">
            About
          </Link>
          <Link href="/contact" className="text-gray-600 hover:text-gray-900 font-medium text-sm transition-colors">
            Contact
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle Menu"
        >
          <svg 
            className="h-6 w-6 text-gray-600"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isMobileMenuOpen ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <nav className="px-4 pt-2 pb-4 space-y-2 bg-white border-t border-gray-100">
            <Link 
              href="/" 
              className="block py-2 text-gray-600 hover:text-gray-900 font-medium text-sm transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              href="/services"
              className="block py-2 text-gray-600 hover:text-gray-900 font-medium text-sm transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Services
            </Link>
            <Link 
              href="/projects"
              className="block py-2 text-gray-600 hover:text-gray-900 font-medium text-sm transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Projects
            </Link>
            <Link 
              href="/careers"
              className="block py-2 text-gray-600 hover:text-gray-900 font-medium text-sm transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Careers
            </Link>
            <Link 
              href="/about"
              className="block py-2 text-gray-600 hover:text-gray-900 font-medium text-sm transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              href="/contact"
              className="block py-2 text-gray-600 hover:text-gray-900 font-medium text-sm transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}