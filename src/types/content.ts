export interface BaseContent {
  title: string;
  description?: string;
  slug: string;
  image?: {
    url: string;
    alt: string;
  };
}

export interface Project extends BaseContent {
  type: 'project';
  details: any;
}

export interface Job extends BaseContent {
  type: 'job';
  requirements: string[];
  location: string;
}

export type Content = Project | Job;