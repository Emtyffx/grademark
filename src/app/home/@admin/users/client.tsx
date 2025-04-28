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
  useReactTable,
} from "@tanstack/react-table";
import { columns, DisplayUser } from "./columns";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useIsMount } from "@/lib/hooks";

interface ClientProps {
  page: number;
  data: DisplayUser[];
  pageCount: number;
}

export function Client({ page, data, pageCount }: ClientProps) {
  return (
    <div className="container p-5">
      <h1 className="text-3xl font-semibold">Users</h1>
      <div className="container">
        <DataTable
          data={data}
          columns={columns}
          page={page}
          pageCount={pageCount}
        />
      </div>
    </div>
  );
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  page: number;
  pageCount: number;
}

function capitalize(str: string) {
  return str.slice(0, 1).toUpperCase() + str.slice(1);
}

function eqSet<T>(xs: Set<T>, ys: Set<T>) {
  return xs.size == ys.size && [...xs].every(ys.has);
}

function toggleInArray<T>(array: T[], value: T) {
  if (array.includes(value)) {
    return array.filter((x) => x !== value);
  } else {
    return [...array, value];
  }
}

export function DataTable<TData, TValue>({
  columns,
  data,
  page,
  pageCount,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  const isFirstRender = useIsMount();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const allRoles = ["admin", "teacher", "student"];
  const [name, setName] = useState<string | null>(searchParams.get("name"));
  const [email, setEmail] = useState<string | null>(searchParams.get("email"));
  const [roles, setRoles] = useState<string[]>(
    searchParams.get("roles") === ""
      ? []
      : searchParams.get("roles")?.split(",") || allRoles,
  );

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (name) {
      params.set("name", name);
    } else {
      params.delete("name");
    }

    if (email) {
      params.set("email", email);
    } else {
      params.delete("email");
    }
    console.log(isFirstRender);
    params.set("roles", roles.map((x) => x.toLowerCase()).join(","));

    if (!isFirstRender) {
      params.set("page", "1");
    }
    router.push(pathname + "?" + params);
  }, [name, email, roles]);
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams],
  );

  return (
    <>
      <div className="my-5 flex flex-col items-start sm:items-center sm:flex-row gap-4">
        <div className="flex flex-row items-center my-4">
          <span className="mr-2">Name: </span>
          <Input
            className="max-w-sm"
            value={name || ""}
            onChange={(e) => setName(e.target.value || null)}
          />
        </div>
        <div className="flex flex-row items-center my-4">
          <span className="mr-2">Email: </span>
          <Input
            className="max-w-sm"
            value={email || ""}
            onChange={(e) => setEmail(e.target.value || null)}
          />
        </div>
        <br />
        <div className="flex flex-row items-center">
          <span className="mr-2">Role: </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={"outline"}>
                {roles.length === 3
                  ? "Any role"
                  : roles.length > 0
                    ? roles.map(capitalize).join(", ")
                    : "No roles selected"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuCheckboxItem
                checked={roles.includes("admin")}
                onCheckedChange={() => setRoles(toggleInArray(roles, "admin"))}
              >
                Admin
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={roles.includes("teacher")}
                onCheckedChange={() =>
                  setRoles(toggleInArray(roles, "teacher"))
                }
              >
                Teacher
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={roles.includes("student")}
                onCheckedChange={() =>
                  setRoles(toggleInArray(roles, "student"))
                }
              >
                Student
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Button
          onClick={() => {
            setName("");
            setEmail("");
            setRoles(allRoles);
          }}
        >
          Clear filters
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="font-bold">
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
                  onClick={() => console.log(row.id)}
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

      <div className="flex flex-row justify-end items-center mt-5 gap-2">
        <span>
          {page} of {pageCount}
        </span>
        <Button
          disabled={page === 1}
          onClick={() =>
            router.push(
              pathname + "?" + createQueryString("page", "" + (page - 1)),
            )
          }
          variant="outline"
        >
          Prev
        </Button>
        <Button
          disabled={page === pageCount}
          onClick={() =>
            router.push(
              pathname + "?" + createQueryString("page", "" + (page + 1)),
            )
          }
          variant="outline"
        >
          Next
        </Button>
      </div>
    </>
  );
}
