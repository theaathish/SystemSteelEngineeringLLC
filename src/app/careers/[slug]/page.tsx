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
  googleFormUrl?: string;
}

async function fetchContent(type: string, slug: string) {
  try {
    return await client.fetch(`*[_type == $type && slug.current == $slug][0] {
      _id,
      title,
      description,
      mainImage,
      tags,
      videoFile,
      department,
      location,
      isAcceptingApplications,
      requiredDocuments,
      googleFormUrl
    }`, { type, slug });
  } catch (error) {
    console.error(`Error fetching ${type}:`, error);
    return null;
  }
}

export default function ContentPage({ params }: Props) {
  const [content, setContent] = useState<Content | null>(null);
  const [isProject, setIsProject] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadContent() {
      const resolvedParams = await params;
      const slug = resolvedParams.slug;
      
      const project = await fetchContent('project', slug);
      const job = await fetchContent('job', slug);
      
      const foundContent = project || job;
      setContent(foundContent);
      setIsProject(Boolean(project));
      setLoading(false);
    }
    
    loadContent();
  }, [params]);

  // Handle Apply button click - redirect to Google Form from Sanity
  const handleApplyClick = () => {
    if (content?.googleFormUrl) {
      window.open(content.googleFormUrl, '_blank');
    } else {
      // Fallback if no Google Form URL is set in Sanity
      alert('Application form is not available at the moment. Please contact us directly at careers@systemsteelengg.com');
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
                    
                    <div className="bg-gray-50 p-6 rounded-lg mb-6">
                      <p className="text-gray-700 mb-4">
                        Ready to join our team? Click the button below to fill out our application form.
                      </p>
                      <p className="text-sm text-gray-600 mb-4">
                        The application form will open in a new tab and includes fields for:
                      </p>
                      <ul className="text-sm text-gray-600 list-disc list-inside mb-6 space-y-1">
                        <li>Personal Information</li>
                        <li>Professional Experience</li>
                        <li>Cover Letter</li>
                        <li>Resume Upload</li>
                      </ul>
                    </div>
                    
                    <button
                      onClick={handleApplyClick}
                      className="w-full bg-blue-600 text-white px-6 py-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg flex items-center justify-center gap-2"
                    >
                      Apply Now
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-1M14 5l7 7m0 0l-7 7m7-7H8" />
                      </svg>
                    </button>
                    
                    <div className="mt-6 text-sm text-gray-600 bg-blue-50 p-4 rounded-lg">
                      <p className="font-medium text-blue-800 mb-2">Application Process:</p>
                      <ol className="list-decimal list-inside space-y-1 text-blue-700">
                        <li>Click "Apply Now" to open the application form</li>
                        <li>Fill out all required fields</li>
                        <li>Upload your resume and any supporting documents</li>
                        <li>Submit your application</li>
                        <li>We'll review your application and contact you within 5-7 business days</li>
                      </ol>
                    </div>
                    
                    <div className="mt-4 text-sm text-gray-600">
                      <p>Questions about this position? Email us at <a href="mailto:careers@systemsteelengg.com" className="text-blue-600 hover:underline">careers@systemsteelengg.com</a></p>
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
