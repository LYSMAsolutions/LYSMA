"use client";

import EntityModal from "@/components/admin/modals/EntityModal";
import StoreStaffEditForm from "@/components/admin/forms/StoreStaffEditForm";

type StaffItem = {
  id: string;
  first_name: string;
  last_name: string;
  initials: string;
  is_active: boolean;
  must_change_pin: boolean;
};

type Props = {
  open: boolean;
  onClose: () => void;
  staff: StaffItem;
};

export default function EditStoreStaffPopup({
  open,
  onClose,
  staff,
}: Props) {
  return (
    <EntityModal
      open={open}
      onClose={onClose}
      title="Modifier un magasinier"
      description="Mise à jour du profil et du statut du magasinier."
    >
      <StoreStaffEditForm staff={staff} />
    </EntityModal>
  );
}