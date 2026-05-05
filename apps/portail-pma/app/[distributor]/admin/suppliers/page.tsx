import { redirect } from "next/navigation";

export default async function AdminSuppliersRedirectPage({
  params,
}: {
  params: Promise<{ distributor: string }>;
}) {
  const { distributor } = await params;
  redirect(`/${distributor}/admin/catalogues/fournisseurs`);
}
