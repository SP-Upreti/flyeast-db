import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash2, Loader } from "lucide-react";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTable } from "@/components/ui/data-table";
import { toast } from "sonner";
import { TableShimmer } from "../table-shimmer";
import type { Blog } from "@/types/blog";
import { useDeleteBlog } from "@/hooks/useBlogs";
import { BlogViewModal } from "./BlogViewModal";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Icon } from "@iconify/react/dist/iconify.js";

interface BlogTableProps {
  blogs: Blog[];
  isLoading: boolean;
  onEdit: (blog: Blog) => void;
  pagination: {
    total: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    nextPage?: number;
    previousPage?: number;
  };
  onPageChange: (page: number) => void;
}

export function BlogTable({
  blogs,
  isLoading,
  onEdit,
  pagination,
  onPageChange,
}: BlogTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<Blog | null>(null);
  const { mutate: deleteBlog, isPending } = useDeleteBlog();

  const handleDelete = async (blogId: string) => {
    await deleteBlog(blogId, {
      onSuccess: () => {
        toast("Blog deleted successfully");
        setDeleteDialogOpen(false);
      },
      onError: () => {
        toast("Failed to delete blog");
      },
    });
  };

  const columns: ColumnDef<Blog>[] = [
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
      accessorKey: "sn",
      header: ({ column }) => <div className="text-start">S.N.</div>,
      cell: ({ row }) => <div>{row.getValue("sn")}</div>,
    },
    {
      accessorKey: "banner",
      header: "Banner",
      cell: ({ row }) => (
        <img
          src={row.original.banner || "/placeholder.svg"}
          alt={row.original.title}
          width={40}
          height={40}
          className="h-10 w-10 object-cover rounded"
        />
      ),
    },
    {
      accessorKey: "title",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="font-medium line-clamp-1">{row.getValue("title")}</div>
      ),
    },

    {
      id: "actions",
      header: "Actions",
      enableHiding: false,
      cell: ({ row }) => (
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(row.original)}
            className="cursor-pointer hover:bg-transparent"
          >
            <Icon
              icon="mynaui:edit-one"
              width="16"
              height="16"
              className="text-zinc-400 hover:text-red-500"
            />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                disabled={isPending}
                className="cursor-pointer hover:bg-transparent"
              >
                {isPending ? (
                  <Loader className="h-5 w-5 animate-spin" />
                ) : (
                  <Icon
                    icon="ic:baseline-delete"
                    width="16"
                    height="16"
                    className="text-zinc-400 hover:text-red-500"
                  />
                )}
              </Button>
            </AlertDialogTrigger>
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
                  className="bg-red-500 hover:bg-red-600"
                  onClick={() => handleDelete(row.original._id)}
                >
                  Confirm
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
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
        data={blogs}
        filterColumn="title"
        filterPlaceholder="Filter blogs..."
        pagination={{
          totalItems: pagination.total,
          currentPage: pagination.currentPage,
          itemsPerPage: pagination.itemsPerPage,
          onPageChange: onPageChange,
          totalPages: pagination.totalPages,
        }}
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
              onClick={() => blogToDelete && handleDelete(blogToDelete._id)}
            >
              {"Confirm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
