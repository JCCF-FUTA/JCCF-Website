import { defineArrayMember, defineField, defineType, type Rule } from 'sanity';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/** Image with required alt text (PRD: alt text required on every CMS image). */
const imageWithAlt = (name: string, title: string, required = false) =>
  defineField({
    name,
    title,
    type: 'image',
    options: { hotspot: true },
    fields: [
      defineField({
        name: 'alt',
        title: 'Alt text',
        type: 'string',
        description: 'Describe the picture for people who can’t see it, e.g. “Choir ministering at the 2026 Week of Prayers”.',
        validation: (r) => r.required().error('Alt text is required for accessibility.'),
      }),
    ],
    validation: required ? (r) => r.required() : undefined,
  });

const slugField = (source = 'title') =>
  defineField({ name: 'slug', title: 'Web address (slug)', type: 'slug', options: { source, maxLength: 80 }, validation: (r) => r.required() });

const blockContent = defineField({
  name: 'body',
  title: 'Body',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'Heading', value: 'h2' },
        { title: 'Sub-heading', value: 'h3' },
        { title: 'Quote', value: 'blockquote' },
      ],
      marks: {
        decorators: [{ title: 'Bold', value: 'strong' }, { title: 'Italic', value: 'em' }],
        annotations: [{ name: 'link', type: 'object', title: 'Link', fields: [{ name: 'href', type: 'url', title: 'URL', validation: (r: Rule) => r.uri({ scheme: ['http', 'https', 'mailto', 'tel'] }) }] }],
      },
    }),
    defineArrayMember({ type: 'image', options: { hotspot: true }, fields: [{ name: 'alt', type: 'string', title: 'Alt text', validation: (r: Rule) => r.required() }, { name: 'caption', type: 'string', title: 'Caption' }] }),
  ],
});

/* ───────── Programme ───────── */
const programme = defineType({
  name: 'programme',
  title: 'Programme',
  type: 'document',
  icon: () => '📅',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
    slugField(),
    defineField({ name: 'kind', title: 'Type of programme', type: 'string', description: 'e.g. Combined Sunday Service, Week of Prayers, Change of Pulpit, Teaching Week', validation: (r) => r.required() }),
    defineField({ name: 'theme', type: 'string' }),
    defineField({ name: 'start', title: 'Starts', type: 'datetime', options: { timeStep: 15 }, validation: (r) => r.required() }),
    defineField({ name: 'end', title: 'Ends', type: 'datetime', options: { timeStep: 15 }, validation: (r) => r.min(r.valueOfField('start')).error('The end must be after the start.') }),
    defineField({ name: 'allDay', title: 'Time not announced yet', type: 'boolean', initialValue: false, description: 'Tick when only the date is known. The site then shows dates without a time.' }),
    defineField({ name: 'venue', type: 'string' }),
    defineField({ name: 'mapUrl', title: 'Map link', type: 'url' }),
    defineField({ name: 'summary', type: 'text', rows: 3, description: 'One or two sentences for cards and link previews.', validation: (r) => r.max(240) }),
    imageWithAlt('flyer', 'Flyer (4:5)'),
    blockContent,
    defineField({
      name: 'ministers', type: 'array',
      of: [defineArrayMember({ type: 'object', fields: [{ name: 'name', type: 'string', validation: (r: Rule) => r.required() }, { name: 'role', type: 'string' }, imageWithAlt('photo', 'Photo')], preview: { select: { title: 'name', subtitle: 'role', media: 'photo' } } })],
    }),
    defineField({ name: 'featured', type: 'boolean', description: 'Show the countdown to this programme on the Home page (the Site settings choice wins).', initialValue: false }),
    defineField({ name: 'relatedVideoIds', title: 'Related YouTube video IDs', type: 'array', of: [{ type: 'string' }], description: 'Shown as “Sermons from this programme” after it ends. The ID is the part after v= in a YouTube link.' }),
  ],
  orderings: [{ title: 'Date, newest', name: 'startDesc', by: [{ field: 'start', direction: 'desc' }] }],
  preview: { select: { title: 'title', subtitle: 'start', media: 'flyer' }, prepare: ({ title, subtitle, media }) => ({ title, subtitle: subtitle ? new Date(subtitle).toDateString() : 'No date', media }) },
});

/* ───────── Announcement / Post ───────── */
const post = defineType({
  name: 'post',
  title: 'News & devotionals',
  type: 'document',
  icon: () => '📰',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
    slugField(),
    defineField({ name: 'type', type: 'string', options: { list: [{ title: 'Announcement', value: 'announcement' }, { title: 'Devotional', value: 'devotional' }, { title: 'Blog post', value: 'blog' }], layout: 'radio' }, initialValue: 'announcement', validation: (r) => r.required() }),
    defineField({ name: 'date', type: 'datetime', initialValue: () => new Date().toISOString(), validation: (r) => r.required() }),
    defineField({ name: 'excerpt', type: 'text', rows: 2, validation: (r) => r.required().max(220) }),
    defineField({ name: 'author', type: 'string' }),
    imageWithAlt('image', 'Cover image'),
    blockContent,
  ],
  orderings: [{ title: 'Newest', name: 'dateDesc', by: [{ field: 'date', direction: 'desc' }] }],
  preview: { select: { title: 'title', subtitle: 'type', media: 'image' } },
});

/* ───────── Fellowship ───────── */
const fellowship = defineType({
  name: 'fellowship',
  title: 'Fellowship',
  type: 'document',
  icon: () => '⛪',
  fields: [
    defineField({ name: 'name', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'shortName', title: 'Short name', type: 'string', description: 'e.g. SUCF' }),
    slugField('shortName'),
    defineField({ name: 'type', type: 'string', options: { list: [{ title: 'Fellowship', value: 'fellowship' }, { title: 'Christian group', value: 'group' }], layout: 'radio' }, initialValue: 'fellowship' }),
    defineField({ name: 'status', type: 'string', options: { list: ['active', 'inactive'], layout: 'radio' }, initialValue: 'active', description: 'Inactive fellowships are hidden from the site.' }),
    defineField({ name: 'description', type: 'text', rows: 3 }),
    defineField({ name: 'meetingDays', title: 'Meeting days', type: 'array', of: [{ type: 'string' }], options: { list: DAYS.map((d) => ({ title: d, value: d })) } }),
    defineField({ name: 'meetingTime', title: 'Meeting time', type: 'string', description: 'e.g. 8:00 AM' }),
    defineField({ name: 'venue', type: 'string' }),
    defineField({ name: 'mapUrl', title: 'Map link', type: 'url' }),
    defineField({ name: 'presidentName', title: 'President’s name', type: 'string' }),
    defineField({ name: 'phone', type: 'string' }),
    defineField({ name: 'whatsapp', title: 'WhatsApp link', type: 'url' }),
    defineField({ name: 'instagram', type: 'url' }),
    defineField({ name: 'facebook', type: 'url' }),
    imageWithAlt('logo', 'Logo'),
    imageWithAlt('image', 'Photo'),
  ],
  preview: { select: { title: 'name', subtitle: 'shortName', media: 'logo' } },
});

/* ───────── Leader ───────── */
const leader = defineType({
  name: 'leader',
  title: 'Leader',
  type: 'document',
  icon: () => '🧑‍💼',
  fields: [
    defineField({ name: 'name', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'office', type: 'string', validation: (r) => r.required(), description: 'e.g. Household President, General Secretary, Choir Coordinator' }),
    defineField({ name: 'group', type: 'string', options: { list: [{ title: 'Household Executive', value: 'executive' }, { title: 'Unit coordinator', value: 'unit' }, { title: 'Staff adviser / patron', value: 'adviser' }], layout: 'radio' }, initialValue: 'executive' }),
    defineField({ name: 'order', type: 'number', description: 'Sort order (1 = President).', initialValue: 10 }),
    defineField({ name: 'department', type: 'string' }),
    defineField({ name: 'level', type: 'string', description: 'e.g. 500L' }),
    imageWithAlt('photo', 'Portrait (4:5)'),
    defineField({ name: 'quote', title: 'Short charge or quote (President)', type: 'text', rows: 3, validation: (r) => r.max(320) }),
  ],
  orderings: [{ title: 'Order', name: 'order', by: [{ field: 'order', direction: 'asc' }] }],
  preview: { select: { title: 'name', subtitle: 'office', media: 'photo' } },
});

/* ───────── Unit ───────── */
const unit = defineType({
  name: 'unit',
  title: 'Unit',
  type: 'document',
  icon: () => '🎶',
  fields: [
    defineField({ name: 'name', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'summary', type: 'text', rows: 2 }),
    defineField({ name: 'icon', type: 'string', description: 'Material Symbols name, e.g. mic, campaign, handshake', initialValue: 'groups' }),
  ],
});

/* ───────── Gallery ───────── */
const galleryAlbum = defineType({
  name: 'galleryAlbum',
  title: 'Gallery album',
  type: 'document',
  icon: () => '🖼️',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
    slugField(),
    defineField({ name: 'date', type: 'date', validation: (r) => r.required() }),
    imageWithAlt('cover', 'Cover'),
    defineField({
      name: 'images', type: 'array', options: { layout: 'grid' },
      of: [defineArrayMember({ type: 'image', options: { hotspot: true }, fields: [{ name: 'alt', type: 'string', title: 'Alt text / caption', validation: (r: Rule) => r.required() }] })],
    }),
  ],
  preview: { select: { title: 'title', subtitle: 'date', media: 'cover' } },
});

/* ───────── Give settings (singleton; owners only — see README) ───────── */
const giveSettings = defineType({
  name: 'giveSettings',
  title: 'Give settings',
  type: 'document',
  icon: () => '💳',
  fields: [
    defineField({ name: 'bankName', type: 'string' }),
    defineField({ name: 'accountName', type: 'string' }),
    defineField({ name: 'accountNumber', type: 'string', validation: (r) => r.regex(/^\d{10}$/, { name: 'NUBAN' }).error('A Nigerian account number has 10 digits.') }),
    defineField({ name: 'presetAmounts', title: 'Preset amounts (₦)', type: 'array', of: [{ type: 'number' }], initialValue: [1000, 2000, 5000, 10000] }),
    defineField({
      name: 'categories', type: 'array',
      of: [defineArrayMember({
        type: 'object',
        fields: [
          { name: 'label', type: 'string', validation: (r: Rule) => r.required() },
          { name: 'id', type: 'slug', options: { source: (_: unknown, ctx: { parent?: { label?: string } }) => ctx.parent?.label ?? '' }, validation: (r: Rule) => r.required() },
          { name: 'kind', type: 'string', options: { list: [{ title: 'Offering', value: 'offering' }, { title: 'Partnership/Support', value: 'partnership' }, { title: 'Programme or Project', value: 'project' }] }, validation: (r: Rule) => r.required() },
          { name: 'description', type: 'string' },
          { name: 'open', type: 'boolean', initialValue: true, description: 'Turn off to close a fund.' },
        ],
        preview: { select: { title: 'label', subtitle: 'kind', open: 'open' }, prepare: ({ title, subtitle, open }: { title?: string; subtitle?: string; open?: boolean }) => ({ title: `${title}${open === false ? ' (closed)' : ''}`, subtitle }) },
      })],
    }),
  ],
  preview: { prepare: () => ({ title: 'Give settings' }) },
});

/* ───────── Site settings (singleton) ───────── */
const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  icon: () => '⚙️',
  groups: [{ name: 'live', title: 'Live', default: true }, { name: 'home', title: 'Home' }, { name: 'contact', title: 'Contact & social' }],
  fields: [
    defineField({ name: 'isLive', title: 'We are live', type: 'boolean', group: 'live', initialValue: false, description: 'Turn on when a service is streaming. Shows the live banner on every page. Turn off when it ends.' }),
    defineField({ name: 'liveVideoId', title: 'Live YouTube video ID', type: 'string', group: 'live', description: 'Optional. Without it, the button opens the channel’s live page.' }),
    defineField({ name: 'liveTitle', title: 'Live stream title', type: 'string', group: 'live' }),
    defineField({
      name: 'liveWindows', title: 'Programme times (for automatic live checks)', type: 'array', group: 'live',
      description: 'The site checks YouTube every 15 minutes only inside these windows (Nigeria time).',
      of: [defineArrayMember({ type: 'object', fields: [
        { name: 'day', type: 'string', options: { list: DAYS } },
        { name: 'start', type: 'string', description: '24-hour, e.g. 16:00', validation: (r: Rule) => r.regex(/^\d{2}:\d{2}$/) },
        { name: 'end', type: 'string', description: '24-hour, e.g. 20:00', validation: (r: Rule) => r.regex(/^\d{2}:\d{2}$/) },
      ], preview: { select: { title: 'day', s: 'start', e: 'end' }, prepare: ({ title, s, e }: { title?: string; s?: string; e?: string }) => ({ title: `${title} ${s}–${e}` }) } })],
    }),
    defineField({ name: 'featuredProgramme', title: 'Featured programme (countdown)', type: 'reference', to: [{ type: 'programme' }], group: 'home' }),
    defineField({ name: 'pinnedVideoId', title: 'Pinned YouTube video ID', type: 'string', group: 'home', description: 'Shown first among the latest sermons.' }),
    defineField({
      name: 'stats', type: 'array', group: 'home',
      of: [defineArrayMember({ type: 'object', fields: [{ name: 'value', type: 'number' }, { name: 'suffix', type: 'string' }, { name: 'label', type: 'string' }, { name: 'note', type: 'string' }], preview: { select: { title: 'label', subtitle: 'value' } } })],
    }),
    defineField({
      name: 'instagramPosts', title: 'Instagram posts (fallback strip)', type: 'array', group: 'home',
      of: [defineArrayMember({ type: 'object', fields: [{ name: 'url', type: 'url', title: 'Post link' }, imageWithAlt('image', 'Image')], preview: { select: { title: 'url', media: 'image' } } })],
    }),
    defineField({ name: 'whatsappChannel', title: 'WhatsApp channel link', type: 'url', group: 'contact' }),
    defineField({ name: 'email', type: 'string', group: 'contact' }),
    defineField({ name: 'phone', type: 'string', group: 'contact' }),
    defineField({ name: 'address', title: 'Secretariat address', type: 'text', rows: 2, group: 'contact' }),
    defineField({ name: 'mapUrl', title: 'Map link', type: 'url', group: 'contact' }),
    defineField({
      name: 'socials',
      type: 'object',
      group: 'contact',
      fields: [{ name: 'instagram', type: 'url' }, { name: 'facebook', type: 'url' }, { name: 'telegram', type: 'url' }, { name: 'youtube', type: 'url' }, { name: 'whatsapp', type: 'url' }],
    }),
  ],
  preview: { prepare: () => ({ title: 'Site settings' }) },
});

export const schemaTypes = [siteSettings, giveSettings, programme, post, fellowship, leader, unit, galleryAlbum];
export const SINGLETONS = ['siteSettings', 'giveSettings'];
