"use client";

import EntityModal from "@/components/admin/modals/EntityModal";
import StoreStaffCreateForm from "@/components/admin/forms/StoreStaffCreateForm";

type Props = {
  open: boolean;
  onClose: () => void;
  storeId: string;
};

export default function CreateStoreStaffPopup({
  open,
  onClose,
  storeId,
}: Props) {
  return (
    <EntityModal
      open={open}
      onClose={onClose}
      title="Créer un magasinier"
      description="Ajout rapide d’un magasinier dans l’équipe du magasin."
    >
      <StoreStaffCreateForm storeId={storeId} />
    </EntityModal>
  );
}