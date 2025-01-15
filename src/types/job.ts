export type Job = {
  _id: string;
  title: string;
  slug: { current: string };
  department: string;
  location: string;
  description: any;
  isAcceptingApplications: boolean;
  publishedAt: string;
};