/** M16 page transition: content fades and rises 12px on each route change. */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
