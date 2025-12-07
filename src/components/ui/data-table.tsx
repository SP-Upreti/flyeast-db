"use client";

import * as React from "react";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Pagination } from "../Pagination";
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  showItemsPerPage?: boolean;
  showPageInput?: boolean;
  showPageInfo?: boolean;
}
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  filterColumn?: string;
  filterPlaceholder?: string;
  pagination: PaginationProps;
  DraggableRow?: React.ComponentType<{
    id: string;
    company: TData;
    children: React.ReactNode;
  }>;
  // Add the getRowClassName prop here
  getRowClassName?: (row: TData) => string;
  initialSorting?: SortingState;
}

export function DataTable<TData extends { _id: string }, TValue>({
  columns,
  data,
  filterColumn,
  filterPlaceholder = "Filter...",
  DraggableRow,
  reorderMode,
  pagination,
  getRowClassName, // Destructure the new prop
  initialSorting = [],
}: DataTableProps<TData, TValue> & { reorderMode?: boolean }) {
  const [sorting, setSorting] = React.useState<SortingState>(initialSorting);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    manualPagination: true, // Enable manual pagination
    pageCount: pagination.totalPages, // Total number of pages from server
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      pagination: {
        pageIndex: pagination.currentPage - 1, // Convert to 0-based index
        pageSize: pagination.itemsPerPage,
      },
    },
  });

  // Use all data if reorderMode, else use paginated data
  const rows = reorderMode
    ? table.getPrePaginationRowModel().rows
    : table.getRowModel().rows;

  return (
    <div className="space-y-4">
      {filterColumn && (
        <div className="flex items-center ">
          <Input
            placeholder={filterPlaceholder}
            value={
              (table.getColumn(filterColumn)?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn(filterColumn)?.setFilterValue(event.target.value)
            }
            className="max-w-sm bg-white"
          />
        </div>
      )}
      <div className="rounded-[2px] border bg-white overflow-hidden ">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {DraggableRow && (
                  <TableHead className="w-10  bg-zinc-50"></TableHead>
                )}
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="bg-zinc-50 p-2 px-4">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="px-10">
            {rows.length ? (
              rows.map((row) => {
                const rowData = row.original;
                const rowClass = getRowClassName
                  ? getRowClassName(rowData)
                  : "";

                if (DraggableRow) {
                  return (
                    <DraggableRow
                      key={row.id}
                      id={row.original._id}
                      company={row.original}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="py-3 ">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </DraggableRow>
                  );
                }

                return (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className={`hover:bg-zinc-50  ${rowClass}`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-3 px-4">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (DraggableRow ? 1 : 0)}
                  className="h-24 text-center text-zinc-500"
                >
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between ">
        <div className="text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="flex items-center ">
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalItems={pagination.totalItems}
            itemsPerPage={pagination.itemsPerPage}
            onPageChange={pagination.onPageChange}
            onItemsPerPageChange={pagination.onItemsPerPageChange}
          />
        </div>
      </div>
    </div>
  );
}
