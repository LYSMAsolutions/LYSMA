"use client";

import EntityModal from "../modals/EntityModal";
import UserCreateForm from "../forms/UserCreateForm";

type RoleItem = {
  id: string;
  code: string;
  label: string;
};
type StoreItem = { id: string; code: string; name: string };

export default function CreateRdmPopup({
  open,
  onClose,
  roles,
  stores = [],
  initialStoreIds = [],
}: {
  open: boolean;
  onClose: () => void;
  roles: RoleItem[];
  stores?: StoreItem[];
  initialStoreIds?: string[];
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
        stores={stores}
        initialStoreIds={initialStoreIds}
        onSuccess={onClose}
      />
    </EntityModal>
  );
}
