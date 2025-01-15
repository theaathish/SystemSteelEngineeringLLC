import { client } from "@/lib/sanity";
import { PortableText } from "@portabletext/react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

async function getJob(slug: string) {
  const job = await client.fetch(`
    *[_type == "job" && slug.current == $slug][0] {
      title,
      department,
      location,
      description,
      requirements,
      formEndpoint,
      isAcceptingApplications,
      requiredDocuments
    }
  `, { slug });
  return job;
}

export default async function JobPage({ params }: { params: { slug: string } }) {
  const job = await getJob(params.slug);

  if (!job) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <h1 className="text-2xl text-gray-800">Job posting not found.</h1>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      <main className="flex-1 py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <section className="bg-white p-8 rounded-xl shadow-sm mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{job.title}</h1>
            <div className="flex gap-4 text-gray-700 mb-8 text-lg">
              <span>{job.department}</span>
              <span className="text-gray-400">•</span>
              <span>{job.location}</span>
            </div>

            <div className="prose max-w-none mb-8 text-gray-800">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Job Description</h2>
              <div className="text-gray-700">
                <PortableText value={job.description} />
              </div>
              
              <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Requirements</h2>
              <ul className="text-gray-700 space-y-2">
                {job.requirements.map((requirement: string, index: number) => (
                  <li key={index}>{requirement}</li>
                ))}
              </ul>
            </div>

            {job.isAcceptingApplications && (
              <form 
                action={job.formEndpoint}
                method="POST"
                encType="multipart/form-data"
                className="space-y-6 border-t pt-8 mt-8"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Apply for this position</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-3 text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Email *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                  />
                </div>

                {job.requiredDocuments.includes('resume') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Resume/CV *</label>
                    <input
                      type="file"
                      name="resume"
                      accept=".pdf,.doc,.docx"
                      required
                      className="mt-1 block w-full"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                >
                  Submit Application
                </button>
              </form>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}