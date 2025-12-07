"use client";

import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash2, Eye } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTable } from "@/components/ui/data-table";
import { UserSheet } from "./Iteam-Sheet";
import { useDeleteUser, type User } from "@/hooks/useAdmin";
import { TableShimmer } from "@/components/table-shimmer";
import { UserViewModal } from "./UserViewModal";
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
import { toast } from "sonner";
import { Icon } from "@iconify/react/dist/iconify.js";

interface TableProps {
  users: User[];
  isLoading: boolean;
}

export function UserTable({ users, isLoading }: TableProps) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [dataToDelete, setDataToDelete] = useState<User | null>(null);
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const { mutateAsync: deleteUser, isPending } = useDeleteUser();
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
    total: 0,
  });
  const handleDeleteUser = async (id: string) => {
    await deleteUser(id, {
      onSuccess: () => {
        toast("User deleted successfully");
        setDeleteDialogOpen(false);
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || "Failed to delete user");
      },
    });
  };

  const columns: ColumnDef<User>[] = [
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
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => <div>{row.original.email}</div>,
    },
    {
      accessorKey: "firstName",
      header: "First Name",
      cell: ({ row }) => <div>{row.original.firstName}</div>,
    },
    {
      accessorKey: "lastName",
      header: "Last Name",
      cell: ({ row }) => <div>{row.original.lastName}</div>,
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => <div className="capitalize">{row.original.role}</div>,
    },
    {
      accessorKey: "permissions",
      header: "Permissions",
      cell: ({ row }) => (
        <div className="capitalize">
          {row.original.permissions && row.original.permissions.length > 0
            ? row.original.permissions.join(", ")
            : "-"}
        </div>
      ),
    },
    {
      id: "actions",
      header: () => <div className="text-center">Actions</div>,
      cell: ({ row }) => (
        <div className="flex justify-center items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setViewingUser(row.original)}
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
            onClick={() => {
              setSelectedUser(row.original);
              setEditDialogOpen(true);
            }}
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
              setDataToDelete(row.original);
              setDeleteDialogOpen(true);
            }}
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
        data={users}
        filterColumn="email"
        filterPlaceholder="Filter users..."
        pagination={{
          totalItems: pagination.total,
          itemsPerPage: pagination.limit,
          totalPages: pagination.totalPages,
          currentPage: pagination.page,
          onPageChange: (page) => {
            setPagination({ ...pagination, page });
          },
        }}
      />
      {selectedUser && (
        <UserSheet
          open={editDialogOpen}
          onOpenChange={(open) => {
            setEditDialogOpen(open);
            if (!open) setSelectedUser(null);
          }}
          user={selectedUser}
          onSuccess={() => {
            setEditDialogOpen(false);
            setSelectedUser(null);
          }}
        />
      )}
      <UserViewModal
        isOpen={!!viewingUser}
        onClose={() => setViewingUser(null)}
        userData={viewingUser}
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
              onClick={() =>
                dataToDelete && handleDeleteUser(dataToDelete?._id)
              }
            >
              {"Confirm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
