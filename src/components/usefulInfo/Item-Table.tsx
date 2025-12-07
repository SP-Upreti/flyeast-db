import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash2, Eye } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTable } from "@/components/ui/data-table";
import { DataTableColumnHeader } from "../data-table-column-header";
import { toast } from "sonner";
import { TableShimmer } from "../table-shimmer";
import type { usefulInfo } from "@/types/usefulinfo";
import { useDeleteUsefulInfo } from "@/hooks/usefulInfo";
import { UsefulInfoViewModal } from "./UsefulInfoViewModal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { Icon } from "@iconify/react/dist/iconify.js";

interface PaginationProps {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

interface TableProps {
  pkgs: usefulInfo[];
  isLoading: boolean;
  onEdit: (item: usefulInfo) => void;
  pagination: PaginationProps;
}

export function ItemTable({ pkgs, isLoading, onEdit, pagination }: TableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<usefulInfo | null>(null);
  const [viewingInfo, setViewingInfo] = useState<usefulInfo | null>(null);
  const { mutate: deleteInfo, isPending } = useDeleteUsefulInfo();

  const handleDelete = async (Id: string) => {
    await deleteInfo(Id, {
      onSuccess: () => {
        toast("Info deleted successfully");
        setDeleteDialogOpen(false);
      },
      onError: () => {
        toast("Failed to delete info");
      },
    });
  };

  const columns: ColumnDef<usefulInfo>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
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
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "sno",
      header: ({ column }) => <div className="w-20 ">S.N.</div>,
      cell: ({ row, table }) => {
        const currentPage = table.getState().pagination?.pageIndex || 0;
        const pageSize = table.getState().pagination?.pageSize || 10;
        return (
          <div className="font-medium  ">
            {currentPage * pageSize + row.index + 1}
          </div>
        );
      },
    },

    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Title" />
      ),
      cell: ({ row }) => (
        <div className="font-medium line-clamp-1 w-64">{row.original.name}</div>
      ),
    },
    // {
    //   accessorKey: "description",
    //   header: ({ column }) => (
    //     <DataTableColumnHeader column={column} title="Description" />
    //   ),
    //   cell: ({ row }) => {
    //     // Strip HTML tags for table display
    //     const plainText = row.original.description.replace(/<[^>]+>/g, "");
    //     return <div className="line-clamp-1">{plainText}</div>;
    //   },
    // },

    {
      id: "actions",
      header: () => <div className="text-center">Actions</div>,
      cell: ({ row }) => (
        <div className="w-32 mx-auto flex items-center justify-center ">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setViewingInfo(row.original)}
            className="hover:bg-transparent cursor-pointer"
          >
            <Icon
              icon="mynaui:eye"
              width="16"
              height="16"
              className="text-zinc-400 hover:text-red-500"
            />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(row.original)} // Use the onEdit prop
            className="cursor-pointer"
          >
            <Icon
              icon="mynaui:edit-one"
              width="16"
              height="16"
              className="text-zinc-400 hover:text-red-500"
            />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setItemToDelete(row.original);
              setDeleteDialogOpen(true);
            }}
            className="cursor-pointer"
          >
            <Icon
              icon="ic:baseline-delete"
              width="16"
              height="16"
              className="text-zinc-400 hover:text-red-500"
            />
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return <TableShimmer />;
  }

  return (
    <>
      <DataTable
        columns={columns}
        data={pkgs}
        filterColumn="name"
        filterPlaceholder="Filter info..."
        pagination={{
          totalItems: pagination.totalItems,
          currentPage: pagination.currentPage,
          itemsPerPage: pagination.itemsPerPage,
          onPageChange: pagination.onPageChange,
          totalPages: pagination.totalPages,
        }}
      />

      <UsefulInfoViewModal
        isOpen={!!viewingInfo}
        onClose={() => setViewingInfo(null)}
        infoData={viewingInfo}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. It will permanently delete the selected item.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={isPending}
              className="bg-red-500 hover:bg-red-600"
              onClick={() => itemToDelete && handleDelete(itemToDelete._id)}
            >
              {"Confirm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
