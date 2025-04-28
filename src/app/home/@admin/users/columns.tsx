"use client";

import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";

export interface DisplayUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export const columns: ColumnDef<DisplayUser>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
    filterFn: (row, columnId, filterValue: string[]) =>
      filterValue.includes(row.getValue(columnId)),
    cell: ({ row }) => {
      const role = row.getValue("role") as string;
      return (
        <Badge variant={role === "admin" ? "destructive" : "secondary"}>
          {role}
        </Badge>
      );
    },
  },
];
