"use client";

import { useMemo, useState } from "react";
import CreateClientPopup from "@/components/admin/popups/CreateClientPopup";
import ClientTable from "./ClientTable";

type StoreItem = {
  id: string;
  code: string;
  name: string;
};

type AtcItem = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
};

type ClientItem = {
  id: string;
  code: string;
  name: string;
  city?: string | null;
  email?: string | null;
  phone?: string | null;
  storeName?: string | null;
  atcName?: string | null;
  bonsCount?: number;
};

export default function ClientFilters({
  distributor,
  distributorId,
  stores,
  atcs,
  initialClients,
  showSearch = true,
}: {
  distributor: string;
  distributorId: string;
  stores: StoreItem[];
  atcs: AtcItem[];
  initialClients: ClientItem[];
  showSearch?: boolean;
}) {
  const [search, setSearch] = useState("");
  const [storeFilter, setStoreFilter] = useState("");
  const [popupOpen, setPopupOpen] = useState(false);

  const filteredClients = useMemo(() => {
    return initialClients.filter((client) => {
      const query = search.trim().toLowerCase();

      const matchesSearch =
        !query ||
        client.name.toLowerCase().includes(query) ||
        (client.code || "").toLowerCase().includes(query) ||
        (client.email || "").toLowerCase().includes(query) ||
        (client.city || "").toLowerCase().includes(query);

      const matchesStore =
        !storeFilter || client.storeName === storeFilter;

      return matchesSearch && matchesStore;
    });
  }, [initialClients, search, storeFilter]);

  const storeNames = [...new Set(initialClients.map((item: any) => item.storeName).filter(Boolean))] as string[];

  return (
    <div className="page-stack">
      <div
        style={{
          display: "grid",
          gap: "1rem",
          gridTemplateColumns: showSearch ? "2fr 1fr auto" : "1fr auto",
          alignItems: "end",
        }}
      >
        {showSearch ? (
          <div>
            <label className="label">Recherche</label>
            <input
              className="input"
              placeholder="Nom, code, email, ville..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        ) : null}

        <div>
          <label className="label">Magasin</label>
          <select
            className="select"
            value={storeFilter}
            onChange={(e) => setStoreFilter(e.target.value)}
          >
            <option value="">Tous</option>
            {storeNames.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <button className="btn-primary" type="button" onClick={() => setPopupOpen(true)}>
            Ajouter un client
          </button>
        </div>
      </div>

      <ClientTable distributor={distributor} rows={filteredClients} />

      <CreateClientPopup
        open={popupOpen}
        onClose={() => {
          setPopupOpen(false);
          window.location.reload();
        }}
        distributorId={distributorId}
        stores={stores}
        atcs={atcs}
      />
    </div>
  );
}
