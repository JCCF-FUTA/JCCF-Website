import type { StructureResolver } from 'sanity/structure';

/** Studio sidebar: settings singletons first, then content in the order admins use it most. */
export const structure: StructureResolver = (S) =>
  S.list()
    .title('JCCF FUTA')
    .items([
      S.listItem().title('Site settings (live, featured, contacts)').id('siteSettings')
        .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
      S.listItem().title('Give settings (owners only)').id('giveSettings')
        .child(S.document().schemaType('giveSettings').documentId('giveSettings')),
      S.divider(),
      S.documentTypeListItem('programme').title('Programmes'),
      S.documentTypeListItem('post').title('News & devotionals'),
      S.documentTypeListItem('fellowship').title('Fellowships'),
      S.divider(),
      S.documentTypeListItem('leader').title('Leaders'),
      S.documentTypeListItem('unit').title('Units'),
      S.documentTypeListItem('galleryAlbum').title('Gallery'),
    ]);
