// src/components/current-property-switcher.tsx

import { ChevronLeft } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSidebar } from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";
import { useCurrentPropertyStore } from "@/store/useCurrentPropertyStore";

type CurrentPropertySwitcherProps = {
  name: string;
};

export function CurrentPropertySwitcher({
  name,
}: CurrentPropertySwitcherProps) {
  const { state, isMobile } = useSidebar();
  const navigate = useNavigate();

  const clearCurrentProperty = useCurrentPropertyStore(
    (state) => state.clearCurrentProperty
  );

  const handleClick = () => {
    // Limpiamos la propiedad actual y volvemos a la pantalla de selección
    clearCurrentProperty();
    navigate("/start");
  };

  const button = (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Cambiar propiedad actual"
      className={[
        "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left",
        "hover:bg-muted/70",
        "transition-colors",
        "group-data-[collapsible=icon]:justify-center",
      ].join(" ")}
    >
      <span className="flex h-6 w-6 items-center justify-center rounded-full border bg-background">
        <ChevronLeft className="h-3.5 w-3.5 text-muted-foreground" />
      </span>

      <div className="flex min-w-0 flex-col group-data-[collapsible=icon]:hidden">
        <span className="text-[10px] font-medium text-muted-foreground">
          Propiedad actual
        </span>
        <span className="text-sm font-semibold text-foreground leading-tight truncate">
          {name}
        </span>
      </div>
    </button>
  );

  const content = (
    <div className="mb-2 mt-1">
      <Separator className="mb-2 group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:w-8" />
      {button}
      <Separator className="mt-2 group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:w-8" />
    </div>
  );

  // 👉 Si el sidebar está expandido o es mobile: sin tooltip
  if (state !== "collapsed" || isMobile) {
    return content;
  }

  // 👉 Solo con tooltip cuando está colapsado en desktop
  return (
    <div className="mb-2 mt-1">
      <Separator className="mb-2 group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:w-8" />

      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent side="right" align="center">
          <p className="text-xs font-medium">Volver a propiedades</p>
        </TooltipContent>
      </Tooltip>

      <Separator className="mt-2 group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:w-8" />
    </div>
  );
}
