// src/components/nav-projects.tsx
import {
  LayoutDashboard,
  Building2,
  Users2,
  FileText,
  CreditCard,
  Bell,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

export function NavProjects() {
  const location = useLocation();

  const items = [
    { key: "dashboard", name: "Dashboard", url: "/app", icon: LayoutDashboard },
    {
      key: "habitaciones",
      name: "Habitaciones",
      url: "/app/habitaciones",
      icon: Building2,
    },
    {
      key: "inquilinos",
      name: "Inquilinos",
      url: "/app/inquilinos",
      icon: Users2,
    },
    {
      key: "contratos",
      name: "Contratos",
      url: "/app/contratos",
      icon: FileText,
    },
    {
      key: "pagos",
      name: "Pagos",
      url: "/app/pagos",
      icon: CreditCard,
    },
    {
      key: "recordatorios",
      name: "Recordatorios",
      url: "/app/recordatorios",
      icon: Bell,
    },
  ];

  // 👇 Dashboard solo es activo en /app exactamente
  // y los demás en su ruta exacta o hijos
  const isActive = (url: string) => {
    if (url === "/app") {
      return location.pathname === "/app";
    }
    return (
      location.pathname === url || location.pathname.startsWith(url + "/")
    );
  };

  return (
    <SidebarGroup className="p-2 group-data-[collapsible=icon]:!p-0">
      <SidebarGroupLabel className="px-2 text-xs uppercase tracking-wide text-gray-500 group-data-[collapsible=icon]:hidden">
        Gestión
      </SidebarGroupLabel>

      <SidebarMenu className="mt-2 space-y-1 group-data-[collapsible=icon]:mt-1">
        {items.map((item) => {
          const active = isActive(item.url);
          const Icon = item.icon;

          return (
            <SidebarMenuItem key={item.key}>
              <SidebarMenuButton
                asChild
                tooltip={item.name}
                className={[
                  "flex h-11 w-full items-center gap-2 rounded-md px-2 transition-colors",
                  active
                    ? "bg-gray-100 text-gray-900 dark:bg-zinc-800 dark:text-zinc-50"
                    : "text-muted-foreground hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-50",
                  "group-data-[collapsible=icon]:!h-10 group-data-[collapsible=icon]:!w-10",
                  "group-data-[collapsible=icon]:!p-0 group-data-[collapsible=icon]:!gap-0",
                  "group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:justify-center",
                ].join(" ")}
              >
                <NavLink
                  to={item.url}
                  className="flex h-full w-full items-center group-data-[collapsible=icon]:justify-center"
                >
                  <span className="flex h-5 w-5 items-center justify-center">
                    <Icon className="h-4 w-4 shrink-0" />
                  </span>
                  <span className="truncate group-data-[collapsible=icon]:hidden">
                    {item.name}
                  </span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
