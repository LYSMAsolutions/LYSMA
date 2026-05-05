import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";

export default async function DistributorPage({
  params,
}: {
  params: Promise<{ distributor: string }>;
}) {
  const { distributor } = await params;
  const user = await requireUser();

  const dbUser = await prisma.users.findUnique({
    where: { id: user.id },
    include: {
      distributors: true,
      roles: true,
    },
  });

  if (!dbUser) {
    redirect("/login");
  }

  if (dbUser.distributors.slug !== distributor) {
    redirect("/login");
  }

  const base = `/${dbUser.distributors.slug}`;

  const redirectMap: Record<string, string> = {
    admin: `${base}/admin`,
    cdv: `${base}/cdv`,
    atc: `${base}/atc`,
    rdm: `${base}/rdm`,
    store: `${base}/store`,
    store_staff: `${base}/store`,
  };

  redirect(redirectMap[dbUser.roles.code] || base);
}
