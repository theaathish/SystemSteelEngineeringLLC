import { createClient } from 'next-sanity'; // Import only once

import { apiVersion, dataset, projectId } from '../env';

export const client = createClient({
  projectId: 'ruyfdohw',
  dataset: 'production',
  apiVersion: '2022-03-07',
  useCdn: true,
});
