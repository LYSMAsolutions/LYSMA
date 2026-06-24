import Link from "next/link";

const statusItems = [
  {
    label: "Ollama",
    value: "actif",
    detail: "Endpoint local http://localhost:11434"
  },
  {
    label: "Modèle",
    value: "mistral:7b",
    detail: "Réponse générée localement — prompt V2.3 respecté"
  },
  {
    label: "Mémoire",
    value: "PostgreSQL active",
    detail: "Injection au démarrage · extraction après chaque réponse"
  },
  {
    label: "IdentityEngine",
    value: "connecté",
    detail: "Condition réelle basée sur les mémoires validées"
  }
];

export default function HomePage() {
  return (
    <main className="min-h-screen px-5 py-8 text-zinc-100 sm:px-8">
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center">
        <div className="grid w-full gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="space-y-8">
            <div className="inline-flex rounded-lg border border-echo-line bg-black/30 px-3 py-2 text-sm text-zinc-300">
              Local cockpit / V3 privée
            </div>

            <div className="space-y-5">
              <h1 className="text-5xl font-semibold text-white sm:text-7xl">
                ECHO
              </h1>
              <p className="max-w-2xl text-xl leading-8 text-zinc-300">
                IA personnelle privée de Mathieu
              </p>
              <p className="max-w-2xl leading-7 text-zinc-400">
                Mémoire vivante PostgreSQL — ECHO injecte ses souvenirs validés au démarrage
                de chaque conversation et extrait automatiquement de nouveaux candidats
                après chaque échange.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/chat"
                className="rounded-lg bg-echo-cyan px-5 py-3 font-semibold text-echo-ink transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-echo-cyan focus:ring-offset-2 focus:ring-offset-echo-ink"
              >
                Ouvrir ECHO
              </Link>
              <Link
                href="/memoire"
                className="rounded-lg border border-echo-line bg-echo-panel px-5 py-3 text-zinc-300 transition hover:border-echo-cyan hover:text-echo-cyan"
              >
                Gérer la mémoire
              </Link>
            </div>
          </div>

          <aside className="rounded-lg border border-echo-line bg-echo-panel/95 p-5 shadow-cockpit">
            <div className="mb-5 flex items-center justify-between gap-4 border-b border-echo-line pb-4">
              <div>
                <p className="text-sm text-zinc-400">Statut système</p>
                <h2 className="text-2xl font-semibold text-white">ECHO V3</h2>
              </div>
              <div className="h-3 w-3 rounded-full bg-echo-green shadow-[0_0_18px_rgba(80,250,123,0.65)]" />
            </div>

            <div className="space-y-4">
              {statusItems.map((item) => (
                <div
                  key={item.label}
                  className="rounded-lg border border-zinc-800 bg-black/24 p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <p className="text-sm text-zinc-400">{item.label}</p>
                    <p className="text-right text-sm font-semibold text-echo-green">
                      {item.value}
                    </p>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-zinc-400">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
