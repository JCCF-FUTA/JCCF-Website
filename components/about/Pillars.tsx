import { MISSION, VISION } from '@/lib/content/seed';
import { Carousel } from '@/components/ui/Carousel';
import { Title } from '@/components/ui/Title';

/**
 * Vision & 7-point mission (DESIGN §C10, constitution Article 2).
 * Expanded+: pinned horizontal track (M6). Smaller screens: swipe carousel.
 */
export function Pillars({ headingLevel = 'h2' }: { headingLevel?: 'h2' | 'h3' }) {
  return (
    <section data-pin aria-labelledby="vision-title" className="theme-stage relative overflow-hidden">
      <div className="container-page section flex flex-col justify-center expanded:min-h-[100svh] gap-12 expanded:gap-14">
        <div className="grid gap-6 expanded:grid-cols-12 expanded:items-end">
          <div className="expanded:col-span-8">
            <Title
              id="vision-title"
              as={headingLevel}
              tone="stage"
              split={false}
              text="Raising a people that will come in the unity of the faith"
              className="max-w-[20ch]"
            />
          </div>
          <div className="expanded:col-span-4" data-reveal="up">
            <p className="text-body-lg text-on-stage-variant">
              Our vision, from {VISION.ref} and Article 2 of the constitution, in full: “{VISION.full}”
            </p>
          </div>
        </div>

        <div>
          <h3 className="mb-5 text-title-lg font-semibold">Our mission</h3>
          <Carousel label="Our mission" tone="stage" pinTrack trackClassName="auto-cols-[78%] medium:auto-cols-[42%] expanded:auto-cols-[280px]">
            {MISSION.map((m, i) => (
              <li key={m.title} className="relative min-h-60 overflow-hidden rounded-xl bg-stage-container expanded:min-h-80">
                <div className="relative flex h-full flex-col justify-between gap-8 p-5 medium:p-6">
                  {/* The constitution lists the mission as i–vii, so the numbers are a real sequence. */}
                  <span className="font-display text-display-sm text-on-stage-variant tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <p className="text-title-lg font-semibold text-white">{m.title}</p>
                    <p className="mt-2 text-body-lg text-on-stage-variant">{m.text}</p>
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
