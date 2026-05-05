"use client";

import EntityModal from "@/components/admin/modals/EntityModal";
import ClientEditForm from "@/components/admin/forms/ClientEditForm";

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

type ClientItem = {
  id: string;
  code: string;
  name: string;
  address?: string | null;
  postal_code?: string | null;
  city?: string | null;
  email?: string | null;
  phone?: string | null;
  store_id?: string | null;
  assigned_user_id?: string | null;
};

type Props = {
  open: boolean;
  onClose: () => void;
  client: ClientItem;
  stores: StoreItem[];
  atcs: AtcItem[];
};

export default function EditClientPopup({
  open,
  onClose,
  client,
  stores,
  atcs,
}: Props) {
  return (
    <EntityModal
      open={open}
      onClose={onClose}
      title="Modifier un client"
      description="Mise à jour des informations client et de ses rattachements."
    >
      <ClientEditForm client={client} stores={stores} atcs={atcs} />
    </EntityModal>
  );
}