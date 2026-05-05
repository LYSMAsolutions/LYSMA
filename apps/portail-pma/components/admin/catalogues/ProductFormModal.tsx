"use client";

import { useState } from "react";
import EntityModal from "@/components/admin/modals/EntityModal";

export default function ProductFormModal() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button className="btn-primary" type="button" onClick={() => setOpen(true)}>
        Ajouter un produit
      </button>

      <EntityModal
        open={open}
        onClose={() => setOpen(false)}
        title="Créer un produit"
        description="Ajoute une référence au catalogue."
      >
        <form className="page-stack">
          <div>
            <label className="label">Référence</label>
            <input className="input" />
          </div>

          <div>
            <label className="label">Désignation</label>
            <input className="input" />
          </div>

          <div>
            <label className="label">Fournisseur</label>
            <select className="select">
              <option>Sélectionner</option>
            </select>
          </div>

          <div>
            <label className="label">Type</label>
            <select className="select">
              <option>Interne</option>
              <option>Matériel</option>
              <option>Outillage</option>
              <option>Op-com</option>
              <option>Promo</option>
            </select>
          </div>

          <div>
            <label className="label">Code de tarification</label>
            <input className="input" />
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