import { Metadata } from 'next';
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { client } from "@/lib/sanity";
import { PortableText } from "@portabletext/react";
import { urlForImage } from "@/lib/image";

type Props = {
  params: Promise<{ slug: string }>;
};

async function fetchContent(type: string, slug: string) {
  try {
    return await client.fetch(`*[_type == $type && slug.current == $slug][0]`, { type, slug });
  } catch (error) {
    console.error(`Error fetching ${type}:`, error);
    return null;
  }
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const slug = params.slug;
  const project = await fetchContent('project', slug);
  const job = await fetchContent('job', slug);

  const content = project || job;
  const title = content?.title || "Not Found";

  // Safely convert description to a string before substring
  const rawDescription = typeof content?.description === "string" ? content.description : "";
  const description = rawDescription.substring(0, 160) || "Content not available.";

  return {
    title: `${title} | System Steel Engineering`,
    description,
    openGraph: {
      title,
      description,
    },
  };
}

export default async function ContentPage(props: Props) {
  const params = await props.params;

  const {
    slug
  } = params;

  const project = await fetchContent('project', slug);
  const job = await fetchContent('job', slug);

  if (!project && !job) {
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

  const content = project || job;
  const isProject = Boolean(project);

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
                    layout="fill"
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
                  <form
                    action={content.formEndpoint}
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
                        className="mt-1 block w-full rounded-md border border-gray-300 px-4 py-3 text-black opacity-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email *</label>
                      <input
                        type="email"
                        name="email"
                        required
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-black opacity-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-black opacity-100"
                      />
                    </div>
                    {content.requiredDocuments?.includes('resume') && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Resume/CV *</label>
                        <input
                          type="file"
                          name="resume"
                          accept=".pdf,.doc,.docx"
                          required
                          className="mt-1 block w-full text-black opacity-100"
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
              </>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
