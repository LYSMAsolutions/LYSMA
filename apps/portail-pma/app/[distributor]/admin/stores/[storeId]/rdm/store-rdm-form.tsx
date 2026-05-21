"use client";

import { useActionState, useEffect, useState } from "react";
import { updateStoreRdmAction } from "./actions";
import CreateRdmPopup from "@/components/admin/popups/CreateRdmPopup";

const initialState = {
  success: false,
  error: null as string | null,
};

type RdmItem = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
};

type RoleItem = {
  id: string;
  code: string;
  label: string;
};

export default function StoreRdmForm({
  storeId,
  storeCode,
  storeName,
  currentRdmId,
  rdms,
  roles,
}: {
  storeId: string;
  storeCode: string;
  storeName: string;
  currentRdmId: string | null;
  rdms: RdmItem[];
  roles: RoleItem[];
}) {
  const [state, formAction, pending] = useActionState(updateStoreRdmAction, initialState);
  const [popupOpen, setPopupOpen] = useState(false);

  useEffect(() => {
    if (state.success) {
      window.location.reload();
    }
  }, [state.success]);

  return (
    <>
      <form action={formAction} className="page-stack">
        <input type="hidden" name="storeId" value={storeId} />

        <div>
          <label className="label">Responsable magasin</label>
          <select
            className="select"
            name="rdmId"
            defaultValue={currentRdmId || ""}
          >
            <option value="">Aucun RDM</option>
            {rdms.map((rdm) => (
              <option key={rdm.id} value={rdm.id}>
                {`${rdm.first_name} ${rdm.last_name}`.trim()} · {rdm.email}
              </option>
            ))}
          </select>
        </div>

        {state.error ? <div className="alert-error">{state.error}</div> : null}

        <div style={{ display: "flex", gap: ".75rem", justifyContent: "space-between" }}>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => setPopupOpen(true)}
          >
            Créer un RDM
          </button>

          <button className="btn-primary" type="submit" disabled={pending}>
            {pending ? "Enregistrement..." : "Enregistrer"}
          </button>
        </div>
      </form>

      <CreateRdmPopup
        open={popupOpen}
        onClose={() => {
          setPopupOpen(false);
          window.location.reload();
        }}
        roles={roles}
        stores={[{ id: storeId, code: storeCode, name: storeName }]}
        initialStoreIds={[storeId]}
      />
    </>
  );
}
