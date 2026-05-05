"use client";

import EntityModal from "../modals/EntityModal";
import UserCreateForm from "../forms/UserCreateForm";

type RoleItem = {
  id: string;
  code: string;
  label: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  roles: RoleItem[];
  forcedRoleCode?: "admin" | "cdv" | "rdm" | "atc";
};

export default function CreateUserPopup({
  open,
  onClose,
  roles,
  forcedRoleCode,
}: Props) {
  return (
    <EntityModal
      open={open}
      onClose={onClose}
      title="Créer un utilisateur"
      description="Création rapide d’un compte utilisateur."
    >
      <UserCreateForm
        roles={roles}
        forcedRoleCode={forcedRoleCode}
        onSuccess={onClose}
      />
    </EntityModal>
  );
}