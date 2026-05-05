"use client";

import { useActionState, useEffect } from "react";
import { updateStoreAccountAction } from "./actions";

const initialState = {
  success: false,
  error: null as string | null,
};

type AccountData = {
  store_id: string;
  login_email: string;
  is_active: boolean;
  must_change_password: boolean;
} | null;

export default function StoreAccountForm({
  storeId,
  account,
}: {
  storeId: string;
  account: AccountData;
}) {
  const [state, formAction, pending] = useActionState(
    updateStoreAccountAction,
    initialState
  );

  useEffect(() => {
    if (state.success) {
      window.location.reload();
    }
  }, [state.success]);

  return (
    <form action={formAction} className="page-stack">
      <input type="hidden" name="storeId" value={storeId} />

      <div>
        <label className="label">Email de connexion</label>
        <input
          className="input"
          name="loginEmail"
          type="email"
          defaultValue={account?.login_email || ""}
        />
      </div>

      <div>
        <label className="label">Nouveau mot de passe</label>
        <input className="input" name="password" type="password" />
        <p className="help">
          Laisse vide si tu veux conserver le mot de passe actuel.
        </p>
      </div>

      <div style={{ display: "grid", gap: "1rem" }}>
        <label>
          <input
            type="checkbox"
            name="isActive"
            value="true"
            defaultChecked={account?.is_active ?? true}
          />{" "}
          Compte actif
        </label>

        <label>
          <input
            type="checkbox"
            name="mustChangePassword"
            value="true"
            defaultChecked={account?.must_change_password ?? true}
          />{" "}
          Changement mot de passe requis
        </label>
      </div>

      {state.error ? <div className="alert-error">{state.error}</div> : null}

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button className="btn-primary" type="submit" disabled={pending}>
          {pending ? "Enregistrement..." : "Enregistrer"}
        </button>
      </div>
    </form>
  );
}