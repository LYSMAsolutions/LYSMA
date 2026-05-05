"use client";

import { useState } from "react";
import EntityModal from "@/components/admin/modals/EntityModal";

export default function CategoryFormModal() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button className="btn-primary" type="button" onClick={() => setOpen(true)}>
        Ajouter une catégorie
      </button>

      <EntityModal
        open={open}
        onClose={() => setOpen(false)}
        title="Créer une catégorie"
        description="Ajoute une catégorie ou sous-catégorie produit."
      >
        <form className="page-stack">
          <div>
            <label className="label">Nom catégorie</label>
            <input className="input" />
          </div>

          <div>
            <label className="label">Catégorie parente</label>
            <select className="select">
              <option>Aucune</option>
            </select>
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