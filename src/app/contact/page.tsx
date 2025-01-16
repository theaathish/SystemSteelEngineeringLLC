import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Contact() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      <main className="flex-1 py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <section className="relative h-96 mb-16 sm:h-64">
            <Image
              src="/contact-banner.jpg"
              alt="Contact Us"
              layout="fill"
              objectFit="cover"
              className="brightness-50 rounded-xl"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
              <h1 className="text-4xl font-bold mb-4 sm:text-2xl">Contact Us</h1>
              <p className="text-lg sm:text-sm">
                We'd love to hear from you. Please fill out this form or send us an email.
              </p>
            </div>
          </section>

          <h1 className="text-4xl font-bold text-gray-800 mb-4 text-center">Get in Touch</h1>
          <p className="text-gray-600 text-center mb-16 max-w-2xl mx-auto">
            We'd love to hear from you. Please fill out this form or send us an email.
          </p>

            <div className="grid md:grid-cols-3 gap-8">
            {/* Contact Information */}
            <div className="md:col-span-1 space-y-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-semibold text-black mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div>
                <p className="text-sm text-black">Email</p>
                <p className="text-black">info@systemsteelengg.com</p>
                </div>
                <div>
                <p className="text-sm text-black">Phone</p>
                <p className="text-black">+971 6 5362000</p>
                <p className="text-black">+971 50 3948715</p>
                </div>
                <div>
                <p className="text-sm text-black">Address</p>
                <p className="text-black">P.o.Box:45514, Al Sajaah - Sharjah - United Arab Emirates</p>
                </div>
              </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="md:col-span-2">
              <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <form 
              action="https://getform.io/f/bmddlnpa" 
              method="POST" 
              className="mt-8 max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md"
              >
              <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-black">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200 text-black opacity-100"
                placeholder="Your Name"
              />
              </div>
              
              <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-black">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200 text-black opacity-100"
                placeholder="you@example.com"
              />
              </div>
              
              <div className="mb-4">
              <label htmlFor="message" className="block text-sm font-medium text-black">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-200 text-black opacity-100"
                placeholder="Your message..."
              ></textarea>
              </div>
              
              <button
              type="submit"
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
              Send Message
              </button>
              </form>
              </div>
            </div>
            </div>


          {/* Map Section */}
          <div className="mt-16">
            <div className="w-full h-[400px] rounded-xl overflow-hidden shadow-sm border border-gray-100">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3606.0458988766424!2d55.63748891501685!3d25.324079783838568!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ef5f39092065a33%3A0xeefb033d5f8b5f20!2sSystem%20Steel%20Engineering%20LLC!5e0!3m2!1sen!2sae!4v1677584333991!5m2!1sen!2sae"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
