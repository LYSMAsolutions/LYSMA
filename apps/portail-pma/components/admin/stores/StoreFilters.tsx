"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import StoreTable from "./StoreTable";

type StoreItem = {
  id: string;
  code: string;
  name: string;
  city?: string | null;
  is_active: boolean;
  store_accounts?: {
    login_email: string;
    must_change_password: boolean;
  } | null;
  rdm?: {
    id: string;
    first_name: string;
    last_name: string;
    email?: string | null;
    phone?: string | null;
  } | null;
  _count?: {
    clients: number;
    bons_assigned: number;
    store_staff: number;
  };
};

export default function StoreFilters({
  distributor,
  initialStores,
}: {
  distributor: string;
  initialStores: StoreItem[];
}) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const filteredStores = useMemo(() => {
    return initialStores.filter((store) => {
      const query = search.trim().toLowerCase();

      const matchesSearch =
        !query ||
        store.name.toLowerCase().includes(query) ||
        store.code.toLowerCase().includes(query) ||
        (store.city || "").toLowerCase().includes(query) ||
        (`${store.rdm?.first_name ?? ""} ${store.rdm?.last_name ?? ""}`
          .trim()
          .toLowerCase()
          .includes(query));

      const matchesStatus =
        !statusFilter ||
        (statusFilter === "active" && store.is_active) ||
        (statusFilter === "inactive" && !store.is_active) ||
        (statusFilter === "missing-rdm" && !store.rdm);

      return matchesSearch && matchesStatus;
    });
  }, [initialStores, search, statusFilter]);

  return (
    <div className="page-stack">
      <div className="grid gap-4 md:grid-cols-[minmax(0,2fr)_minmax(220px,1fr)_auto] md:items-end">
        <div className="space-y-2">
          <label className="label">Recherche</label>
          <input
            className="input"
            placeholder="Nom, code, ville, RDM..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="label">Statut</label>
          <select
            className="select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Tous</option>
            <option value="active">Actif</option>
            <option value="inactive">Inactif</option>
            <option value="missing-rdm">Sans RDM</option>
          </select>
        </div>

        <div className="md:justify-self-end">
          <Link href={`/${distributor}/admin/stores/new`} className="btn-primary w-full md:w-auto">
            Créer un magasin
          </Link>
        </div>
      </div>

      <StoreTable distributor={distributor} rows={filteredStores} />
    </div>
  );
}
