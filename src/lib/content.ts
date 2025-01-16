import { client } from "./sanity";

export async function fetchContent(type: string, slug: string) {
  try {
    return await client.fetch(`*[_type == $type && slug.current == $slug][0]`, { type, slug });
  } catch (error) {
    console.error(`Error fetching ${type}:`, error);
    return null;
  }
}