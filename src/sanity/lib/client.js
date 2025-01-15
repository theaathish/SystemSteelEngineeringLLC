import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'

import { createClient } from 'next-sanity'

export const client = createClient({
  projectId: 'ruyfdohw',
  dataset: 'production',
  apiVersion: '2022-03-07',
  useCdn: true 
})