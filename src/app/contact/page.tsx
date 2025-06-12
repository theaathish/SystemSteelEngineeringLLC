"use client";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        console.error('Form submission error:', data.error);
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Network error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

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
              fill
              className="brightness-50 rounded-xl object-cover"
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
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-black mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                      placeholder="Your Full Name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-black mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                      placeholder="your.email@example.com"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-black mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                      placeholder="Please describe your project requirements, questions, or how we can help you..."
                    />
                  </div>
                  
                  {submitStatus === 'success' && (
                    <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Thank you! Your message has been sent successfully. We will get back to you within 24 hours.
                      </div>
                    </div>
                  )}
                  
                  {submitStatus === 'error' && (
                    <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                      <div className="flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        Sorry, there was an error sending your message. Please email us directly at{' '}
                        <a href="mailto:info@systemsteelengg.com" className="underline font-medium">
                          info@systemsteelengg.com
                        </a>
                      </div>
                    </div>
                  )}
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 text-white px-6 py-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending Message...
                      </>
                    ) : 'Send Message'}
                  </button>
                  
                  <p className="text-sm text-gray-600 text-center">
                    * Required fields. We typically respond within 24 hours during business days.
                  </p>
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
              />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
