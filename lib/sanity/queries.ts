/** GROQ queries. Each projects documents into the shapes in lib/types.ts. */

const img = (field: string) =>
  `${field}{ "url": asset->url, "alt": coalesce(alt, ""), "lqip": asset->metadata.lqip, "width": asset->metadata.dimensions.width, "height": asset->metadata.dimensions.height }`;

export const fellowshipFields = `
  "slug": slug.current, name, shortName, "type": coalesce(type, "fellowship"), description,
  "meetingDays": coalesce(meetingDays, []), meetingTime, venue, mapUrl, presidentName, phone, whatsapp,
  instagram, facebook, ${img('logo')}, ${img('image')}, "status": coalesce(status, "active")`;

export const FELLOWSHIPS_QUERY = `*[_type == "fellowship" && status != "inactive"] | order(name asc){ ${fellowshipFields} }`;
export const FELLOWSHIP_QUERY = `*[_type == "fellowship" && slug.current == $slug][0]{ ${fellowshipFields} }`;

export const programmeFields = `
  "slug": slug.current, title, kind, theme, start, end, venue, mapUrl, summary, body,
  ${img('flyer')}, "ministers": ministers[]{ name, role, ${img('photo')} }, featured, relatedVideoIds`;

export const PROGRAMMES_QUERY = `*[_type == "programme"] | order(start asc){ ${programmeFields} }`;
export const PROGRAMME_QUERY = `*[_type == "programme" && slug.current == $slug][0]{ ${programmeFields} }`;

export const LEADERS_QUERY = `*[_type == "leader"] | order(coalesce(order, 99) asc){
  name, office, "group": coalesce(group, "executive"), department, level, ${img('photo')}, quote, "order": coalesce(order, 99) }`;

export const postFields = `"slug": slug.current, title, "type": coalesce(type, "announcement"), "date": coalesce(date, _createdAt), excerpt, author, ${img('image')}, body`;
export const POSTS_QUERY = `*[_type == "post"] | order(date desc){ ${postFields} }`;
export const POST_QUERY = `*[_type == "post" && slug.current == $slug][0]{ ${postFields} }`;

export const UNITS_QUERY = `*[_type == "unit"] | order(name asc){ name, summary, "icon": coalesce(icon, "groups") }`;

export const GALLERY_QUERY = `*[_type == "galleryAlbum"] | order(date desc){
  "slug": slug.current, title, date, ${img('cover')}, "images": images[]{ "url": asset->url, "alt": coalesce(alt, ""), "lqip": asset->metadata.lqip, "width": asset->metadata.dimensions.width, "height": asset->metadata.dimensions.height } }`;

export const SITE_SETTINGS_QUERY = `*[_id == "siteSettings"][0]{
  "isLive": coalesce(isLive, false), liveVideoId, liveTitle, "featuredProgrammeSlug": featuredProgramme->slug.current,
  whatsappChannel, email, phone, address, mapUrl, "socials": coalesce(socials, {}), stats, liveWindows, pinnedVideoId,
  "instagramPosts": instagramPosts[]{ url, ${img('image')} } }`;

export const GIVE_SETTINGS_QUERY = `*[_id == "giveSettings"][0]{
  bankName, accountName, accountNumber, presetAmounts,
  "categories": categories[]{ "id": coalesce(id.current, _key), label, description, "kind": coalesce(kind, "project"), "open": coalesce(open, true) } }`;
