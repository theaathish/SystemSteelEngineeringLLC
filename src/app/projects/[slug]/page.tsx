import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Head from "next/head";
import { client } from "../../../lib/sanity";
import { urlForImage } from "../../../lib/image";
import { Project } from "@/types/project";

async function getProject(slug: string): Promise<Project | null> {
  try {
    const project = await client.fetch(
      `*[_type == "project" && slug.current == $slug][0] {
        _id,
        title,
        slug,
        description,
        mainImage,
        tags,
        videoFile
      }`,
      { slug }
    );
    return project;
  } catch (error) {
    console.error("Error fetching project:", error);
    return null;
  }
}

export default async function ProjectPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const project = await getProject(params.slug);

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <h1 className="text-2xl text-gray-800">Project not found.</h1>
        </main>
        <Footer />
      </div>
    );
  }

  // Generate keywords from tags
  const keywords = project.tags?.join(", ") || "Steel Engineering, Projects";

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Head>
        <title>{project.title} | System Steel Engineering</title>
        <meta name="description" content={project.description.substring(0, 160)} />
        <meta name="keywords" content={keywords} />
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content={`${project.title} | System Steel Engineering`} />
        <meta property="og:description" content={project.description.substring(0, 160)} />
        {project.mainImage && (
          <meta property="og:image" content={urlForImage(project.mainImage).url()} />
        )}
        <meta property="og:url" content={`https://www.systemsteelengg.com/projects/${project.slug.current}`} />
        <meta property="og:type" content="article" />
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${project.title} | System Steel Engineering`} />
        <meta name="twitter:description" content={project.description.substring(0, 160)} />
        {project.mainImage && (
          <meta name="twitter:image" content={urlForImage(project.mainImage).url()} />
        )}
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              "headline": project.title,
              "description": project.description,
              "image": project.mainImage ? urlForImage(project.mainImage).url() : "",
              "author": {
                "@type": "Organization",
                "name": "System Steel Engineering",
              },
              "publisher": {
                "@type": "Organization",
                "name": "System Steel Engineering",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://www.systemsteelengg.com/logo.png",
                },
              },
              "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": `https://www.systemsteelengg.com/projects/${project.slug.current}`,
              },
              "keywords": keywords,
            }),
          }}
        />
      </Head>

      <Navbar />

      <main className="flex-1 py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <section className="relative h-96 mb-16 md:h-96 sm:h-64">
            <Image
              src={urlForImage(project.mainImage).url()}
              alt="Project Details"
              layout="fill"
              objectFit="cover"
              className="brightness-80 rounded-xl"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
              <h1 className="text-4xl font-bold mb-4 sm:text-2xl">Project Details</h1>
              <p className="text-lg sm:text-sm">
                Detailed information about the project.
              </p>
            </div>
          </section>

          <article className="flex-1 bg-white">
            <div className="max-w-4xl mx-auto py-16 px-4">
              {project.mainImage && (
                <div className="relative h-96 mb-8">
                  <Image
                    src={urlForImage(project.mainImage).url()}
                    alt={project.title}
                    fill
                    className="object-cover rounded-lg"
                    priority
                  />
                </div>
              )}
              
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {project.title}
              </h1>
              
              <div className="flex flex-wrap gap-2 mb-8">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="prose max-w-none">
                <p className="text-gray-700 text-lg leading-relaxed">
                  {project.description}
                </p>
              </div>

              {project.videoFile && (
                <div className="mt-8">
                  <video 
                    controls 
                    className="w-full rounded-lg"
                    src={project.videoFile.url}
                  />
                </div>
              )}
            </div>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
}