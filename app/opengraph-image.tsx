import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

export const alt = 'JCCF FUTA — Joint Christian Campus Fellowship. Till we all come in the unity of the faith.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/** Default share image for WhatsApp/Instagram/X link previews. */
export default async function OgImage() {
  const logo = await readFile(path.join(process.cwd(), 'public/brand/jccf-logo.png'));
  const src = `data:image/png;base64,${logo.toString('base64')}`;
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', background: '#0a0a0a', color: '#fff', padding: 72, alignItems: 'center', gap: 56, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', background: 'radial-gradient(70% 90% at 100% 0%, rgba(250,4,4,0.35), transparent 60%)' }} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} width={300} height={300} alt="" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18, flex: 1 }}>
          <div style={{ fontSize: 30, color: '#b8b8b8', letterSpacing: 2, textTransform: 'uppercase' }}>JCCF FUTA</div>
          <div style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.05, textTransform: 'uppercase' }}>Till we all come in the unity of the faith</div>
          <div style={{ fontSize: 28, color: '#b8b8b8' }}>Joint Christian Campus Fellowship · Federal University of Technology, Akure</div>
          <div style={{ display: 'flex', width: 120, height: 8, background: '#fa0404', borderRadius: 8 }} />
        </div>
      </div>
    ),
    size,
  );
}
