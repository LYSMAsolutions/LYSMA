"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal, UserPlus } from "lucide-react";
import { useSearchParams } from "next/navigation";
import CreateUserPopup from "@/components/admin/popups/CreateUserPopup";
import UserTable from "./UserTable";

type RoleItem = { id: string; code: string; label: string };
type CdvItem = { id: string; first_name: string; last_name: string; email: string };
type StoreItem = { id: string; code: string; name: string };
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

const roleOrder = ["", "admin", "cdv", "atc", "rdm"];

export default function AdminUsersFilters({
  distributor,
  roles,
  cdvs,
  stores,
  initialUsers,
  currentUserId,
}: {
  distributor: string;
  roles: RoleItem[];
  cdvs: CdvItem[];
  stores: StoreItem[];
  initialUsers: UserItem[];
  currentUserId: string;
}) {
  const searchParams = useSearchParams();

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState(searchParams.get("role") ?? "");
  const [statusFilter, setStatusFilter] = useState(searchParams.get("status") ?? "");
  const [popupOpen, setPopupOpen] = useState(false);

  useEffect(() => {
    setRoleFilter(searchParams.get("role") ?? "");
    setStatusFilter(searchParams.get("status") ?? "");
  }, [searchParams]);

  const visibleRoles = useMemo(
    () =>
      roles
        .filter((role) => !["store_staff", "store"].includes(role.code))
        .sort((a, b) => roleOrder.indexOf(a.code) - roleOrder.indexOf(b.code)),
    [roles],
  );

  const filteredUsers = useMemo(() => {
    return initialUsers.filter((user) => {
      if (user.roles?.code === "store_staff" || user.roles?.code === "store") return false;
      const query = search.trim().toLowerCase();
      const haystack = [
        `${user.first_name} ${user.last_name}`,
        user.email,
        user.code,
        user.phone,
        user.roles?.label,
      ].join(" ").toLowerCase();
      const matchesSearch = !query || haystack.includes(query);
      const matchesRole = !roleFilter || user.roles?.code === roleFilter;
      const matchesStatus = !statusFilter || (statusFilter === "active" ? user.is_active : !user.is_active);
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [initialUsers, search, roleFilter, statusFilter]);

  const atcs = useMemo(
    () => initialUsers.filter((user) => user.roles?.code === "atc" && user.is_active),
    [initialUsers],
  );

  const activeFilters = Boolean(search || roleFilter || statusFilter);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="badge-lysma">Repertoire equipe</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#0F172A]">
            Utilisateurs operationnels
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6B7280]">
            Recherche par nom, email, code ATC, telephone ou role. Les magasiniers restent dans leur espace PIN dedie.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setPopupOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#0A4D9B,#1E73D8)] px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(30,115,216,0.25)] transition hover:-translate-y-0.5"
        >
          <UserPlus className="h-4 w-4" />
          Creer un utilisateur
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 rounded-[1.5rem] border border-[#D9E3F0] bg-[#F8FBFF] p-4 lg:grid-cols-[1.6fr_1fr_1fr_auto]">
        <label className="relative block">
          <span className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.08em] text-[#94A3B8]">
            <Search className="h-3.5 w-3.5" />
            Recherche
          </span>
          <input
            className="h-11 w-full rounded-2xl border border-[#D9E3F0] bg-white px-4 pl-10 text-sm text-[#0F172A] outline-none transition focus:border-[#0A4D9B] focus:ring-4 focus:ring-[#0A4D9B]/10"
            placeholder="Nom, email, code ATC, telephone..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <Search className="pointer-events-none absolute bottom-3 left-3 h-4 w-4 text-[#94A3B8]" />
        </label>

        <label className="block">
          <span className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.08em] text-[#94A3B8]">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Role
          </span>
          <select
            className="h-11 w-full rounded-2xl border border-[#D9E3F0] bg-white px-4 text-sm text-[#0F172A] outline-none transition focus:border-[#0A4D9B] focus:ring-4 focus:ring-[#0A4D9B]/10"
            value={roleFilter}
            onChange={(event) => setRoleFilter(event.target.value)}
          >
            <option value="">Tous les roles</option>
            {visibleRoles.map((role) => (
              <option key={role.id} value={role.code}>{role.label}</option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-2 block text-xs font-bold uppercase tracking-[0.08em] text-[#94A3B8]">
            Statut
          </span>
          <select
            className="h-11 w-full rounded-2xl border border-[#D9E3F0] bg-white px-4 text-sm text-[#0F172A] outline-none transition focus:border-[#0A4D9B] focus:ring-4 focus:ring-[#0A4D9B]/10"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="">Tous</option>
            <option value="active">Actifs</option>
            <option value="inactive">Inactifs</option>
          </select>
        </label>

        <div className="flex items-end">
          <button
            type="button"
            onClick={() => { setSearch(""); setRoleFilter(""); setStatusFilter(""); }}
            disabled={!activeFilters}
            className="h-11 rounded-2xl border border-[#D9E3F0] bg-white px-4 text-sm font-semibold text-[#475569] transition enabled:hover:border-[#BFD0E5] disabled:cursor-not-allowed disabled:opacity-45"
          >
            Reinitialiser
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-[#6B7280]">
          <strong className="text-[#0F172A]">{filteredUsers.length}</strong> utilisateur{filteredUsers.length > 1 ? "s" : ""} affiche{filteredUsers.length > 1 ? "s" : ""}
          {roleFilter ? (
            <span> - filtre : <strong className="text-[#0A4D9B]">{visibleRoles.find((role) => role.code === roleFilter)?.label ?? roleFilter}</strong></span>
          ) : null}
        </p>
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
        cdvs={cdvs}
        stores={stores}
      />
    </div>
  );
}
