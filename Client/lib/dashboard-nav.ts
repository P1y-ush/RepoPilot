import { ComponentType } from "react";
import { FolderGit2, LayoutGrid, Settings } from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
  exact?: boolean;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const dashboardNavGroups: NavGroup[] = [
  {
    label: "Workspace",
    items: [
      {
        title: "Overview",
        href: "/dashboard/overview",
        icon: LayoutGrid,
        exact: true,
      },
      {
        title: "Repositories",
        href: "/dashboard",
        icon: FolderGit2,
        exact: true,
      },
    ],
  },
  {
    label: "Account",
    items: [
      {
        title: "Settings",
        href: "/dashboard/settings",
        icon: Settings,
      },
    ],
  },
];

export function isDashboardNavActive(
  pathname: string,
  href: string,
  exact?: boolean
): boolean {
  if (exact) {
    return pathname === href;
  }
  return pathname.startsWith(href);
}
