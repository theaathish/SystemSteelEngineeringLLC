//"use client";
import { client } from "@/lib/sanity";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Head from "next/head";
import { Job } from "@/types/job";


async function getJobs(): Promise<Job[]> {
  try {
    const jobs = await client.fetch(`
      *[_type == "job" && isActive == true] | order(publishedAt desc) {
        _id,
        title,
        slug,
        department,
        location,
        description,
        isAcceptingApplications,
        publishedAt
      }
    `);
    return jobs;
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return [];
  }
}

export default async function CareersPage() {
  const jobs = await getJobs();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      <main className="flex-1 py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <section className="relative h-[300px] md:h-[400px] lg:h-[500px] mb-16">
            <Image
              src="/careers-banner.jpg"
              alt="Careers"
              layout="fill"
              objectFit="cover"
              priority
              className="brightness-50 rounded-xl"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">Join Our Team</h1>
              <p className="text-base md:text-lg">
                Explore exciting career opportunities with System Steel Engineering
              </p>
            </div>
          </section>

          {/* Job Listings */}
          <section className="py-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Current Openings</h2>
            {jobs.length === 0 ? (
              <div className="text-center text-gray-600 py-12">
                No open positions at the moment. Please check back later.
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-8">
                {jobs.map((job) => (
                  <Link 
                    href={`/careers/${job.slug.current}`} 
                    key={job._id}
                    className="group bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
                  >
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">{job.title}</h3>
                    <div className="flex gap-4 text-sm text-gray-600 mb-4">
                      <span>{job.department}</span>
                      <span className="text-gray-400">•</span>
                      <span>{job.location}</span>
                    </div>
                    <span className="inline-flex items-center text-blue-600 group-hover:text-blue-700">
                      Learn More 
                      <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}