import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="theme-stage flex min-h-svh items-center">
      <div className="container-page flex flex-col items-start gap-6 py-24">
        <p className="text-label-md font-semibold uppercase text-on-stage-variant">Error 404</p>
        <h1 className="type-display text-display-lg">This page is <span className="text-stage-accent">not here</span></h1>
        <p className="max-w-[48ch] text-body-lg text-on-stage-variant">The link may be old, or the page may have moved. Try the home page, or find a fellowship.</p>
        <div className="flex flex-wrap gap-3">
          <Link href="/" className="inline-flex h-12 items-center rounded-full bg-white px-6 text-label-lg font-semibold text-stage">Go home</Link>
          <Link href="/fellowships" className="inline-flex h-12 items-center rounded-full border border-stage-outline px-6 text-label-lg font-semibold">Find a fellowship</Link>
        </div>
      </div>
    </main>
  );
}
