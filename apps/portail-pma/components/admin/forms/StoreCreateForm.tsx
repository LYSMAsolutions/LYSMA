"use client";

import { useActionState, useEffect } from "react";
import { createStoreAction } from "@/app/[distributor]/admin/stores/new/actions";

const initialState = {
  success: false,
  error: null as string | null,
};

export default function CreateStoreForm({
  distributorId,
}: {
  distributorId: string;
}) {
  const [state, formAction, pending] = useActionState(createStoreAction, initialState);

  useEffect(() => {
    if (state.success) {
      window.location.reload();
    }
  }, [state.success]);

  return (
    <form action={formAction} className="page-stack">
      <input type="hidden" name="distributorId" value={distributorId} />

      <div
        style={{
          display: "grid",
          gap: "1rem",
          gridTemplateColumns: "repeat(2,minmax(0,1fr))",
        }}
      >
        <div>
          <label className="label">Code magasin</label>
          <input className="input" name="code" />
        </div>
        <div>
          <label className="label">Nom magasin</label>
          <input className="input" name="name" />
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gap: "1rem",
          gridTemplateColumns: "repeat(2,minmax(0,1fr))",
        }}
      >
        <div>
          <label className="label">Ville</label>
          <input className="input" name="city" />
        </div>
        <div>
          <label className="label">Code postal</label>
          <input className="input" name="postalCode" />
        </div>
      </div>

      <div>
        <label className="label">Adresse</label>
        <input className="input" name="address" />
      </div>

      <div
        style={{
          display: "grid",
          gap: "1rem",
          gridTemplateColumns: "repeat(2,minmax(0,1fr))",
        }}
      >
        <div>
          <label className="label">Téléphone</label>
          <input className="input" name="phone" />
        </div>
        <div>
          <label className="label">Email</label>
          <input className="input" name="email" type="email" />
        </div>
      </div>

      <div>
        <label>
          <input type="checkbox" name="isActive" value="true" defaultChecked />{" "}
          Magasin actif
        </label>
      </div>

      {state.error ? <div className="alert-error">{state.error}</div> : null}

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button className="btn-primary" type="submit" disabled={pending}>
          {pending ? "Création..." : "Créer le magasin"}
        </button>
      </div>
    </form>
  );
}