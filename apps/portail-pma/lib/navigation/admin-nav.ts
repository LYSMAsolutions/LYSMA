import {
  LayoutDashboard,
  Users,
  Store,
  Bell,
  ShieldCheck,
  Settings,
  BookOpen,
  FileText,
  Building2,
  Shield,
} from "lucide-react";

export function getAdminNavItems(distributor: string) {
  return [
    {
      label: "Dashboard",
      href: `/${distributor}/admin`,
      icon: LayoutDashboard,
      exact: true,
    },
    {
      label: "Utilisateurs",
      href: `/${distributor}/admin/users`,
      icon: Users,
    },
    {
      label: "Magasins",
      href: `/${distributor}/admin/stores`,
      icon: Store,
    },
    {
      label: "Clients",
      href: `/${distributor}/admin/clients`,
      icon: Building2,
    },
    {
      label: "Bons",
      href: `/${distributor}/admin/bons`,
      icon: FileText,
    },
    {
      label: "Garanties",
      href: `/${distributor}/admin/garanties`,
      icon: Shield,
    },
    {
      label: "Catalogues",
      href: `/${distributor}/admin/catalogues`,
      icon: BookOpen,
    },
    {
      label: "Alertes",
      href: `/${distributor}/admin/alerts`,
      icon: Bell,
    },
    {
      label: "Sécurité",
      href: `/${distributor}/admin/security`,
      icon: ShieldCheck,
    },
    {
      label: "Paramètres",
      href: `/${distributor}/admin/settings`,
      icon: Settings,
    },
  ];
}