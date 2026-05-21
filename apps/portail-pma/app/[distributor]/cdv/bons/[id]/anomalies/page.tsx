import { RoleBonResourcePage } from "@/components/role-dashboard/RoleBonResourcePage";
export default async function Page({ params }: { params: Promise<{ distributor: string; id: string }> }) {
  const { distributor, id } = await params;
  return <RoleBonResourcePage distributor={distributor} id={id} section="cdv" resource="anomalies" />;
}
