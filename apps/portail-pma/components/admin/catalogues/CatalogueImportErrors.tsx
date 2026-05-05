"use client";

export default function CatalogueImportErrors() {
  return (
    <div>
      <h3 className="section-title" style={{ fontSize: "1rem" }}>
        Erreurs d’import
      </h3>
      <p className="section-copy" style={{ marginTop: ".5rem" }}>
        Zone prévue pour les lignes invalides, doublons, colonnes manquantes et incohérences.
      </p>
    </div>
  );
}