import { NextStudio } from 'next-sanity/studio';
import config from '@/sanity.config';
import { integrations } from '@/lib/site';

export const dynamic = 'force-static';
export { metadata, viewport } from 'next-sanity/studio';

export default function StudioPage() {
  if (!integrations.sanity) {
    return (
      <main style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 560, margin: '15vh auto', padding: 24, lineHeight: 1.6 }}>
        <h1>Studio not connected yet</h1>
        <p>Set <code>NEXT_PUBLIC_SANITY_PROJECT_ID</code> (and <code>NEXT_PUBLIC_SANITY_DATASET</code>) in the environment, then redeploy. See the README, “Setting up Sanity”.</p>
      </main>
    );
  }
  return <NextStudio config={config} />;
}
