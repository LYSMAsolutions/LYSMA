"use client";

import EntityModal from "@/components/admin/modals/EntityModal";
import UserEditForm from "@/components/admin/forms/UserEditForm";

type RoleItem = {
  id: string;
  code: string;
  label: string;
};

type UserItem = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string | null;
  code?: string | null;
  is_active: boolean;
  must_change_password: boolean;
  role_id: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  user: UserItem;
  roles: RoleItem[];
};

export default function EditUserPopup({
  open,
  onClose,
  user,
  roles,
}: Props) {
  return (
    <EntityModal
      open={open}
      onClose={onClose}
      title="Modifier un utilisateur"
      description="Mise à jour du profil, du rôle et du statut utilisateur."
    >
      <UserEditForm user={user} roles={roles} cdvs={[]} atcs={[]} />
    </EntityModal>
  );
}
