import Link from "next/link";
import { ArrowUpRight, Mail, Pencil, Phone, UserRound } from "lucide-react";
import UserRoleBadge from "./UserRoleBadge";
import UserActionsCell from "./UserActionsCell";

type UserRow = {
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

function initials(user: UserRow) {
  return `${user.first_name.charAt(0)}${user.last_name.charAt(0)}`.toUpperCase() || "U";
}

function roleCodeLabel(roleCode?: string | null) {
  switch (roleCode) {
    case "atc": return "Code ATC";
    case "rdm": return "Code RDM";
    case "cdv": return "Code CDV";
    default: return "Code";
  }
}

export default function UserTable({
  distributor,
  rows,
  currentUserId,
  atcs,
}: {
  distributor: string;
  rows: UserRow[];
  currentUserId: string;
  atcs: { id: string; first_name: string; last_name: string; email: string }[];
}) {
  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-[#D9E3F0] bg-white shadow-[0_8px_24px_rgba(15,23,42,0.04)]">
      <div className="user-table-desktop overflow-x-auto">
        <table className="w-full min-w-[980px] border-collapse">
          <thead>
            <tr className="bg-[#F8FBFF]">
              <th className="border-b border-[#D9E3F0] px-5 py-4 text-left text-xs font-bold uppercase tracking-[0.08em] text-[#94A3B8]">Utilisateur</th>
              <th className="border-b border-[#D9E3F0] px-5 py-4 text-left text-xs font-bold uppercase tracking-[0.08em] text-[#94A3B8]">Role</th>
              <th className="border-b border-[#D9E3F0] px-5 py-4 text-left text-xs font-bold uppercase tracking-[0.08em] text-[#94A3B8]">Code</th>
              <th className="border-b border-[#D9E3F0] px-5 py-4 text-center text-xs font-bold uppercase tracking-[0.08em] text-[#94A3B8]">Clients</th>
              <th className="border-b border-[#D9E3F0] px-5 py-4 text-center text-xs font-bold uppercase tracking-[0.08em] text-[#94A3B8]">Bons</th>
              <th className="border-b border-[#D9E3F0] px-5 py-4 text-left text-xs font-bold uppercase tracking-[0.08em] text-[#94A3B8]">Etat</th>
              <th className="border-b border-[#D9E3F0] px-5 py-4 text-right text-xs font-bold uppercase tracking-[0.08em] text-[#94A3B8]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="transition hover:bg-[#F8FBFF]">
                <td className="border-b border-[#E2E8F0]/70 px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#BFDBFE] bg-[#EFF6FF] text-sm font-bold text-[#0A4D9B]">
                      {initials(row)}
                    </div>
                    <div>
                      <Link href={`/${distributor}/admin/users/${row.id}`} className="font-semibold text-[#0F172A] transition hover:text-[#0A4D9B]">
                        {`${row.first_name} ${row.last_name}`.trim()}
                      </Link>
                      <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-[#6B7280]">
                        <span className="inline-flex items-center gap-1"><Mail className="h-3.5 w-3.5" />{row.email}</span>
                        {row.phone ? <span className="inline-flex items-center gap-1"><Phone className="h-3.5 w-3.5" />{row.phone}</span> : null}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="border-b border-[#E2E8F0]/70 px-5 py-4"><UserRoleBadge roleCode={row.roles?.code} roleLabel={row.roles?.label} /></td>
                <td className="border-b border-[#E2E8F0]/70 px-5 py-4">
                  <p className="text-xs font-bold uppercase tracking-[0.08em] text-[#94A3B8]">{roleCodeLabel(row.roles?.code)}</p>
                  <p className="mt-1 font-mono text-sm font-semibold text-[#0F172A]">{row.code || "-"}</p>
                </td>
                <td className="border-b border-[#E2E8F0]/70 px-5 py-4 text-center text-sm font-semibold text-[#0F172A]">{row._count?.clients ?? 0}</td>
                <td className="border-b border-[#E2E8F0]/70 px-5 py-4 text-center text-sm font-semibold text-[#0F172A]">{row._count?.bons ?? 0}</td>
                <td className="border-b border-[#E2E8F0]/70 px-5 py-4">
                  <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${row.is_active ? "border-[#BBF7D0] bg-[#F0FDF4] text-[#15803D]" : "border-[#FECACA] bg-[#FEF2F2] text-[#DC2626]"}`}>
                    {row.is_active ? "Actif" : "Inactif"}
                  </span>
                  {row.must_change_password ? (
                    <span className="ml-2 inline-flex rounded-full border border-[#FDE68A] bg-[#FFFBEB] px-3 py-1 text-xs font-bold text-[#B45309]">MDP</span>
                  ) : null}
                </td>
                <td className="border-b border-[#E2E8F0]/70 px-5 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/${distributor}/admin/users/${row.id}`} className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-[#BFDBFE] bg-white px-3 text-xs font-semibold text-[#0A4D9B] transition hover:bg-[#EFF6FF]">
                      <ArrowUpRight className="h-3.5 w-3.5" />
                      Voir
                    </Link>
                    <Link href={`/${distributor}/admin/users/${row.id}/edit`} className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-[#E2E8F0] bg-white px-3 text-xs font-semibold text-[#475569] transition hover:bg-[#F8FAFC]">
                      <Pencil className="h-3.5 w-3.5" />
                      Modifier
                    </Link>
                    <UserActionsCell
                      userId={row.id}
                      userName={`${row.first_name} ${row.last_name}`.trim()}
                      roleCode={row.roles?.code ?? ""}
                      isActive={row.is_active}
                      isSelf={row.id === currentUserId}
                      atcs={atcs}
                    />
                  </div>
                </td>
              </tr>
            ))}
            {!rows.length ? (
              <tr>
                <td colSpan={7} className="px-5 py-12 text-center text-sm text-[#94A3B8]">
                  Aucun utilisateur trouve.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <div className="user-table-mobile grid gap-3 p-3">
        {rows.map((row) => (
          <article key={row.id} className="rounded-[1.25rem] border border-[#E2E8F0] bg-[#F8FBFF] p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#BFDBFE] bg-white text-sm font-bold text-[#0A4D9B]">
                {initials(row)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold text-[#0F172A]">{`${row.first_name} ${row.last_name}`.trim()}</h3>
                  <UserRoleBadge roleCode={row.roles?.code} roleLabel={row.roles?.label} />
                </div>
                <p className="mt-1 truncate text-sm text-[#6B7280]">{row.email}</p>
                <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-xl bg-white p-2"><p className="text-[10px] font-bold uppercase text-[#94A3B8]">Code</p><p className="font-mono text-sm font-semibold text-[#0F172A]">{row.code || "-"}</p></div>
                  <div className="rounded-xl bg-white p-2"><p className="text-[10px] font-bold uppercase text-[#94A3B8]">Clients</p><p className="text-sm font-semibold text-[#0F172A]">{row._count?.clients ?? 0}</p></div>
                  <div className="rounded-xl bg-white p-2"><p className="text-[10px] font-bold uppercase text-[#94A3B8]">Bons</p><p className="text-sm font-semibold text-[#0F172A]">{row._count?.bons ?? 0}</p></div>
                </div>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
              <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${row.is_active ? "border-[#BBF7D0] bg-[#F0FDF4] text-[#15803D]" : "border-[#FECACA] bg-[#FEF2F2] text-[#DC2626]"}`}>
                {row.is_active ? "Actif" : "Inactif"}
              </span>
              <div className="flex flex-wrap gap-2">
                <Link href={`/${distributor}/admin/users/${row.id}`} className="btn-secondary">Voir</Link>
                <Link href={`/${distributor}/admin/users/${row.id}/edit`} className="btn-secondary">Modifier</Link>
                <UserActionsCell
                  userId={row.id}
                  userName={`${row.first_name} ${row.last_name}`.trim()}
                  roleCode={row.roles?.code ?? ""}
                  isActive={row.is_active}
                  isSelf={row.id === currentUserId}
                  atcs={atcs}
                />
              </div>
            </div>
          </article>
        ))}
        {!rows.length ? (
          <div className="rounded-[1.25rem] border border-dashed border-[#D9E3F0] p-8 text-center text-sm text-[#94A3B8]">
            Aucun utilisateur trouve.
          </div>
        ) : null}
      </div>

      <style>{`
        .user-table-desktop { display: none; }
        .user-table-mobile { display: grid; }
        @media (min-width: 1280px) {
          .user-table-desktop { display: block; }
          .user-table-mobile { display: none; }
        }
      `}</style>
    </div>
  );
}
