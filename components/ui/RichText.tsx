import Image from 'next/image';
import { PortableText, type PortableTextBlock, type PortableTextComponents } from 'next-sanity';

const components: PortableTextComponents = {
  types: {
    image: ({ value }: { value: { url?: string; asset?: { url?: string }; alt?: string; caption?: string } }) => {
      const src = value.url ?? value.asset?.url;
      if (!src) return null;
      return (
        <figure className="my-8">
          <div className="relative aspect-video overflow-hidden rounded-xl">
            <Image src={src} alt={value.alt ?? ''} fill sizes="(min-width: 840px) 672px, 100vw" className="object-cover" />
          </div>
          {value.caption && <figcaption className="mt-2 text-body-sm text-on-surface-variant">{value.caption}</figcaption>}
        </figure>
      );
    },
  },
  marks: {
    link: ({ children, value }) => {
      const href = (value as { href?: string })?.href ?? '#';
      const ext = /^https?:/.test(href);
      return <a href={href} {...(ext ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>{children}</a>;
    },
    scripture: ({ children }) => <span className="text-on-surface-variant">{children}</span>,
  },
};

/** Portable Text in the reading style (DESIGN §C30). */
export function RichText({ value, className }: { value?: PortableTextBlock[]; className?: string }) {
  if (!value?.length) return null;
  return (
    <div className={`prose-jccf ${className ?? ''}`}>
      <PortableText value={value} components={components} />
    </div>
  );
}
