"use client";

import { useActionState, useEffect } from "react";
import { updateStoreAction } from "@/app/[distributor]/admin/stores/[storeId]/edit/actions";

const initialState = { success: false, error: null as string | null };

type StoreData = {
  id: string; code: string; name: string; city?: string | null;
  address_line_1?: string | null; address_line_2?: string | null;
  postal_code?: string | null; phone?: string | null; email?: string | null;
  is_active: boolean; store_type: string; internal_code?: string | null;
};

const STORE_TYPES = [
  { value: "standard", label: "Standard",       desc: "Magasin réseau standard"             },
  { value: "sav",      label: "SAV / Matériel",  desc: "Accès catalogue matériel uniquement" },
];

export default function StoreEditForm({ store }: { store: StoreData }) {
  const [state, formAction, pending] = useActionState(updateStoreAction, initialState);

  useEffect(() => {
    if (state.success) window.history.back();
  }, [state.success]);

  return (
    <form action={formAction} className="page-stack">
      <input type="hidden" name="storeId" value={store.id} />

      <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(2,minmax(0,1fr))" }}>
        <div><label className="label">Code magasin</label><input className="input" name="code" defaultValue={store.code} required /></div>
        <div><label className="label">Nom magasin</label><input className="input" name="name" defaultValue={store.name} required /></div>
      </div>

      <div>
        <label className="label">Code interne</label>
        <input className="input" name="internal_code" defaultValue={store.internal_code || ""} />
        <p style={{ margin: "0.3rem 0 0", fontSize: "0.75rem", color: "#94a3b8" }}>
          Code utilisé dans les imports clients (colonne <code>assigned_store_code</code>). Unique par magasin.
        </p>
      </div>

      <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(2,minmax(0,1fr))" }}>
        <div><label className="label">Ville</label><input className="input" name="city" defaultValue={store.city || ""} /></div>
        <div><label className="label">Code postal</label><input className="input" name="postalCode" defaultValue={store.postal_code || ""} /></div>
      </div>

      <div><label className="label">Adresse ligne 1</label><input className="input" name="address_line_1" defaultValue={store.address_line_1 || ""} /></div>
      <div><label className="label">Adresse ligne 2</label><input className="input" name="address_line_2" defaultValue={store.address_line_2 || ""} /></div>

      <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(2,minmax(0,1fr))" }}>
        <div><label className="label">Téléphone</label><input className="input" name="phone" defaultValue={store.phone || ""} /></div>
        <div><label className="label">Email magasin</label><input className="input" name="email" type="email" defaultValue={store.email || ""} /></div>
      </div>

      <div className="label" style={{ marginBottom: "0.25rem" }}>Type de magasin</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
        {STORE_TYPES.map((t) => (
          <label key={t.value} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.875rem 1rem", borderRadius: "0.875rem", border: "1px solid", borderColor: store.store_type === t.value ? "#bfdbfe" : "#e2e8f0", background: store.store_type === t.value ? "rgba(239,246,255,0.6)" : "#f8fafc", cursor: "pointer" }}>
            <input type="radio" name="store_type" value={t.value} defaultChecked={store.store_type === t.value} style={{ accentColor: "#0a4d9b" }} />
            <div>
              <p style={{ margin: 0, fontSize: "0.875rem", fontWeight: 700, color: "#0f172a" }}>{t.label}</p>
              <p style={{ margin: 0, fontSize: "0.75rem", color: "#6b7280" }}>{t.desc}</p>
            </div>
          </label>
        ))}
      </div>

      <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", fontSize: "0.875rem", fontWeight: 600, color: "#334155" }}>
        <input type="checkbox" name="isActive" value="true" defaultChecked={store.is_active} /> Magasin actif
      </label>

      {state.error ? <div className="alert-error">{state.error}</div> : null}

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button className="btn-primary" type="submit" disabled={pending}>
          {pending ? "Enregistrement..." : "Enregistrer"}
        </button>
      </div>
    </form>
  );
}