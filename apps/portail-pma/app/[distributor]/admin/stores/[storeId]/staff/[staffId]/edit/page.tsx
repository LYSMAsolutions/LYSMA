import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAccess } from "@/lib/require-access";
import { notFound } from "next/navigation";
import { ChevronLeft, BadgeCheck } from "lucide-react";
import { updateStoreStaffAction } from "./actions";
import { StoreStaffForm } from "../../store-staff-form";

export default async function AdminStoreStaffEditPage({
  params,
}: {
  params: Promise<{ distributor: string; storeId: string; staffId: string }>;
}) {
  const { distributor, storeId, staffId } = await params;
  const user = await requireAccess({
    allowedRoles: ["admin"],
    distributorSlug: distributor,
  });

  const adminBase = `/${user.distributorSlug}/admin`;

  const [store, staff] = await Promise.all([
    prisma.stores.findFirst({
      where: {
        id: storeId,
        distributor_id: user.distributorId,
      },
      select: {
        id: true,
        name: true,
      },
    }),

    prisma.store_staff.findFirst({
      where: {
        id: staffId,
        store_id: storeId,
        stores: {
          distributor_id: user.distributorId,
        },
      },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        initials: true,
        is_active: true,
      },
    }),
  ]);

  if (!store || !staff) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div>
        <Link
          href={`${adminBase}/stores/${store.id}/staff`}
          className="inline-flex items-center gap-2 text-sm font-medium text-[#0A4D9B] transition hover:opacity-80"
        >
          <ChevronLeft className="h-4 w-4" />
          Retour à l’équipe magasin
        </Link>
      </div>

      <section className="glass-panel rounded-[2rem] p-8 md:p-12">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#E8F1FB]">
            <BadgeCheck className="h-5 w-5 text-[#0A4D9B]" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#6B7280]">
              Espace admin - Modifier magasinier
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#0A4D9B] md:text-4xl">
              {staff.first_name} {staff.last_name}
            </h1>
          </div>
        </div>
      </section>

      <StoreStaffForm
        action={updateStoreStaffAction.bind(null, distributor, store.id, staff.id)}
        cancelHref={`${adminBase}/stores/${store.id}/staff`}
        isEdit
        defaultValues={{
          first_name: staff.first_name,
          last_name: staff.last_name,
          initials: staff.initials,
          status: staff.is_active ? "active" : "inactive",
        }}
      />
    </div>
  );
}