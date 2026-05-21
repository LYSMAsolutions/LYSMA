import { redirect } from "next/navigation";

export default async function CdvBonPage({
  params,
}: {
  params: Promise<{ distributor: string; id: string }>;
}) {
  const { distributor, id } = await params;
  redirect(`/${distributor}/cdv/bons/${id}/detail`);
}
