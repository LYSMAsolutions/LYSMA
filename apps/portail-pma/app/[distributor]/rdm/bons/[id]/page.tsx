import { redirect } from "next/navigation";

export default async function RdmBonPage({
  params,
}: {
  params: Promise<{ distributor: string; id: string }>;
}) {
  const { distributor, id } = await params;
  redirect(`/${distributor}/rdm/bons/${id}/detail`);
}
