// src/feature/properties/components/GridRooms.tsx

import { useEffect, useMemo, useState } from "react";
import { RoomCard } from "./RoomCard";
import type { Room, RoomsByFloor } from "../types";
import { EmptyState } from "@/components/EmptyState";
import { Home } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const getFloorLabel = (numeroPiso: number) => {
  switch (numeroPiso) {
    case 1:
      return "Primer piso";
    case 2:
      return "Segundo piso";
    case 3:
      return "Tercer piso";
    case 4:
      return "Cuarto piso";
    case 5:
      return "Quinto piso";
    case 6:
      return "Sexto piso";
    case 7:
      return "Séptimo piso";
    case 8:
      return "Octavo piso";
    default:
      return `Piso ${numeroPiso}`;
  }
};

type GridRoomsProps = {
  floors?: RoomsByFloor[];
  onEditRoom?: (room: Room) => void;
  onDeleteRoom?: (room: Room) => void;
};

const PAGE_SIZE = 9;

export function GridRooms({ floors, onEditRoom, onDeleteRoom }: GridRoomsProps) {
  const safeFloors = floors ?? [];

  // Agrupar habitaciones por piso y ordenar
  const sortedFloors = useMemo(() => {
    return [...safeFloors]
      .filter((f) => (f.rooms ?? []).length > 0)
      .sort((a, b) => a.floorNumber - b.floorNumber)
      .map((floor) => ({
        ...floor,
        rooms: [...(floor.rooms ?? [])].sort((a, b) => {
          const codeA = Number(a.code);
          const codeB = Number(b.code);
          const validA = Number.isFinite(codeA);
          const validB = Number.isFinite(codeB);
          if (validA && validB) return codeA - codeB;
          if (validA) return -1;
          if (validB) return 1;
          return a.code.localeCompare(b.code);
        }),
      }));
  }, [safeFloors]);

  // Aplanar para paginación global
  const allRooms = useMemo(() => {
    return sortedFloors.flatMap((floor) =>
      (floor.rooms ?? []).map((room) => ({
        room,
        floorNumber: floor.floorNumber,
      }))
    );
  }, [sortedFloors]);

  if (sortedFloors.length === 0 || allRooms.length === 0) {
    return (
      <EmptyState
        icon={Home}
        title="No hay habitaciones registradas"
        description="Comienza agregando habitaciones a tu propiedad para gestionar alquileres."
        compact
      />
    );
  }

  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(allRooms.length / PAGE_SIZE));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const startIndex = (page - 1) * PAGE_SIZE;
  const paginatedRooms = allRooms.slice(startIndex, startIndex + PAGE_SIZE);

  // Agrupar las habitaciones paginadas por piso
  const paginatedRoomsByFloor = useMemo(() => {
    const map = new Map<number, { floorNumber: number; rooms: Room[] }>();
    paginatedRooms.forEach(({ room, floorNumber }) => {
      if (!map.has(floorNumber)) {
        map.set(floorNumber, { floorNumber, rooms: [] });
      }
      map.get(floorNumber)!.rooms.push(room);
    });
    // Ordenar por número de piso
    return Array.from(map.values()).sort((a, b) => a.floorNumber - b.floorNumber);
  }, [paginatedRooms]);

  return (
    <div className="space-y-8">
      {paginatedRoomsByFloor.map(({ floorNumber, rooms }) => (
        <div key={floorNumber} className="space-y-3">
          <h2 className="text-lg font-bold text-slate-700 dark:text-white/90 pl-1">
            {getFloorLabel(floorNumber)}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {rooms.map((room) => (
              <RoomCard
                key={room.id}
                roomId={room.id}
                codigo={room.code}
                estado={room.status}
                precioRenta={room.rentPrice}
                numeroPiso={floorNumber}
                onEdit={onEditRoom ? () => onEditRoom(room) : undefined}
                onDelete={onDeleteRoom ? () => onDeleteRoom(room) : undefined}
              />
            ))}
          </div>
        </div>
      ))}

      <p className="text-xs text-muted-foreground">
        Mostrando{" "}
        <span className="font-medium">
          {allRooms.length === 0 ? 0 : startIndex + 1}
        </span>{" "}
        –{" "}
        <span className="font-medium">
          {Math.min(startIndex + PAGE_SIZE, allRooms.length)}
        </span>{" "}
        de <span className="font-medium">{allRooms.length}</span>{" "}
        habitaciones
      </p>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              aria-disabled={page === 1}
              onClick={(e) => {
                e.preventDefault();
                if (page > 1) setPage(page - 1);
              }}
            />
          </PaginationItem>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <PaginationItem key={p}>
              <PaginationLink
                href="#"
                isActive={p === page}
                onClick={(e) => {
                  e.preventDefault();
                  setPage(p);
                }}
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              href="#"
              aria-disabled={page === totalPages}
              onClick={(e) => {
                e.preventDefault();
                if (page < totalPages) setPage(page + 1);
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
