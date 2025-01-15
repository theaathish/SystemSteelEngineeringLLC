export interface Project {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  description: string;
  mainImage: any;
  tags: string[];
  videoFile: any;
}