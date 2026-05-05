"use client";

import { useState } from "react";
import EntityModal from "../modals/EntityModal";
import UserCreateForm from "../forms/UserCreateForm";

type RoleItem = {
  id: string;
  code: string;
  label: string;
};

export default function CreateAtcPopup({
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
          Créer un ATC
        </button>
      ) : null}

      <EntityModal
        open={visible}
        onClose={closeAll}
        title="Créer un ATC"
        description="Création rapide d’un attaché technico-commercial."
      >
        <UserCreateForm
          roles={roles}
          forcedRoleCode="atc"
          onSuccess={closeAll}
        />
      </EntityModal>
    </>
  );
}