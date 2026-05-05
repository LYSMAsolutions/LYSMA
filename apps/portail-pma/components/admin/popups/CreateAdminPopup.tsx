"use client";

import EntityModal from "@/components/admin/modals/EntityModal";
import UserCreateForm from "@/components/admin/forms/UserCreateForm";

type RoleItem = {
  id: string;
  code: string;
  label: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  roles: RoleItem[];
};

export default function CreateAdminPopup({
  open,
  onClose,
  roles,
}: Props) {
  return (
    <EntityModal
      open={open}
      onClose={onClose}
      title="Créer un administrateur"
      description="Création rapide d’un compte administrateur distributeur."
    >
      <UserCreateForm
        roles={roles}
        forcedRoleCode="admin"
        onSuccess={onClose}
      />
    </EntityModal>
  );
}