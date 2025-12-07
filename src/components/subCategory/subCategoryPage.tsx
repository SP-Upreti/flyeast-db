import React, { useState, useEffect } from "react";
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import {
  type ColumnDef,
} from "@tanstack/react-table";
import {
  ArrowRightIcon,
  Loader,
  MoreHorizontal,
  ArrowLeftIcon,
  UploadCloud,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
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
import { Link, useParams } from "react-router-dom";
import { api } from "@/services/api";
import { CaretSortIcon } from "@radix-ui/react-icons";
import {
  useCreateSubCategory,
  useUpdateSubCategory,
  useDeleteSubCategory,
} from "@/hooks/useSubCategory";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import RichTextEditor from "@/components/RichTextEditor";
import slugify from "react-slugify";
import FieldOptionalText from "@/components/dashboard/FieldOptionalText";
import { useGetCategoryById } from "@/hooks/useCategory";
import { SubcategoryViewModal } from "./SubcategoryViewModal";
import { DataTable } from "../ui/data-table";

// Define form schemas
const createFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().regex(/^([a-z0-9-]+)$/i, "Invalid slug format"),
  description: z.string().default(""),
  categoryId: z.string().min(1, "Category ID is required"),
  addToHome: z.boolean().default(false),
  sortOrder: z.coerce.number().default(0),
  image: z.any(),
});

const editFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().regex(/^([a-z0-9-]+)$/i, "Invalid slug format"),
  description: z.string().default(""),
  addToHome: z.boolean().default(false),
  sortOrder: z.coerce.number().default(0),
  image: z.any().optional(),
});

// Shared form component
function SubCategoryForm({
  mode,
  parentCategoryId,
  initialData,
  onClose,
}: {
  mode: "create" | "edit";
  parentCategoryId?: string;
  initialData?: any;
  onClose: () => void;
}) {
  const schema = mode === "create" ? createFormSchema : editFormSchema;
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema) as any,
    defaultValues: initialData || {
      name: "",
      slug: "",
      description: "",
      categoryId: parentCategoryId,
      addToHome: true,
      sortOrder: 0,
      image: null,
    },
  });

  const [value, setValue] = useState(initialData?.description || "");
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    initialData?.image || null
  );
  const [file, setFile] = useState<File | null>(null);

  const { mutate: createSubCategory, isPending: isCreating } =
    useCreateSubCategory();
  const { mutate: updateSubCategory, isPending: isUpdating } =
    useUpdateSubCategory(initialData?._id || "");
  const isSubmitting = isCreating || isUpdating;

  useEffect(() => {
    if (initialData) {
      form.reset({
        ...initialData,
        image: null,
      });
      setValue(initialData.description || "");
      setPreviewUrl(initialData.image || null);
    }
  }, [initialData]);

  // Replace the current slug effect with this:
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "name") {
        const slug = value.name ? slugify(value.name, {}) : "";
        form.setValue("slug", slug, { shouldValidate: true });
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  // Remove the separate description effect since it's already handled in the main form
  useEffect(() => {
    form.setValue("description", value);
  }, [value]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const MAX_SIZE_MB = 2;
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) return;

    if (selectedFile.size > MAX_SIZE_MB * 1024 * 1024) {
      toast.error(`File exceeds ${MAX_SIZE_MB}MB limit.`);
      return;
    }

    setFile(selectedFile);
    form.setValue("image", selectedFile, { shouldValidate: true });

    // Create preview URL
    const fileUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(fileUrl);
  };

  const removeImage = () => {
    setFile(null);
    setPreviewUrl(null);
    form.setValue("image", null, { shouldValidate: true });
    // Reset file input
    const fileInput = document.getElementById(
      "image-upload"
    ) as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  const onSubmit = (values: z.infer<typeof schema>) => {
    const formData = new FormData();

    // Append fields
    Object.entries(values).forEach(([key, value]) => {
      if (key !== "image" && value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });

    // Append image if it's a new file
    if (file) {
      formData.append("image", file);
    } else if (initialData?.image && !previewUrl) {
      // If there was an image but it was removed
      formData.append("removeImage", "true");
    }

    const onSuccess = () => {
      toast.success(
        `Sub Category ${mode === "create" ? "created" : "updated"} successfully`
      );
      onClose();
    };

    const onError = (error: any) => {
      const errorMessage =
        error?.response?.data?.message || "An error occurred";
      toast.error(
        errorMessage.includes("duplicate key")
          ? "Slug must be unique"
          : errorMessage
      );
    };

    if (mode === "create") {
      createSubCategory(formData, { onSuccess, onError });
    } else {
      updateSubCategory(formData, { onSuccess, onError });
    }
  };

  return (
    <div className="mx-auto rounded-sm pb-24 px-4">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="icon" onClick={onClose}>
          <ArrowLeftIcon className="h-4 w-4" />
        </Button>
        <div className="text-2xl font-semibold">
          {mode === "create" ? "Add" : "Edit"} SubCategory
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category Name *</FormLabel>
                <FormControl>
                  <Input placeholder="Above 5K" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-4">
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Slug *</FormLabel>
                  <FormControl>
                    <Input placeholder="above-5k" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sortOrder"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Sort Order</FormLabel>
                  <FormControl>
                    <Input placeholder="0" type="number" min={0} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Description <FieldOptionalText />
                </FormLabel>
                <FormControl>
                  <RichTextEditor
                    initialContent={value}
                    onChange={(content) => setValue(content || "")}
                    placeholder="Write something..."
                    className="h-64 pb-10"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="image"
            render={() => (
              <FormItem>
                <FormLabel>Image {!previewUrl && "*"} <span className="text-[#E83759]">(Aspect Ratio 16/9) 1920 × 1080 px</span></FormLabel>
                <FormControl>
                  <div className="relative w-full border border-dashed rounded-[2px] overflow-hidden p-4">
                    {previewUrl ? (
                      <div className="relative">
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="h-60 w-full object-contain rounded-[2px] bg-muted/30"
                        />
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full p-2 shadow transition-all"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center relative h-60 bg-muted/30 rounded-[2px]">
                        <UploadCloud className="text-primary w-6 h-6 absolute z-0" />
                        <div className="flex flex-col items-center justify-center mt-20">
                          <p>Drag and drop or click to upload</p>
                          <p>Max file size: 2MB</p>
                        </div>
                        <Input
                          id="image-upload"
                          accept="image/*"
                          onChange={handleFileChange}
                          type="file"
                          className="absolute inset-0 opacity-0 h-full w-full cursor-pointer z-10"
                        />
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="addToHome"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Add to home</FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-col sm:flex-row gap-4 justify-end">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button disabled={isSubmitting} type="submit">
              {isSubmitting ? (
                <Loader size={16} className="animate-spin mr-2" />
              ) : mode === "create" ? (
                "Create SubCategory"
              ) : (
                "Update SubCategory"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default function SubCategoryPage() {
  const params = useParams();
  const {
    data: collection,

    error,
  } = useGetCategoryById(params.id || "");
  const [categories, setCategories] = useState<any[]>([]);
  const [deletingId, setDeletingId] = useState<string>();
  const [activeId, setActiveId] = useState<string | null>(null);
  const { mutate: deleteSubCategory, isPending: isDeleting } =
    useDeleteSubCategory();
  const [mode, setMode] = useState<"view" | "create" | "edit">("view");
  const [currentSubcategory, setCurrentSubcategory] = useState<any>(null);
  const [viewingSubcategory, setViewingSubcategory] = useState<any>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return setActiveId(null);

    const oldIndex = categories.findIndex((i) => i.categoryId === active.id);
    const newIndex = categories.findIndex((i) => i.categoryId === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(categories, oldIndex, newIndex);
    setCategories(reordered);

    try {
      await updateCategoryOrder(
        categories[oldIndex].categoryId,
        categories[newIndex].categoryId
      );
      toast.success("Sub Category sortOrder updated successfully");
    } catch (e: any) {
      toast.error(e?.response?.data?.message || "Failed to update order");
      setCategories(categories); // rollback
    }

    setActiveId(null);
  };

  const updateCategoryOrder = async (
    draggedCategoryId: string,
    targetCategoryId: string
  ) => {
    return api.put(`/categories/reorder`, {
      draggedCategoryId,
      targetCategoryId,
      collectionId: collection?._id,
    });
  };

  useEffect(() => {
    if (collection) {
      setCategories(collection?.subCategories || []);
    }
  }, [collection]);

  useEffect(() => {
    if (error) {
      toast.error("Error fetching category");
    }
  }, [error]);

  const deleteCategory = (id: string) => {
    deleteSubCategory(id, {
      onSuccess: () => {
        setCategories((prev) => prev.filter((cat) => cat._id !== id));
        setDeletingId(undefined);
      },
      onError: () => {
        setDeletingId(undefined);
      },
    });
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
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "sortOrder",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          S.N. <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-black">{row.getValue("sortOrder")}</div>
      ),
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("name")}</div>,
    },
    {
      accessorKey: "slug",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Slug <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div>{row.getValue("slug")}</div>,
    },
    {
      id: "contents",
      header: "View Contents",
      enableHiding: false,
      cell: ({ row }) => (
        <Link
          to={`/dashboard/category/${params.id}/subcategory/${row.original._id}`}
        >
          <Button variant="outline" className="rounded-sm cursor-pointer h-6 text-xs">
            View Contents <ArrowRightIcon size={16} className="ml-1" />
          </Button>
        </Link>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      enableHiding: false,
      cell: ({ row }) => {
        const item = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                {deletingId === item.categoryId && isDeleting ? (
                  <Loader className="h-4 w-4 animate-spin" />
                ) : (
                  <MoreHorizontal className="h-4 w-4" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <span
                className="flex cursor-default select-none items-center px-2 py-1.5 text-sm hover:bg-accent"
                onClick={() => {
                  setViewingSubcategory(item);
                }}
              >
                <span>View</span>
              </span>
              <span
                className="flex cursor-default select-none items-center px-2 py-1.5 text-sm hover:bg-accent"
                onClick={() => {
                  setCurrentSubcategory(item);
                  setMode("edit");
                }}
              >
                Edit
              </span>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <span className="flex cursor-default select-none items-center px-2 py-1.5 text-sm text-red-500/90 hover:bg-accent">
                    Delete Category
                  </span>
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
                      className="bg-red-500/90 hover:bg-red-500"
                      onClick={() => deleteCategory(item._id)}
                    >
                      Confirm
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const getBreadcrumbLinks = () => {
    const baseLinks = [
      {
        label: "Packages",
      },
      {
        label: collection?.name || "Sub Category",
        isActive: mode === "view",
      },
    ];

    if (mode === "create") {
      return [
        ...baseLinks,
        {
          label: "Create",
          isActive: true,
        },
      ];
    }

    if (mode === "edit") {
      return [
        ...baseLinks,
        {
          label: "Edit",
          isActive: true,
        },
      ];
    }

    return baseLinks;
  };

  if (mode === "edit" && currentSubcategory) {
    return (
      <div>
        <Breadcumb links={getBreadcrumbLinks()} />
        <SubCategoryForm
          mode="edit"
          initialData={currentSubcategory}
          onClose={() => setMode("view")}
        />
      </div>
    );
  }

  if (mode === "create" && collection) {
    return (
      <div>
        <Breadcumb links={getBreadcrumbLinks()} />
        <SubCategoryForm
          mode="create"
          parentCategoryId={collection._id}
          onClose={() => setMode("view")}
        />
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="w-full flex flex-col justify-between">
        <div className="flex justify-between items-center">
          <Breadcumb links={getBreadcrumbLinks()} />
          <Button onClick={() => setMode("create")}>Create SubCategory</Button>
        </div>

        <DataTable
          columns={columns}
          filterColumn="name"
          filterPlaceholder="Search subcategories..."
          data={categories}
          initialSorting={[{ id: "sortOrder", desc: false }]}
          pagination={{
            itemsPerPage: 10,
            currentPage: 1,
            totalItems: categories.length,
            totalPages: Math.ceil(categories.length / 10),
            onPageChange: (page) => {
              // Handle page change
              console.log("Page changed to:", page);
            },
            onItemsPerPageChange: (itemsPerPage) => {
              // Handle items per page change
              console.log("Items per page changed to:", itemsPerPage);
            },
            showItemsPerPage: true,
            showPageInput: true,
            showPageInfo: true,
          }}
        />
      </div>

      <SubcategoryViewModal
        isOpen={!!viewingSubcategory}
        onClose={() => setViewingSubcategory(null)}
        subcategory={viewingSubcategory}
      />
    </DndContext>
  );
}
