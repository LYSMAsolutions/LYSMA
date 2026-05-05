import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (!session) redirect("/login");

  const user = session.user as any;
  if (user.role === "ADMIN") redirect("/admin");
  if (user.role === "ATELIER") redirect("/atelier");

  redirect("/login");
}
