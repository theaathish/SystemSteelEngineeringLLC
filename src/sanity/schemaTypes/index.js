export const schema = {
  types: [
    {
      name: 'project',
      title: 'Project',
      type: 'document',
      fields: [
        {
          name: 'title',
          title: 'Title',
          type: 'string',
        },
        {
          name: 'slug',
          title: 'Slug',
          type: 'slug',
          options: {
            source: 'title',
            maxLength: 96,
          },
        },
        {
          name: 'description',
          title: 'Description',
          type: 'text',
        },
        {
          name: 'mainImage',
          title: 'Main Image',
          type: 'image',
        },
        {
          name: 'videoFile',
          title: 'Video File',
          type: 'file',
        },
        {
          name: 'tags',
          title: 'Tags',
          type: 'array',
          of: [{ type: 'string' }],
        },
      ],
    },
    {
      name: 'job',
      title: 'Job Posting',
      type: 'document',
      fields: [
        {
          name: 'title',
          title: 'Job Title',
          type: 'string',
          validation: Rule => Rule.required()
        },
        {
          name: 'slug',
          title: 'Slug',
          type: 'slug',
          options: {
            source: 'title',
            maxLength: 96,
          },
          validation: Rule => Rule.required()
        },
        {
          name: 'department',
          title: 'Department',
          type: 'string',
          validation: Rule => Rule.required()
        },
        {
          name: 'location',
          title: 'Location',
          type: 'string',
          validation: Rule => Rule.required()
        },
        {
          name: 'description',
          title: 'Job Description',
          type: 'array',
          of: [{type: 'block'}],
          validation: Rule => Rule.required()
        },
        {
          name: 'requirements',
          title: 'Requirements',
          type: 'array',
          of: [{type: 'string'}],
          validation: Rule => Rule.required()
        },
        {
          name: 'isActive',
          title: 'Is Active',
          type: 'boolean',
          initialValue: true
        },
        {
          name: 'publishedAt',
          title: 'Published Date',
          type: 'datetime',
          initialValue: (new Date()).toISOString()
        },
        {
          name: 'googleFormUrl',
          title: 'Google Form URL',
          type: 'url',
          description: 'Google Form link for job applications (e.g., https://forms.gle/abc123)',
          validation: Rule => Rule.required().uri({
            scheme: ['https']
          }),
        },
        {
          name: 'isAcceptingApplications',
          title: 'Accepting Applications',
          type: 'boolean',
          description: 'Toggle if this job is accepting applications',
          initialValue: true
        },
        {
          name: 'requiredDocuments',
          title: 'Required Documents',
          type: 'array',
          of: [{type: 'string'}],
          options: {
            list: [
              {title: 'Resume/CV', value: 'resume'},
              {title: 'Cover Letter', value: 'coverLetter'},
              {title: 'Portfolio', value: 'portfolio'}
            ]
          },
          initialValue: ['resume']
        }
      ],
    }
  ],
};
