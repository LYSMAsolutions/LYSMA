"use client";

export default function CatalogueFilters() {
  return (
    <div className="page-stack">
      <div
        style={{
          display: "grid",
          gap: "1rem",
          gridTemplateColumns: "repeat(4,minmax(0,1fr))",
        }}
      >
        <div>
          <label className="label">Recherche</label>
          <input className="input" placeholder="Référence, désignation..." />
        </div>

        <div>
          <label className="label">Fournisseur</label>
          <select className="select">
            <option>Tous</option>
          </select>
        </div>

        <div>
          <label className="label">Type</label>
          <select className="select">
            <option>Tous</option>
            <option>Interne</option>
            <option>Matériel</option>
            <option>Outillage</option>
            <option>Op-com</option>
            <option>Promo</option>
          </select>
        </div>

        <div>
          <label className="label">Statut</label>
          <select className="select">
            <option>Tous</option>
            <option>Actif</option>
            <option>Inactif</option>
          </select>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: ".75rem" }}>
        <button className="btn-secondary" type="button">
          Reset
        </button>
        <button className="btn-primary" type="button">
          Filtrer
        </button>
      </div>
    </div>
  );
}