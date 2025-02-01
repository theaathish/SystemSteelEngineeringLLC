import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <Image 
              src="/logo.png" 
              alt="System Steel" 
              width={120} 
              height={40} 
              className="mb-4"
            />
            <p className="text-gray-600 text-sm">
              Leading provider of advanced steel engineering solutions in UAE
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Contact</h3>
            <div className="space-y-2 text-sm">
              <p className="text-gray-600">Email: info@systemsteelengg.com</p>
              <p className="text-gray-600">Phone: +971 6 5362000</p>
              <p className="text-gray-600">Mobile: +971 50 3948715</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Quick Links</h3>
            <nav className="flex flex-col gap-2">
              <Link href="/" className="text-gray-600 hover:text-gray-900 text-sm">Home</Link>
              <Link href="/services" className="text-gray-600 hover:text-gray-900 text-sm">Services</Link>
              <Link href="/projects" className="text-gray-600 hover:text-gray-900 text-sm">Projects</Link>
              <Link href="/careers" className="text-gray-600 hover:text-gray-900 text-sm">Careers</Link>
              <Link href="/about" className="text-gray-600 hover:text-gray-900 text-sm">About</Link>
              <Link href="/contact" className="text-gray-600 hover:text-gray-900 text-sm">Contact</Link>
            </nav>
          </div>

          {/* Address */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Location</h3>
            <p className="text-gray-600 text-sm">
              System Steel Engineering LLC<br />
              P.o.Box:45514,<br />
              Al Sajaah - Sharjah & Dubai<br />
              United Arab Emirates
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-100 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © 2024 System Steel Engineering. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-gray-400 hover:text-gray-600">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}