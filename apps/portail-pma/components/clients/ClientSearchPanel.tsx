import Link from "next/link";
import { Search, X } from "lucide-react";

export default function ClientSearchPanel({
  action,
  query,
  resultCount,
}: {
  action: string;
  query: string;
  resultCount: number;
}) {
  return (
    <section className="card-lysma p-6">
      <form action={action} className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#94A3B8]" />
          <input
            name="q"
            defaultValue={query}
            placeholder="Rechercher client, code, ATC, magasin, numero de bon, reference, materiel..."
            className="min-h-12 w-full rounded-2xl border border-[#D9E3F0] bg-white pl-12 pr-4 text-sm font-medium text-[#0F172A] outline-none transition focus:border-[#0A4D9B] focus:ring-4 focus:ring-[#0A4D9B]/10"
          />
        </div>
        <button type="submit" className="btn-primary">
          Rechercher
        </button>
        {query ? (
          <Link href={action} className="btn-secondary">
            <X className="h-4 w-4" /> Effacer
          </Link>
        ) : null}
      </form>
      {query ? (
        <p className="mt-4 text-sm text-[#6B7280]">
          {resultCount} resultat{resultCount > 1 ? "s" : ""} pour "{query}".
        </p>
      ) : null}
    </section>
  );
}
