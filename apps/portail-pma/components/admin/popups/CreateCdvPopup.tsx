"use client";

import { useState } from "react";
import EntityModal from "../modals/EntityModal";
import UserCreateForm from "../forms/UserCreateForm";

type RoleItem = {
  id: string;
  code: string;
  label: string;
};

export default function CreateCdvPopup({
  open,
  onClose,
  roles,
}: {
  open: boolean;
  onClose: () => void;
  roles: RoleItem[];
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const visible = open || internalOpen;

  function closeAll() {
    setInternalOpen(false);
    onClose();
  }

  return (
    <>
      {!open ? (
        <button className="btn-primary" type="button" onClick={() => setInternalOpen(true)}>
          Créer un CDV
        </button>
      ) : null}

      <EntityModal
        open={visible}
        onClose={closeAll}
        title="Créer un CDV"
        description="Création rapide d’un chef des ventes."
      >
        <UserCreateForm
          roles={roles}
          forcedRoleCode="cdv"
          onSuccess={closeAll}
        />
      </EntityModal>
    </>
  );
}