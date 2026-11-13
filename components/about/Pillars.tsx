import { MISSION, VISION } from '@/lib/content/seed';
import { Carousel } from '@/components/ui/Carousel';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Icon } from '@/components/ui/Icon';
import { Title } from '@/components/ui/Title';

/**
 * Vision & 7-point mission (DESIGN §C10, constitution Article 2).
 * Expanded+: pinned horizontal track (M6). Smaller screens: swipe carousel.
 */
export function Pillars({ headingLevel = 'h2' }: { headingLevel?: 'h2' | 'h3' }) {
  return (
    <section data-pin aria-labelledby="vision-title" className="theme-stage relative overflow-hidden">
      <div className="container-page section flex min-h-[100svh] flex-col justify-center gap-12 expanded:gap-14">
        <div className="grid gap-6 expanded:grid-cols-12 expanded:items-end">
          <div className="flex flex-col items-start gap-5 expanded:col-span-8">
            <Eyebrow tone="stage">Our vision</Eyebrow>
            <Title
              id="vision-title"
              as={headingLevel}
              tone="stage"
              text="Raising a people that will come in the *unity of the faith*"
              className="max-w-[20ch]"
            />
          </div>
          <div className="expanded:col-span-4" data-reveal="up">
            <p className="text-body-lg text-on-stage-variant">{VISION.full}</p>
            <p className="mt-2 text-label-md font-semibold uppercase text-stage-accent-text">{VISION.ref}</p>
          </div>
        </div>

        <div>
          <h3 className="mb-5 flex items-center gap-3 text-label-md font-semibold uppercase text-on-stage-variant">
            <span className="h-px w-8 bg-stage-accent" aria-hidden="true" /> Our mission — seven commitments
          </h3>
          <Carousel label="Our mission" tone="stage" pinTrack trackClassName="auto-cols-[80%] medium:auto-cols-[42%] expanded:auto-cols-[300px] large:auto-cols-[320px]">
            {MISSION.map((m, i) => (
              <li key={m.title} className="relative aspect-[3/4] overflow-hidden rounded-xl border border-stage-outline">
                <div
                  className="tile-brand absolute inset-0"
                  style={{ backgroundPosition: `${(i * 37) % 100}% ${(i * 53) % 100}%` }}
                  aria-hidden="true"
                />
                <span aria-hidden="true" className="pointer-events-none absolute -bottom-6 -right-2 font-display text-[11rem] leading-none text-white/[0.04]">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="relative flex h-full flex-col justify-between p-5 medium:p-6">
                  <div className="flex items-start justify-between">
                    <span className="font-display text-headline-sm text-stage-accent">{String(i + 1).padStart(2, '0')}</span>
                    <span className="glass inline-flex size-12 items-center justify-center rounded-full">
                      <Icon name={m.icon} />
                    </span>
                  </div>
                  <div>
                    <p className="text-title-lg font-semibold text-white">{m.title}</p>
                    <p className="mt-2 text-body-md text-white/80">{m.text}</p>
                  </div>
                </div>
              </li>
            ))}
          </Carousel>
        </div>
      </div>
    </section>
  );
}
