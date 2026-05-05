"use client";

import { useState } from "react";
import CreateStoreStaffPopup from "@/components/admin/popups/CreateStoreStaffPopup";

export default function AddStaffButton({ storeId }: { storeId: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        style={{
          display: "inline-flex",
          padding: "0.65rem 1.25rem",
          borderRadius: "0.875rem",
          background: "rgba(238,242,255,0.9)",
          color: "#4338ca",
          border: "1px solid #c7d2fe",
          fontWeight: 600,
          fontSize: "0.875rem",
          cursor: "pointer",
        }}
      >
        + Ajouter un magasinier
      </button>

      <CreateStoreStaffPopup
        open={open}
        onClose={() => {
          setOpen(false);
          window.location.reload();
        }}
        storeId={storeId}
      />
    </>
  );
}