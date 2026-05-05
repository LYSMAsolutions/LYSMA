"use client";

import { useState, useRef, useEffect } from "react";
import { MapPin, Pencil, Plus } from "lucide-react";
import ClientDrawer from "@/components/atc/bons/ClientDrawer";
import type { ClientData } from "@/components/atc/bons/ClientDrawer";

type Client = {
  id: string; name: string; code: string | null;
  storeId: string | null; storeName: string | null; storeCode: string | null;
  status?: string;
};
type Store = { id: string; name: string; code: string };

type Props = {
  clients:          Client[];
  stores:           Store[];
  value:            string;
  onChange:         (id: string, client?: Client) => void;
  onClientUpdated?: (client: Client) => void;
};

export default function ClientSearchWithDrawer({ clients, stores, value, onChange, onClientUpdated }: Props) {
  const [query,        setQuery]        = useState("");
  const [open,         setOpen]         = useState(false);
  const [drawerOpen,   setDrawerOpen]   = useState(false);
  const [drawerClient, setDrawerClient] = useState<ClientData | null>(null);
  const [localClients, setLocalClients] = useState<Client[]>(clients ?? []);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setLocalClients(clients ?? []); }, [clients]);

  const selected    = localClients.find((c) => c.id === value);
  const safeClients = localClients ?? [];
  const filtered    = (() => {
    const q = query.trim().toLowerCase();
    if (!q) return safeClients.slice(0, 10);
    return safeClients.filter((c) =>
      c.name.toLowerCase().includes(q) || (c.code ?? "").toLowerCase().includes(q)
    ).slice(0, 10);
  })();

  useEffect(() => {
    function h(e: MouseEvent) { if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false); }
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  function openEdit(c: Client) {
    setDrawerClient({ id: c.id, name: c.name, code: c.code, billing_name: null, representative_name: null, phone: null, email: null, address_line_1: null, postal_code: null, city: null, store_id: c.storeId, storeName: c.storeName, storeCode: c.storeCode, status: c.status ?? "client" });
    setDrawerOpen(true); setOpen(false);
  }

  function openCreate() { setDrawerClient(null); setDrawerOpen(true); setOpen(false); }

  function handleSaved(saved: ClientData) {
    const asClient: Client = { id: saved.id, name: saved.name, code: saved.code, storeId: saved.store_id, storeName: saved.storeName, storeCode: saved.storeCode, status: saved.status };
    setLocalClients((prev) => {
      const exists = prev.find((c) => c.id === saved.id);
      if (exists) return prev.map((c) => c.id === saved.id ? asClient : c);
      return [asClient, ...prev];
    });
    onChange(saved.id, asClient);
    onClientUpdated?.(asClient);
    setDrawerOpen(false);
  }

  const isProspect = selected?.status === "prospect";

  return (
    <>
      <div ref={wrapRef} style={{ position: "relative" }}>

        {/* Client sélectionné */}
        {selected && !open ? (
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1rem", borderRadius: "var(--r-md)", border: `1px solid ${isProspect ? "#fde68a" : "var(--c-border)"}`, background: isProspect ? "rgba(255,251,235,0.6)" : "var(--c-blue-light)" }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <p style={{ margin: 0, fontSize: "var(--font-md)", fontWeight: 700, color: "var(--c-text)" }}>
                  {selected.code && <span style={{ fontFamily: "monospace", color: "var(--c-blue-primary)", marginRight: "0.3rem" }}>{selected.code}</span>}
                  {selected.name}
                </p>
                {isProspect && <span className="badge-lysma badge-yellow">Prospect</span>}
              </div>
              {selected.storeName && (
                <p style={{ margin: "0.1rem 0 0", fontSize: "var(--font-xs)", color: "var(--c-text-secondary)", display: "flex", alignItems: "center", gap: "0.3rem" }}>
                  <MapPin size={11} strokeWidth={2} /> {selected.storeCode} · {selected.storeName}
                </p>
              )}
            </div>
            <div style={{ display: "flex", gap: "0.375rem", flexShrink: 0 }}>
              <button type="button" onClick={() => openEdit(selected)} className="btn-ghost"
                style={{ fontSize: "var(--font-xs)", border: "1px solid var(--c-border)", borderRadius: "var(--r-sm)", gap: "0.25rem" }}>
                <Pencil size={11} strokeWidth={2.5} /> Modifier
              </button>
              <button type="button" onClick={() => { onChange(""); setQuery(""); setOpen(false); }} className="btn-ghost"
                style={{ fontSize: "var(--font-xs)", border: "1px solid var(--c-border)", borderRadius: "var(--r-sm)" }}>
                Changer
              </button>
            </div>
          </div>
        ) : (
          <input
            className="input-lysma"
            style={{ borderColor: open ? "var(--c-border-focus)" : undefined }}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
            onFocus={() => setOpen(true)}
            placeholder="Rechercher par nom ou code client..."
            autoComplete="off" autoCorrect="off" spellCheck={false}
          />
        )}

        {/* Dropdown */}
        {open && !selected && (
          <div style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, zIndex: 50, borderRadius: "var(--r-lg)", background: "var(--c-white)", border: "1px solid var(--c-border)", boxShadow: "var(--shadow-lg)", overflow: "hidden", maxHeight: "320px", overflowY: "auto" }}>

            {filtered.length === 0 && (
              <div style={{ padding: "0.875rem 1rem", textAlign: "center", color: "var(--c-text-muted)", fontSize: "var(--font-md)" }}>
                Aucun client trouvé
              </div>
            )}

            {filtered.map((c) => (
              <div key={c.id} role="option" aria-selected={false}
                onMouseDown={(e) => { e.preventDefault(); onChange(c.id, c); setQuery(""); setOpen(false); }}
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", padding: "0.75rem 1rem", borderBottom: "1px solid rgba(226,232,240,0.5)", cursor: "pointer", textAlign: "left" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--c-bg)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "")}>
                <div>
                  <span style={{ fontSize: "var(--font-md)", fontWeight: 600, color: "var(--c-text)" }}>
                    {c.code && <span style={{ color: "var(--c-blue-primary)", fontFamily: "monospace", marginRight: "0.4rem" }}>{c.code}</span>}
                    {c.name}
                  </span>
                  {c.storeName && (
                    <p style={{ margin: "0.1rem 0 0", fontSize: "var(--font-xs)", color: "var(--c-text-muted)", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                      <MapPin size={10} strokeWidth={2} /> {c.storeCode} · {c.storeName}
                    </p>
                  )}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexShrink: 0 }}>
                  {c.status === "prospect" && <span className="badge-lysma badge-yellow">Prospect</span>}
                  <button type="button"
                    onMouseDown={(e) => { e.stopPropagation(); openEdit(c); }}
                    className="btn-ghost"
                    style={{ fontSize: "var(--font-xs)", padding: "0.2rem 0.5rem", border: "1px solid var(--c-border)", borderRadius: "var(--r-sm)", gap: "0.25rem" }}>
                    <Pencil size={10} strokeWidth={2.5} /> Modifier
                  </button>
                </div>
              </div>
            ))}

            {/* Créer un prospect */}
            <button type="button"
              onMouseDown={(e) => { e.preventDefault(); openCreate(); }}
              style={{ display: "flex", alignItems: "center", gap: "0.75rem", width: "100%", padding: "0.875rem 1rem", background: "var(--c-blue-light)", border: "none", borderTop: "1px solid var(--c-border)", cursor: "pointer", color: "var(--c-blue-primary)", fontSize: "var(--font-sm)", fontWeight: 700 }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(10,77,155,0.1)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "var(--c-blue-light)")}>
              <Plus size={16} strokeWidth={2.5} />
              <div style={{ textAlign: "left" }}>
                <span style={{ display: "block" }}>Créer un prospect</span>
                <span style={{ display: "block", fontWeight: 400, fontSize: "var(--font-xs)", color: "var(--c-text-secondary)" }}>
                  Le client n'est pas encore enregistré ? Créez-le en prospect.
                </span>
              </div>
            </button>
          </div>
        )}
      </div>

      <ClientDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} client={drawerClient} stores={stores} onSaved={handleSaved} />
    </>
  );
}