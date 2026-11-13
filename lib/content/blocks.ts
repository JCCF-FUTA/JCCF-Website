import type { PortableTextBlock } from 'next-sanity';

let k = 0;
const key = () => `seed${(k++).toString(36)}`;

/** Turn plain paragraphs into Portable Text blocks so seed and Sanity content render the same way. */
export function paragraphs(...texts: string[]): PortableTextBlock[] {
  return texts.map((text) => ({
    _type: 'block',
    _key: key(),
    style: 'normal',
    markDefs: [],
    children: [{ _type: 'span', _key: key(), text, marks: [] }],
  }));
}

/** Plain text from Portable Text (for meta descriptions, excerpts) */
export function toPlainText(blocks?: PortableTextBlock[]) {
  if (!blocks) return '';
  return blocks
    .map((b) => (Array.isArray((b as { children?: unknown }).children)
      ? ((b as { children: { text?: string }[] }).children.map((c) => c.text ?? '').join(''))
      : ''))
    .join('\n\n');
}
