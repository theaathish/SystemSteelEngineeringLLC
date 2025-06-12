"use client";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import React from 'react';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1 py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <section className="relative h-[300px] md:h-[400px] lg:h-[500px] mb-16">
            <Image
              src="/about-banner.jpg"
              alt="About Us"
              fill
              className="brightness-50 rounded-xl object-cover"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">About Us</h1>
              <p className="text-base md:text-lg">
                We are committed to delivering top-notch steel engineering solutions tailored to your needs.
              </p>
            </div>
          </section>

          {/* Content Section */}
          <div className="py-16 px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="relative h-[400px]">
                <Image
                  src="/About_left.jpg"
                  alt="About Us Image"
                  fill
                  className="rounded-lg object-cover"
                />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-6">
                  Leading Steel Engineering Solutions
                </h2>
                <p className="text-gray-600 mb-4">
                  System Steel Engineering LLC is a highly regarded privately-owned company headquartered in Umm Al Quwain, United Arab Emirates. We are proud to have branch companies and licenses in Dubai, Sharjah and Umm Al Quwain Emirates. Furthermore, we are expanding our reach to the Middle East and Africa, having already executed projects in Saudi Arabia. With a 7-year track record of success, we have achieved consistent growth and profitability, demonstrating our commitment to quality and excellence.
                </p>
              </div>
            </div>

            {/* Our Expertise Section */}
            <div className="mt-12">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Our Expertise</h3>
                <ul className="space-y-2 text-gray-600 list-disc list-inside">
                  <li>Structural Steel Design</li>
                  <li>Industrial Solutions</li>
                  <li>Custom Fabrication</li>
                  <li>Project Management</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
