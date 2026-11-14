'use client';

import Link from 'next/link';
import { useState } from 'react';
import { formatLongDate } from '@/lib/format';
import type { Post, PostType } from '@/lib/types';
import { filterChipClasses, StatusChip } from '@/components/ui/Chip';
import { Icon } from '@/components/ui/Icon';
import { SmartImage } from '@/components/ui/SmartImage';

export const TYPE_LABEL: Record<PostType, string> = { announcement: 'Announcement', devotional: 'Devotional', blog: 'Blog' };

/** News list with a type filter (PRD /news). */
export function NewsList({ posts }: { posts: Post[] }) {
  const [type, setType] = useState<PostType | null>(null);
  const types = [...new Set(posts.map((p) => p.type))];
  const list = type ? posts.filter((p) => p.type === type) : posts;
  return (
    <>
      {types.length > 1 && (
        <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label="Filter by type">
          {[null, ...types].map((t) => (
            <button key={t ?? 'all'} type="button" aria-pressed={type === t} onClick={() => setType(t)} className={filterChipClasses(type === t)}>
              {type === t && <Icon name="check" size={16} />} {t ? `${TYPE_LABEL[t]}s` : 'All'}
            </button>
          ))}
        </div>
      )}
      <ul className="grid gap-6 medium:grid-cols-2 expanded:grid-cols-3">
        {list.map((p) => (
          <li key={p.slug}>
            <article className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest transition-transform duration-300 hover:-translate-y-1">
              <div className="relative aspect-[16/9]">
                <SmartImage image={p.image} sizes="(min-width: 840px) 33vw, 100vw" fallbackLabel={TYPE_LABEL[p.type]} />
              </div>
              <div className="flex flex-1 flex-col gap-3 p-5">
                <div className="flex items-center gap-2">
                  <StatusChip kind={p.type === 'announcement' ? 'new' : 'neutral'}>{TYPE_LABEL[p.type]}</StatusChip>
                  <span className="text-body-sm text-on-surface-variant">{formatLongDate(p.date)}</span>
                </div>
                <h2 className="text-title-lg font-semibold">
                  <Link href={`/news/${p.slug}`} className="after:absolute after:inset-0">{p.title}</Link>
                </h2>
                <p className="text-body-lg text-on-surface-variant">{p.excerpt}</p>
                <span className="mt-auto inline-flex h-12 items-center gap-1 text-label-lg font-semibold text-primary">
                  Read <Icon name="arrow_forward" size={20} className="transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </>
  );
}
