"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { columns, DisplayUser } from "./columns";
import { Select } from "@radix-ui/react-select";
import { MultiSelect } from "@/components/ui/multi-select";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ClientProps {
  page: number;
  data: DisplayUser[];
}

export function Client({ page, data }: ClientProps) {
  return (
    <div className="container p-5">
      <h1 className="text-3xl font-semibold">Users</h1>
      <div className="container">
        <DataTable data={data} columns={columns} />
      </div>
    </div>
  );
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

function capitalize(str: string) {
  return str.slice(0, 1).toUpperCase() + str.slice(1);
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });
  const [selectedRoles, setSelectedRoles] = useState<string[]>([
    "admin",
    "teacher",
    "student",
  ]);

  useEffect(() => {
    table.getColumn("role")?.setFilterValue(selectedRoles);
    console.log(selectedRoles);
  }, [selectedRoles, table]);

  return (
    <>
      <div className="my-5">
        <div className="flex flex-row items-center my-4">
          <span className="mr-2">Name: </span>
          <Input
            className="max-w-sm"
            value={
              (table.getColumn("name")?.getFilterValue() as string | null) || ""
            }
            onChange={(e) =>
              table.getColumn("name")?.setFilterValue(e.target.value)
            }
          />
        </div>
        <div className="flex flex-row items-center my-4">
          <span className="mr-2">Email: </span>
          <Input
            className="max-w-sm"
            value={
              (table.getColumn("email")?.getFilterValue() as string | null) ||
              ""
            }
            onChange={(e) =>
              table.getColumn("email")?.setFilterValue(e.target.value)
            }
          />
        </div>
        <br />
        <span className="mr-2">Role: </span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"outline"}>
              {selectedRoles.includes("admin") &&
              selectedRoles.includes("teacher") &&
              selectedRoles.includes("student")
                ? "Any role"
                : selectedRoles.map(capitalize).join(", ") ||
                  "No roles selected"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuCheckboxItem
              checked={selectedRoles.includes("admin")}
              onCheckedChange={() =>
                setSelectedRoles(
                  selectedRoles.includes("admin")
                    ? selectedRoles.filter((x) => x != "admin")
                    : [...selectedRoles, "admin"],
                )
              }
            >
              Admin
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={selectedRoles.includes("teacher")}
              onCheckedChange={() =>
                setSelectedRoles(
                  selectedRoles.includes("teacher")
                    ? selectedRoles.filter((x) => x != "teacher")
                    : [...selectedRoles, "teacher"],
                )
              }
            >
              Teacher
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={selectedRoles.includes("student")}
              onCheckedChange={() =>
                setSelectedRoles(
                  selectedRoles.includes("student")
                    ? selectedRoles.filter((x) => x != "student")
                    : [...selectedRoles, "student"],
                )
              }
            >
              Student
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="font-semibold">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
