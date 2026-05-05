import LogoutButton from "@/components/LogoutButton";
import { UserCircle } from "lucide-react";

type AtcHeaderProps = {
  firstName: string;
  lastName: string;
  email: string;
  leftSlot?: React.ReactNode;
};

export default function AtcHeader({ firstName, lastName, email, leftSlot }: AtcHeaderProps) {
  return (
    <header style={{ position: "sticky", top: 0, zIndex: 20, minHeight: "72px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", padding: "0 1.5rem", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", minWidth: 0 }}>
        {leftSlot && <div style={{ flexShrink: 0 }}>{leftSlot}</div>}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "40px", height: "40px", borderRadius: "12px", background: "rgba(255,255,255,0.7)", border: "1px solid rgba(191,219,254,0.8)", backdropFilter: "blur(8px)", flexShrink: 0 }}>
          <UserCircle size={18} color="#0a4d9b" strokeWidth={2} />
        </div>
        <div style={{ minWidth: 0 }}>
          <p style={{ margin: 0, fontSize: "0.875rem", fontWeight: 700, color: "#0f172a", whiteSpace: "nowrap" }}>Bonjour {firstName}</p>
          <p style={{ margin: 0, fontSize: "0.75rem", color: "#6b7280", whiteSpace: "nowrap" }}>Espace ATC</p>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <div style={{ textAlign: "right", minWidth: 0 }}>
          <p style={{ margin: 0, fontSize: "0.875rem", fontWeight: 600, color: "#0f172a", whiteSpace: "nowrap" }}>{firstName} {lastName}</p>
          <p style={{ margin: 0, fontSize: "0.75rem", color: "#6b7280", whiteSpace: "nowrap" }}>{email}</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", padding: "0.5rem 0.875rem", borderRadius: "12px", background: "rgba(255,255,255,0.65)", border: "1px solid rgba(217,227,240,0.7)", backdropFilter: "blur(8px)", flexShrink: 0 }}>
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}