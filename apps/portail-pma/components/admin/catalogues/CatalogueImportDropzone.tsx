"use client";

export default function CatalogueImportDropzone() {
  return (
    <div
      style={{
        border: "2px dashed var(--border)",
        borderRadius: "1.5rem",
        padding: "2rem",
        textAlign: "center",
      }}
    >
      <h3 className="section-title" style={{ fontSize: "1rem" }}>
        Déposer un fichier Excel / CSV
      </h3>
      <p className="section-copy" style={{ marginTop: ".5rem" }}>
        Zone prête pour l’upload catalogue.
      </p>

      <div style={{ marginTop: "1rem" }}>
        <button className="btn-secondary" type="button">
          Choisir un fichier
        </button>
      </div>
    </div>
  );
}