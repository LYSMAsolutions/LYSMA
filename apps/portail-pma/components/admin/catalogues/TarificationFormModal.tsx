"use client";

import { useState } from "react";
import EntityModal from "@/components/admin/modals/EntityModal";

export default function TarificationFormModal() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button className="btn-primary" type="button" onClick={() => setOpen(true)}>
        Ajouter un code
      </button>

      <EntityModal
        open={open}
        onClose={() => setOpen(false)}
        title="Créer un code de tarification"
        description="Ajoute un code de tarification réutilisable dans le moteur catalogue."
      >
        <form className="page-stack">
          <div>
            <label className="label">Code</label>
            <input className="input" />
          </div>

          <div>
            <label className="label">Libellé</label>
            <input className="input" />
          </div>

          <div>
            <label className="label">Description</label>
            <textarea className="textarea" rows={4} />
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