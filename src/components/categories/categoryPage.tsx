import React, { useState } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { ArrowRightIcon, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import { toast } from "sonner";
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
} from "@/components/ui/alert-dialog";
import Breadcumb from "@/components/dashboard/Breadcumb";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { Link } from "react-router-dom";
import { TableShimmer } from "@/components/table-shimmer";
import { useDeleteCategory, useGetCategory } from "@/hooks/useCategory";
import { CategoryForm } from "../../components/categories/CategoryCreateSheet";
import { Icon } from "@iconify/react/dist/iconify.js";
import { CategoryViewModal } from "@/components/categories/CategoryViewModal";
import { DataTable } from "../ui/data-table";

export default function CategoryPage() {
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });
  const [isAdding, setIsAdding] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<any | null>(null);
  const [viewingCategory, setViewingCategory] = useState<any | null>(null);

  const {
    data: response,
    isLoading,
    refetch,
  } = useGetCategory(pagination.page, pagination.limit);
  const categories = response?.data || [];

  const { mutateAsync: deleteCategory, isPending: isDeletePending } =
    useDeleteCategory();
  44;
  const handleDelete = async (id: string) => {
    try {
      await deleteCategory(id);
      toast.success("Category deleted successfully");
      refetch();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  const columns: ColumnDef<any>[] = [
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
      accessorKey: "sortOrder",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} >
            S.N.
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div className="">{row.getValue("sortOrder")}</div>,
    },
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div>{row.getValue("name")}</div>,
    },
    {
      accessorKey: "slug",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Slug
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div>{row.getValue("slug")}</div>,
    },
    {
      id: "contents",
      header: "View Contents",
      enableHiding: false,
      cell: ({ row }) => {
        const item = row.original;
        return (
          <Link to={`/dashboard/category/${item._id}`}>
            <Button variant={"outline"} className="rounded-sm cursor-pointer h-6 text-xs">
              View Contents <ArrowRightIcon size={16} className="ml-1" />
            </Button>
          </Link>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      enableHiding: false,
      cell: ({ row }) => {
        const item = row.original;

        return (
          <div className="flex -translate-x-5 items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setViewingCategory(item)}
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
              onClick={() => setCategoryToEdit(item)}
              className="hover:bg-transparent cursor-pointer"
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
                  disabled={isDeletePending}
                  className="cursor-pointer hover:bg-transparent"
                >
                  {isDeletePending ? (
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
                    onClick={() => handleDelete(item._id)}
                  >
                    Confirm
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        );
      },
    },
  ];

  const links = [
    { href: "/dashboard/category", label: "Packages", isActive: true },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <TableShimmer />
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col justify-between">
      {isAdding ? (
        <div>
          <div className="flex justify-between items-center mb-4">
            <Breadcumb
              links={[...links, { label: "Add Package", isActive: true }]}
            />
            <Button
              onClick={() => setIsAdding(false)}
              variant="outline"
              className="text-red-500 flex items-center gap-2 cursor-pointer"
            >
              <Icon icon="solar:exit-bold-duotone" width="24" height="24" />
              Exit
            </Button>
          </div>
          <CategoryForm
            onSuccess={() => {
              setIsAdding(false);
            }}
            onCancel={() => setIsAdding(false)}
          />
        </div>
      ) : categoryToEdit ? (
        <div>
          <div className="flex justify-between items-center mb-6">
            <Breadcumb
              links={[
                ...links,
                { label: `Edit ${categoryToEdit.name}`, isActive: true },
              ]}
            />
            <Button
              onClick={() => setIsAdding(false)}
              variant="outline"
              className="text-red-500 flex items-center gap-2 cursor-pointer"
            >
              <Icon icon="solar:exit-bold-duotone" width="24" height="24" />
              Exit
            </Button>
          </div>
          <CategoryForm
            category={categoryToEdit}
            onSuccess={() => {
              setCategoryToEdit(null);
            }}
            onCancel={() => setCategoryToEdit(null)}
          />
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <Breadcumb links={links} />
            <Button onClick={() => setIsAdding(true)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="mr-1"
              >
                <path
                  fill="currentColor"
                  d="M18 12.998h-5v5a1 1 0 0 1-2 0v-5H6a1 1 0 0 1 0-2h5v-5a1 1 0 0 1 2 0v5h5a1 1 0 0 1 0 2"
                />
              </svg>
              Add Package
            </Button>
          </div>

          {/* Table */}
          <DataTable
            columns={columns}
            data={categories}
            filterColumn="name"
            filterPlaceholder="Search categories..."
            initialSorting={[{ id: "sortOrder", desc: false }]}
            pagination={{
              itemsPerPage: pagination.limit,
              currentPage: response?.pagination?.currentPage || 1,
              totalItems: response?.pagination?.total || 0,
              totalPages: response?.pagination?.totalPages || 1,
              onPageChange: (page) => {
                setPagination((prev) => ({ ...prev, page }));
              },
              onItemsPerPageChange: (itemsPerPage) => {
                setPagination({ page: 1, limit: itemsPerPage });
              },
              showItemsPerPage: true,
              showPageInput: true,
              showPageInfo: true,
            }}
          />
        </>
      )}
      <CategoryViewModal
        isOpen={!!viewingCategory}
        onClose={() => setViewingCategory(null)}
        category={viewingCategory}
      />
    </div>
  );
}
