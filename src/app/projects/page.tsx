import Image from "next/image";
import Link from "next/link";
import { client } from "../../lib/sanity";
import { urlForImage } from "../../lib/image";
import { Project } from "@/types/project";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

async function getProjects(): Promise<Project[]> {
  try {
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
                Explore our diverse range of steel engineering projects tailored to meet your needs.
              </p>
            </div>
          </section>

          {/* Projects List Section */}
          {/* Projects Grid */}
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          {projects.length === 0 ? (
            <p className="text-center text-gray-500">No projects found.</p>
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <Link 
                  href={`/projects/${project.slug.current}`} 
                  key={project._id}
                  className="block hover:no-underline"
                >
                  <article className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                    {project.mainImage && (
                      <div className="relative h-48">
                        <Image
                          src={urlForImage(project.mainImage).url()}
                          alt={project.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                    )}
                    
                    <div className="p-6">
                      <h2 className="text-xl font-semibold text-gray-900 mb-2">
                        {project.title}
                      </h2>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {project.description}
                      </p>
                      {project.tags && (
                        <div className="flex flex-wrap gap-2">
                          {project.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      {/* Display Project Date */}
                      <p className="mt-4 text-sm text-gray-500">
                        Posted on: {new Date(project._createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}