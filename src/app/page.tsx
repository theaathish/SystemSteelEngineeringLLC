"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Head from "next/head";
import FlipWords from "@/components/ui/flip-words";

export default function Home() {
  const slides = [
    { src: "/Hero1.jpg", key: "slide1", alt: "Hero Image 1" },
    { src: "/Hero2.jpg", key: "slide2", alt: "Hero Image 2" },
    { src: "/Hero3.jpg", key: "slide3", alt: "Hero Image 3" },
    { src: "/Hero4.jpg", key: "slide4", alt: "Hero Image 4" },
    { src: "/Hero5.jpeg", key: "slide5", alt: "Hero Image 5" },
    { src: "/Hero6.jpg", key: "slide6", alt: "Hero Image 6" }, // Corrected filename
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  // Array of words for flipping animation
  const flipWords = ["Quality", "Innovation", "Reliability", "Excellence"];

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prevSlide) =>
        prevSlide === slides.length - 1 ? 0 : prevSlide + 1
      );
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(slideInterval);
  }, [slides.length]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Head>
        <title>System Steel Engineering | Advanced Steel Solutions in UAE</title>
        <meta
          name="description"
          content="System Steel Engineering delivers excellence in steel fabrication and structural engineering across the UAE. Explore our advanced solutions tailored to your needs."
        />
        <meta
          name="keywords"
          content="Steel Engineering, Steel Fabrication, Structural Engineering, UAE Steel Solutions"
        />
        {/* Open Graph Meta Tags */}
        <meta
          property="og:title"
          content="System Steel Engineering | Advanced Steel Solutions in UAE"
        />
        <meta
          property="og:description"
          content="Delivering excellence in steel fabrication and structural engineering across the UAE."
        />
        <meta property="og:image" content="/hero.jpg" />
        <meta property="og:url" content="https://www.systemsteelengg.com/" />
        <meta property="og:type" content="website" />
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="System Steel Engineering | Advanced Steel Solutions in UAE"
        />
        <meta
          name="twitter:description"
          content="Delivering excellence in steel fabrication and structural engineering across the UAE."
        />
        <meta name="twitter:image" content="/hero.jpg" />
      </Head>

      <Navbar />

      {/* Hero Carousel Section */}
      <section
        className="relative h-screen overflow-hidden"
        aria-label="Hero Carousel"
      >
        {/* Slides */}
        {slides.map((slide, index) => (
          <div
            key={slide.key}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              layout="fill"
              objectFit="cover"
              className="brightness-50"
              priority={index === 0} // Prioritize loading the first image
            />
          </div>
        ))}

        {/* Overlay Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4">
          <h1 className="text-3xl font-bold mb-4 text-center">
            Welcome to System Steel Engineering LLC {""}
            <FlipWords
              words={flipWords}
              duration={3000}
              className="ml-2 relative inline-block h-8 w-40 overflow-hidden"
            />
          </h1>
          <p className="text-xl max-w-2xl text-center">
            Delivering excellence in steel fabrication and structural engineering
            across the UAE.
          </p>
        </div>

        {/* Navigation Controls */}
        <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex space-x-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full ${
                index === currentSlide ? "bg-white" : "bg-gray-300"
              } focus:outline-none`}
              aria-label={`Slide ${index + 1}`}
            ></button>
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
        Our Services
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
        {[
          {
            title: "Structural Engineering",
            description:
          "Expert structural steel design and analysis for complex projects.",
            icon: "🏗️",
            link: "/services#structural-engineering",
          },
          {
            title: "Steel Fabrication",
            description:
          "Precision fabrication with state-of-the-art equipment.",
            icon: "⚙️",
            link: "/services#steel-fabrication",
          },
          {
            title: "Project Management",
            description:
          "Comprehensive project management from concept to completion.",
            icon: "📋",
            link: "/services#project-management",
          },
        ].map((service, index) => (
          <Link
            key={index}
            href={service.link}
            className="block bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow hover:bg-gray-50"
          >
            <div className="text-4xl mb-4">{service.icon}</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900">
          {service.title}
            </h3>
            <p className="text-gray-600">{service.description}</p>
          </Link>
        ))}
          </div>
        </div>
      </section>

      {/* About Preview Section */}
      <section className="bg-gray-50 py-12 md:py-20 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <div className="w-full md:w-1/2 text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-gray-900">
              About System Steel
            </h2>
            <p className="text-gray-600 mb-6 text-sm md:text-base">
              With decades of experience in steel engineering, we deliver innovative
              solutions for complex structural challenges. Our commitment to quality
              and precision sets us apart in the industry.
            </p>
            <Link
              href="/about"
              className="inline-block px-4 md:px-6 py-2 md:py-3 bg-gray-900 text-white text-sm md:text-base font-semibold rounded-lg hover:bg-gray-800 transition-colors"
            >
              Learn More
            </Link>
          </div>
          <div className="w-full md:w-1/2 relative h-[300px] md:h-[400px] mt-6 md:mt-0">
            <Image
              src="/hero.PNG"
              alt="Steel Engineering Facility"
              fill
              className="object-cover rounded-xl"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="mt-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            What Our Clients Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Review 1 */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <Image
                  src="/clients/client1.jpg"
                  alt="John Doe"
                  width={50}
                  height={50}
                  className="rounded-full"
                />
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-800">John Doe</h3>
                  <p className="text-sm text-gray-500">CEO, ABC Corp</p>
                </div>
              </div>
              <p className="text-gray-600">
                "System Steel Engineering provided outstanding service and delivered our
                project ahead of schedule. Highly recommended!"
              </p>
            </div>

            {/* Review 2 */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <Image
                  src="/clients/client2.jpg"
                  alt="Jane Smith"
                  width={50}
                  height={50}
                  className="rounded-full"
                />
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-800">Jane Smith</h3>
                  <p className="text-sm text-gray-500">Managing Director, XYZ Ltd</p>
                </div>
              </div>
              <p className="text-gray-600">
                "Their expertise in steel fabrication is unparalleled. Our facility looks
                better than ever thanks to their team."
              </p>
            </div>

            {/* Review 3 */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <Image
                  src="/clients/client3.jpg"
                  alt="Michael Brown"
                  width={50}
                  height={50}
                  className="rounded-full"
                />
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-800">Michael Brown</h3>
                  <p className="text-sm text-gray-500">
                    Project Manager, DEF Industries
                  </p>
                </div>
              </div>
              <p className="text-gray-600">
                "Professional and reliable. They handled our complex structural engineering
                needs with ease."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Client Logos Section */}
      <section className="mt-16 bg-gray-100 py-12 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Our Clients
          </h2>
          <div className="relative overflow-hidden">
            <div className="flex animate-scroll-right">
              {/* First set of logos */}
              {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                <div
                  key={`logo-${num}`}
                  className="flex-shrink-0 w-32 h-16 mx-4 flex items-center justify-center bg-white p-4 rounded-lg shadow-sm border border-gray-100"
                >
                  <Image
                    src={`/client${num}.png`}
                    alt={`Client ${num} Logo`}
                    width={100}
                    height={50}
                    className="object-contain"
                  />
                </div>
              ))}
              {/* Duplicate set for seamless loop */}
              {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                <div
                  key={`logo-duplicate-${num}`}
                  className="flex-shrink-0 w-32 h-16 mx-4 flex items-center justify-center bg-white p-4 rounded-lg shadow-sm border border-gray-100"
                >
                  <Image
                    src={`/client${num}.png`}
                    alt={`Client Duplicate ${num} Logo`}
                    width={100}
                    height={50}
                    className="object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* Flip and Scroll Animation Styles */}
      <style jsx>{`
        @keyframes flip {
          0% {
            transform: rotateX(0deg);
            opacity: 1;
          }
          50% {
            transform: rotateX(-90deg);
            opacity: 0;
          }
          100% {
            transform: rotateX(0deg);
            opacity: 1;
          }
        }

        .animate-flip {
          animation: flip 1s forwards;
          animation-delay: 2.9s;
        }

        @keyframes scroll-right {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-scroll-right {
          animation: scroll-right 20s linear infinite;
        }
      `}</style>
    </div>
  );
}
