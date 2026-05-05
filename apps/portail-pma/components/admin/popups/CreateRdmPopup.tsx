"use client";

import EntityModal from "../modals/EntityModal";
import UserCreateForm from "../forms/UserCreateForm";

type RoleItem = {
  id: string;
  code: string;
  label: string;
};

export default function CreateRdmPopup({
  open,
  onClose,
  roles,
}: {
  open: boolean;
  onClose: () => void;
  roles: RoleItem[];
}) {
  return (
    <EntityModal
      open={open}
      onClose={onClose}
      title="Créer un RDM"
      description="Création rapide d’un responsable magasin."
    >
      <UserCreateForm
        roles={roles}
        forcedRoleCode="rdm"
        onSuccess={onClose}
      />
    </EntityModal>
  );
}