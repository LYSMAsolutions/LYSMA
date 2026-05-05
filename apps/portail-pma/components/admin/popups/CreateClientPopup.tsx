"use client";

import EntityModal from "../modals/EntityModal";
import ClientCreateForm from "../forms/ClientCreateForm";

type StoreItem = {
  id: string;
  code: string;
  name: string;
};

type AtcItem = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
};

export default function CreateClientPopup({
  open,
  onClose,
  distributorId,
  stores,
  atcs,
}: {
  open: boolean;
  onClose: () => void;
  distributorId: string;
  stores: StoreItem[];
  atcs: AtcItem[];
}) {
  return (
    <EntityModal
      open={open}
      onClose={onClose}
      title="Créer un client"
      description="Ajout manuel d’un client."
    >
      <ClientCreateForm
        distributorId={distributorId}
        stores={stores}
        atcs={atcs}
        onSuccess={onClose}
      />
    </EntityModal>
  );
}