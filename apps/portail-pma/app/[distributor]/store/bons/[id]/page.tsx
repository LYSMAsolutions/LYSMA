import { redirect } from "next/navigation";

export default async function StoreBonPage({
  params,
}: {
  params: Promise<{ distributor: string; id: string }>;
}) {
  const { distributor, id } = await params;
  redirect(`/${distributor}/store/bons/${id}/detail`);
}
