// Layout isolé — bypasse le layout ATC parent
// La page print s'affiche en plein écran par-dessus tout
export default function PrintLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}