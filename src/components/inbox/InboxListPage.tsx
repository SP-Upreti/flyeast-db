"use client";

import { useState } from "react";

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

import { ChevronLeft, ChevronRight, Trash2, Eye } from "lucide-react";

import { Button } from "@/components/ui/button";

import { Checkbox } from "@/components/ui/checkbox";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  TableHead,
} from "@/components/ui/table";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { Badge } from "@/components/ui/badge";

import Breadcumb from "@/components/dashboard/Breadcumb";

import { useParams } from "react-router-dom";

import { EditInboxSheet } from "./EditInboxSheet"; // This component will be rendered conditionally

import { ContactDetailsView } from "./ContactDetailsView"; // New read-only view component

import type { Contact } from "@/types/contact";

import { useDeleteContact, useGetContacts } from "@/hooks/useContact";

import { TableShimmer } from "@/components/table-shimmer";

import { useMarkSeen } from "@/hooks/useUnseenCount";

import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip"; // Import Tooltip components
import { Icon } from "@iconify/react/dist/iconify.js";

export default function InboxListPage() {
  const params = useParams();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const [deletingId, setDeletingId] = useState<string>("");
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null); // State for selected contact
  const [viewMode, setViewMode] = useState<"table" | "details">("table"); // State for view mode

  const { data: contactData, isLoading } = useGetContacts();
  const { mutateAsync: deleteContact, isPending: isDeleting } =
    useDeleteContact();
  const { mutateAsync: markSeenContact } = useMarkSeen("inbox");

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await deleteContact(id);
    } catch (error: any) {
      console.error(error.message);
    }
  };

  const getRowClassName = (contact: Contact) => {
    return !contact.seen
      ? "bg-gray-100 hover:bg-gray-100 hover:shadow-sm text-zinc-800 border-l-4 border-l-red-500 font-bold"
      : "hover:bg-gray-50";
  };

  const columns: ColumnDef<Contact>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
    },
    {
      header: "S.N.",
      cell: ({ row }) => <div>{Number.parseInt(row.id) + 1}</div>,
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        const contact = row.original;
        return (
          <div className="flex items-center gap-2">
            <span>{contact.name}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => {
        const contact = row.original;
        return <span>{contact.email}</span>;
      },
    },
    // {
    //   accessorKey: "company",
    //   header: "Company",
    //   cell: ({ row }) => {
    //     const contact = row.original;
    //     return <span>{contact.company || "N/A"}</span>;
    //   }
    // },
    // {
    //   accessorKey: "message",
    //   header: "Message",
    //   cell: ({ row }) => {
    //     const contact = row.original;
    //     return <span>{contact.message || "N/A"}</span>;
    //   }
    // },
    {
      accessorKey: "goal",
      header: "Goal",
      cell: ({ row }) => {
        const contact = row.original;
        return <span className="truncate">{contact.goal || "N/A"}</span>;
      }
    },

    {
      accessorKey: "createdAt",
      header: "Received Date",
      cell: ({ row }) => {
        const date = new Date(row.getValue("createdAt"));
        return <span>{date.toLocaleDateString()}</span>;
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const contact = row.original;
        return (
          <div className="flex items-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-gray-100"
                    onClick={async () => {
                      setSelectedContact(contact); // Set the selected contact
                      setViewMode("details"); // Change to details mode (read-only)
                      await markSeenContact(contact._id); // Mark as seen when opening details
                    }}
                  >
                    <Icon
                      icon="mynaui:eye"
                      width="16"
                      height="16"
                      className="text-zinc-400 hover:text-red-500"
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View details</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-red-50"
                    onClick={() => {
                      setDeletingId(contact._id); // Set the ID for deletion confirmation
                      // No need for a separate state for bookingToDelete, use deletingId
                      // setBookingToDelete(contact) // This was from ItemTable, not needed here
                    }}
                  >
                    <Icon
                      icon="ic:baseline-delete"
                      width="16"
                      height="16"
                      className="text-zinc-400 hover:text-red-500"
                    />                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Delete contact</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: contactData || [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const links = [
    {
      to: "/dashboard/admin/contacts",
      label: "Contacts",
      isActive: true,
    },
  ];

  if (isLoading) {
    return <TableShimmer />;
  }

  return (
    <>
      {viewMode === "table" ? (
        <div className="w-full flex flex-col text-3xl">
          <Breadcumb links={links} />
          <div className="rounded-[2px] border">
            <Table>
              <TableHeader className="">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow className="" key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
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
              <TableBody>
                {table.getRowModel().rows.length ? (
                  table.getRowModel().rows.map((row) => {
                    const contact = row.original;
                    return (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                        className={getRowClassName(contact)}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
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
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No contacts found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-end space-x-2 py-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Delete Confirmation Dialog */}
          <AlertDialog
            open={!!deletingId}
            onOpenChange={(open) => !open && setDeletingId("")}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. It will permanently delete the selected item.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="cursor-pointer hover:bg-red-100">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  disabled={isDeleting}
                  onClick={() => handleDelete(deletingId)}
                  className="text-red-100 hover:bg-red-500 cursor-pointer bg-red-500"
                >
                  {isDeleting ? "Confirming..." : "Confirm"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ) : (
        selectedContact && (
          <ContactDetailsView
            contactId={selectedContact._id}
            onBack={() => {
              setSelectedContact(null); // Clear selected contact
              setViewMode("table"); // Go back to table mode
            }}
          />
        )
      )}
    </>
  );
}
