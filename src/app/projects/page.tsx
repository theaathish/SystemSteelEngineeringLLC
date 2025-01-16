import Image from "next/image";
import Link from "next/link";
import { client } from "../../lib/sanity";
import { urlForImage } from "../../lib/image";
import { Project } from "@/types/project";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Force dynamic rendering (no build-time caching)
export const dynamic = "force-dynamic";

async function getProjects(): Promise<Project[]> {
  try {
    // Fetch live content from Sanity on every request
    const projects = await client.fetch(`
      *[_type == "project"] | order(_createdAt desc) {
        _id,
        title,
        slug,
        description,
        mainImage,
        tags,
        videoFile,
        _createdAt
      }
    `);
    return projects;
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
}

export default async function Projects() {
  const projects = await getProjects();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1 py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <section className="relative h-96 mb-16 md:h-96 sm:h-64">
            <Image
              src="/project-banner.jpg"
              alt="Our Projects"
              layout="fill"
              objectFit="cover"
              className="brightness-50 rounded-xl"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
              <h1 className="text-4xl font-bold mb-4 sm:text-2xl">Our Projects</h1>
              <p className="text-lg sm:text-sm">
                Explore our work and see how we bring steel structures to life
              </p>
            </div>
          </section>

          {/* Projects Listing */}
          <section>
            {projects.length === 0 ? (
              <div className="text-center py-12 text-gray-600">
                No projects at the moment. Please check again later.
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project) => (
                  <Link
                    href={`/projects/${project.slug.current}`}
                    key={project._id}
                    className="block bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow hover:bg-gray-50"
                  >
                    <div className="relative w-full h-48 mb-4">
                      {project.mainImage && (
                        <Image
                          src={urlForImage(project.mainImage).url()}
                          alt={project.title}
                          fill
                          className="object-cover rounded-md"
                        />
                      )}
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      {project.title}
                    </h2>
                    <p className="text-gray-600 line-clamp-3">{project.description}</p>
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