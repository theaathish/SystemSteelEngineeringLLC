"use client";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { client } from "@/lib/sanity";
import { PortableText } from "@portabletext/react";
import { urlForImage } from "@/lib/image";
import { useState, useEffect } from "react";

type Props = {
  params: Promise<{ slug: string }>;
};

interface Content {
  _id: string;
  title: string;
  description: any;
  mainImage?: any;
  tags?: string[];
  videoFile?: { url: string };
  department?: string;
  location?: string;
  isAcceptingApplications?: boolean;
  requiredDocuments?: string[];
}

async function fetchContent(type: string, slug: string) {
  try {
    return await client.fetch(`*[_type == $type && slug.current == $slug][0]`, { type, slug });
  } catch (error) {
    console.error(`Error fetching ${type}:`, error);
    return null;
  }
}

export default function ContentPage({ params }: Props) {
  const [content, setContent] = useState<Content | null>(null);
  const [isProject, setIsProject] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Form state for job applications
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    coverLetter: '',
    jobTitle: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    async function loadContent() {
      const resolvedParams = await params;
      const slug = resolvedParams.slug;
      
      const project = await fetchContent('project', slug);
      const job = await fetchContent('job', slug);
      
      const foundContent = project || job;
      setContent(foundContent);
      setIsProject(Boolean(project));
      
      if (job) {
        setFormData(prev => ({ ...prev, jobTitle: job.title }));
      }
      
      setLoading(false);
    }
    
    loadContent();
  }, [params]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: `Job Application for: ${formData.jobTitle}

Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}

Cover Letter:
${formData.coverLetter}

This is a job application submitted through the careers page.`
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', phone: '', coverLetter: '', jobTitle: content?.title || '' });
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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div>Loading...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <h1 className="text-2xl text-gray-800">Content not found.</h1>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1 py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <section className="bg-white p-8 rounded-xl shadow-sm mb-8">
            {isProject && (
              <>
                <div className="relative h-96 mb-8">
                  <Image
                    src={urlForImage(content.mainImage).url()}
                    alt={content.title}
                    fill
                    className="object-cover rounded-lg"
                    priority
                  />
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">{content.title}</h1>
                <div className="flex flex-wrap gap-2 mb-8">
                  {content.tags?.map((tag: string) => (
                    <span key={tag} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="prose max-w-none text-gray-800">
                  <p>{content.description}</p>
                </div>
                {content.videoFile && (
                  <div className="mt-8">
                    <video controls className="w-full rounded-lg" src={content.videoFile.url} />
                  </div>
                )}
              </>
            )}
            {!isProject && (
              <>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">{content.title}</h1>
                <div className="flex gap-4 text-gray-700 mb-8 text-lg">
                  <span>{content.department}</span>
                  <span className="text-gray-400">•</span>
                  <span>{content.location}</span>
                </div>
                <div className="prose max-w-none text-gray-800">
                  <PortableText value={content.description} />
                </div>
                {content.isAcceptingApplications && (
                  <div className="border-t pt-8 mt-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6">Apply for this position</h3>
                    
                    <form onSubmit={async (e) => {
                      e.preventDefault();
                      setIsSubmitting(true);
                      setSubmitStatus('idle');

                      const form = e.currentTarget;
                      const formData = new FormData(form);
                      
                      // Add job title to form data
                      formData.append('jobTitle', content?.title || '');
                      formData.append('_subject', `Job Application for: ${content?.title}`);

                      try {
                        const response = await fetch('https://formspree.io/f/mrbgdpzq', {
                          method: 'POST',
                          body: formData,
                          headers: {
                            'Accept': 'application/json'
                          }
                        });

                        if (response.ok) {
                          setSubmitStatus('success');
                          form.reset();
                        } else {
                          setSubmitStatus('error');
                        }
                      } catch (error) {
                        console.error('Network error:', error);
                        setSubmitStatus('error');
                      } finally {
                        setIsSubmitting(false);
                      }
                    }} className="space-y-6">
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                        <input
                          type="text"
                          name="name"
                          required
                          className="w-full rounded-md border border-gray-300 px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Your full name"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                        <input
                          type="email"
                          name="email"
                          required
                          className="w-full rounded-md border border-gray-300 px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="your.email@example.com"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                        <input
                          type="tel"
                          name="phone"
                          className="w-full rounded-md border border-gray-300 px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="+971 XX XXX XXXX"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Cover Letter *</label>
                        <textarea
                          name="message"
                          required
                          rows={6}
                          className="w-full rounded-md border border-gray-300 px-4 py-3 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Tell us why you're interested in this position and what makes you a great fit..."
                        />
                      </div>
                      
                      {submitStatus === 'success' && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                          Thank you! Your application has been submitted successfully. We will review it and get back to you soon.
                        </div>
                      )}
                      
                      {submitStatus === 'error' && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                          Sorry, there was an error submitting your application. Please try again or contact us directly.
                        </div>
                      )}
                      
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? 'Submitting Application...' : 'Submit Application'}
                      </button>
                    </form>
                    
                    <div className="mt-4 text-sm text-gray-600">
                      <p>* Required fields</p>
                      <p>Note: Please attach your resume/CV by email to info@systemsteelengg.com after submitting this form.</p>
                    </div>
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
