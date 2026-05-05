"use client";

import { useState } from "react";
import EntityModal from "@/components/admin/modals/EntityModal";

export default function AttributeFormModal() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button className="btn-primary" type="button" onClick={() => setOpen(true)}>
        Ajouter un attribut
      </button>

      <EntityModal
        open={open}
        onClose={() => setOpen(false)}
        title="Créer un attribut"
        description="Ajoute un attribut produit dynamique."
      >
        <form className="page-stack">
          <div>
            <label className="label">Nom attribut</label>
            <input className="input" />
          </div>

          <div>
            <label className="label">Type attribut</label>
            <select className="select">
              <option>Texte</option>
              <option>Nombre</option>
              <option>Liste</option>
              <option>Booléen</option>
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