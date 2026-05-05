"use client";

import { useState } from "react";
import EntityModal from "@/components/admin/modals/EntityModal";

export default function CampaignFormModal() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button className="btn-primary" type="button" onClick={() => setOpen(true)}>
        Ajouter une campagne
      </button>

      <EntityModal
        open={open}
        onClose={() => setOpen(false)}
        title="Créer une campagne"
        description="Ajoute une promotion ou une opération commerciale."
      >
        <form className="page-stack">
          <div>
            <label className="label">Nom campagne</label>
            <input className="input" />
          </div>

          <div>
            <label className="label">Type campagne</label>
            <select className="select">
              <option>Promo</option>
              <option>Opération commerciale</option>
              <option>Fournisseur</option>
            </select>
          </div>

          <div
            style={{
              display: "grid",
              gap: "1rem",
              gridTemplateColumns: "repeat(2,minmax(0,1fr))",
            }}
          >
            <div>
              <label className="label">Date début</label>
              <input className="input" type="date" />
            </div>
            <div>
              <label className="label">Date fin</label>
              <input className="input" type="date" />
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button className="btn-primary" type="button" onClick={() => setOpen(false)}>
              Enregistrer
            </button>
          </div>
        </form>
      </EntityModal>
    </>
  );
}