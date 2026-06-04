import { redirect } from "next/navigation";

export default function SiteOnboardingAliasPage() {
  redirect("/dashboard/site/create");
}
