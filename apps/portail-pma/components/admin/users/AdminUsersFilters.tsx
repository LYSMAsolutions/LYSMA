"use client";

import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import CreateUserPopup from "@/components/admin/popups/CreateUserPopup";
import UserTable from "./UserTable";

type RoleItem = { id: string; code: string; label: string };
type UserItem = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string | null;
  code?: string | null;
  is_active: boolean;
  must_change_password: boolean;
  roles?: { code: string; label: string } | null;
  _count?: { clients: number; bons: number };
};

const inputStyle: React.CSSProperties = { width: "100%", padding: "0.7rem 1rem", borderRadius: "0.875rem", border: "1px solid rgba(217,227,240,0.9)", background: "rgba(255,255,255,0.85)", fontSize: "0.875rem", color: "#0f172a", outline: "none" };
const labelStyle: React.CSSProperties = { display: "block", marginBottom: "0.4rem", fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em" };

export default function AdminUsersFilters({
  distributor,
  roles,
  initialUsers,
  currentUserId,
}: {
  distributor: string;
  roles: RoleItem[];
  initialUsers: UserItem[];
  currentUserId: string;
}) {
  const searchParams = useSearchParams();

  const [search,       setSearch]       = useState("");
  const [roleFilter,   setRoleFilter]   = useState(searchParams.get("role") ?? "");
  const [statusFilter, setStatusFilter] = useState(searchParams.get("status") ?? "");
  const [popupOpen,    setPopupOpen]    = useState(false);

  // Sync si l'URL change (ex: clic sur un KPI)
  useEffect(() => {
    setRoleFilter(searchParams.get("role") ?? "");
    setStatusFilter(searchParams.get("status") ?? "");
  }, [searchParams]);

  const filteredUsers = useMemo(() => {
    return initialUsers.filter((user) => {
      if (user.roles?.code === "store_staff" || user.roles?.code === "store") return false;
      const query = search.trim().toLowerCase();
      const matchesSearch = !query ||
        `${user.first_name} ${user.last_name}`.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        (user.code || "").toLowerCase().includes(query) ||
        (user.phone || "").toLowerCase().includes(query);
      const matchesRole   = !roleFilter   || user.roles?.code === roleFilter;
      const matchesStatus = !statusFilter || (statusFilter === "active" ? user.is_active : !user.is_active);
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [initialUsers, search, roleFilter, statusFilter]);

  const atcs = useMemo(() =>
    initialUsers.filter((u) => u.roles?.code === "atc" && u.is_active),
    [initialUsers]
  );

  const activeFilters = search || roleFilter || statusFilter;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

      {/* Barre filtres */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr auto", gap: "1rem", alignItems: "end" }}>
        <div>
          <label style={labelStyle}>Recherche</label>
          <input style={inputStyle} placeholder="Nom, email, code, téléphone…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div>
          <label style={labelStyle}>Rôle</label>
          <select style={{ ...inputStyle, cursor: "pointer" }} value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
            <option value="">Tous les rôles</option>
            {roles.map((r) => <option key={r.id} value={r.code}>{r.label}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Statut</label>
          <select style={{ ...inputStyle, cursor: "pointer" }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">Tous</option>
            <option value="active">Actif</option>
            <option value="inactive">Inactif</option>
          </select>
        </div>
        <button
          type="button"
          onClick={() => setPopupOpen(true)}
          style={{ padding: "0.7rem 1.25rem", borderRadius: "0.875rem", background: "linear-gradient(135deg,#0a4d9b,#1e73d8)", color: "#fff", fontWeight: 700, fontSize: "0.875rem", border: "none", cursor: "pointer", boxShadow: "0 8px 20px rgba(30,115,216,0.25)", whiteSpace: "nowrap" }}
        >
          + Créer un utilisateur
        </button>
      </div>

      {/* Compteur + effacer */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <p style={{ margin: 0, fontSize: "0.82rem", color: "#94a3b8" }}>
          {filteredUsers.length} utilisateur{filteredUsers.length > 1 ? "s" : ""} affiché{filteredUsers.length > 1 ? "s" : ""}
          {roleFilter && <> · filtre : <strong style={{ color: "#0a4d9b" }}>{roles.find((r) => r.code === roleFilter)?.label ?? roleFilter}</strong></>}
        </p>
        {activeFilters && (
          <button type="button" onClick={() => { setSearch(""); setRoleFilter(""); setStatusFilter(""); }} style={{ padding: "0.3rem 0.75rem", borderRadius: "999px", fontSize: "0.75rem", fontWeight: 600, color: "#dc2626", border: "1px solid #fecaca", background: "#fef2f2", cursor: "pointer" }}>
            Effacer les filtres
          </button>
        )}
      </div>

      <UserTable
        distributor={distributor}
        rows={filteredUsers}
        currentUserId={currentUserId}
        atcs={atcs}
      />

      <CreateUserPopup
        open={popupOpen}
        onClose={() => { setPopupOpen(false); window.location.reload(); }}
        roles={roles}
      />
    </div>
  );
}