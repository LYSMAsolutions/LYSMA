import { getCurrentSession } from "@/lib/auth-session";
import { notFound, redirect } from "next/navigation";

type RequireAccessParams = {
  allowedRoles?:   string[];
  distributorSlug?: string;
};

export async function requireAccess({ allowedRoles, distributorSlug }: RequireAccessParams) {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/login?error=session_required");
  }

  const user = session.user;

  // Vérification rôle
  if (allowedRoles && !allowedRoles.includes(user.roleCode)) {
    // Rediriger vers l'espace du rôle réel, pas vers login
    redirect(`/${user.distributorSlug}/${getRoleBase(user.roleCode)}?error=unauthorized`);
  }

  // Vérification distributeur — isolation multi-tenant stricte
  if (distributorSlug && user.distributorSlug !== distributorSlug) {
    notFound();
  }

  // Si must_change_password → rediriger vers page changement sauf si déjà dessus
  if (user.mustChangePassword) {
    redirect(`/${user.distributorSlug}/change-password`);
  }

  return user;
}

/** Retourne la base de l'espace selon le rôle */
function getRoleBase(roleCode: string): string {
  switch (roleCode) {
    case "admin":       return "admin";
    case "cdv":         return "cdv";
    case "atc":         return "atc";
    case "rdm":         return "rdm";
    case "store":       return "store";
    case "store_staff": return "store";
    default:            return "";
  }
}