"use client";

import EntityModal from "../modals/EntityModal";
import UserCreateForm from "../forms/UserCreateForm";

type RoleItem = {
  id: string;
  code: string;
  label: string;
};
type CdvItem = { id: string; first_name: string; last_name: string; email: string };
type StoreItem = { id: string; code: string; name: string };

type Props = {
  open: boolean;
  onClose: () => void;
  roles: RoleItem[];
  forcedRoleCode?: "admin" | "cdv" | "rdm" | "atc";
  cdvs?: CdvItem[];
  stores?: StoreItem[];
};

export default function CreateUserPopup({
  open,
  onClose,
  roles,
  forcedRoleCode,
  cdvs,
  stores,
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
        cdvs={cdvs}
        stores={stores}
        onSuccess={onClose}
      />
    </EntityModal>
  );
}
