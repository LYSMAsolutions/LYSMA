"use client";

type DefaultValues = {
  first_name?: string;
  last_name?: string;
  initials?: string;
  status?: "active" | "inactive";
};

type Props = {
  action: (formData: FormData) => unknown | Promise<unknown>;
  cancelHref: string;
  isEdit?: boolean;
  defaultValues?: DefaultValues;
};

export function StoreStaffForm({ action, cancelHref, isEdit = false, defaultValues }: Props) {
  return (
    <form action={action as any} className="card-lysma" style={{ padding: "2rem", display: "grid", gap: "1rem" }}>
      <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(2,minmax(0,1fr))" }}>
        <div>
          <label className="label">Prénom</label>
          <input className="input" name="first_name" defaultValue={defaultValues?.first_name ?? ""} required />
        </div>
        <div>
          <label className="label">Nom</label>
          <input className="input" name="last_name" defaultValue={defaultValues?.last_name ?? ""} required />
        </div>
      </div>
      <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(2,minmax(0,1fr))" }}>
        <div>
          <label className="label">Initiales</label>
          <input className="input" name="initials" defaultValue={defaultValues?.initials ?? ""} required maxLength={4} />
        </div>
        <div>
          <label className="label">Statut</label>
          <select className="input" name="status" defaultValue={defaultValues?.status ?? "active"}>
            <option value="active">Actif</option>
            <option value="inactive">Inactif</option>
          </select>
        </div>
      </div>
      <div style={{ display: "flex", gap: ".75rem", justifyContent: "flex-end" }}>
        <a href={cancelHref} className="btn-secondary">Annuler</a>
        <button type="submit" className="btn-primary">{isEdit ? "Enregistrer" : "Créer le magasinier"}</button>
      </div>
    </form>
  );
}

export default StoreStaffForm;
