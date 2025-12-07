import { useState, useEffect, useRef, useMemo } from "react";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  type PaginationState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  FilePenLine,
  Loader,
  MoreHorizontal,
  Trash2,
  Eye,
  GripVertical,
} from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import CreateItineraryPage from "./CreateItinerarySheet";
import EditItineraryPage from "./EditItinerarySheet";
import {
  useDeleteItinerary,
  useGetItineraries,
} from "@/hooks/useItenary";
import { TableShimmer } from "@/components/table-shimmer";
import { ItineraryViewModal } from "./ItineraryViewModal";
import { api } from "@/services/api";
import { useQueryClient } from "@tanstack/react-query";

interface Itinerary {
  _id: string;
  title: string;
  description: string;
  image: string;
  days: string;
  duration?: string;
  maxAltitude?: string;
  activity?: string;
  meals?: string;
  accommodation?: string;
  package: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// Sortable Row Component
function SortableRow({ row, children }: { row: any; children: React.ReactNode }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: row.original._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      data-state={row.getIsSelected() && "selected"}
      className={isDragging ? "relative z-50" : ""}
    >
      <TableCell>
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="h-4 w-4 text-gray-400" />
        </div>
      </TableCell>
      {children}
    </TableRow>
  );
}

export default function ItineraryListPage() {
  const [showCreatePage, setShowCreatePage] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [deletingId, setDeletingId] = useState<string>("");
  const [viewingItinerary, setViewingItinerary] = useState<Itinerary | null>(
    null
  );

  // Get initial pagination state from URL or defaults
  const pageIndex = parseInt(searchParams.get("pageIndex") || "0", 10);
  const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);

  // Get selected pages from URL (comma-separated)
  const selectedPagesParam = searchParams.get("selectedPages");
  const [selectedPages, setSelectedPages] = useState<Set<number>>(
    new Set(selectedPagesParam ? selectedPagesParam.split(",").map(Number) : [0])
  );
  const { data: itineraryData, isLoading } = useGetItineraries(
    params.id as string
  );
  const { mutateAsync: deleteItinerary, isPending: isDeleting } =
    useDeleteItinerary();
  const queryClient = useQueryClient();

  // Drag and drop state
  const [items, setItems] = useState<Itinerary[]>([]);
  const sortTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Calculate total pages based on pageSize
  const totalPages = useMemo(() => {
    if (!items.length) return 0;
    return Math.ceil(items.length / pageSize);
  }, [items.length, pageSize]);

  // Get items for selected pages only
  const selectedPagesData = useMemo(() => {
    if (selectedPages.size === 0) return [];

    const data: Itinerary[] = [];
    const sortedPages = Array.from(selectedPages).sort((a, b) => a - b);

    sortedPages.forEach(page => {
      const start = page * pageSize;
      const end = start + pageSize;
      data.push(...items.slice(start, end));
    });

    return data;
  }, [items, selectedPages, pageSize]);

  // Update URL when pagination or selected pages change
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    params.set("pageIndex", pageIndex.toString());
    params.set("pageSize", pageSize.toString());
    params.set("selectedPages", Array.from(selectedPages).sort((a, b) => a - b).join(","));

    // Preserve other search params (category, subcategory, package)
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, "", newUrl);
  }, [pageIndex, pageSize, selectedPages, searchParams]);

  // Initialize items when data loads
  useEffect(() => {
    if (itineraryData) {
      setItems(itineraryData);
    }
  }, [itineraryData]);

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle drag end
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item._id === active.id);
      const newIndex = items.findIndex((item) => item._id === over.id);

      const newItems = arrayMove(items, oldIndex, newIndex);

      // Optimistically update UI
      setItems(newItems);

      // Clear existing timeout
      if (sortTimeoutRef.current) {
        clearTimeout(sortTimeoutRef.current);
      }

      // Set new timeout for API call
      sortTimeoutRef.current = setTimeout(() => {
        handleSortApiCall(newItems);
      }, 500);
    }
  };

  // API call to update sort order
  const handleSortApiCall = async (sortedItems: Itinerary[]) => {
    try {
      const itineraries = sortedItems.map((item, index) => ({
        _id: item._id,
        sortOrder: index + 1,
      }));

      await api.patch(`/itinerary/sort-order/${params.id}`, { itineraries });
      
      // Refetch itinerary data after successful reorder
      await queryClient.invalidateQueries({
        queryKey: ["itineraries", params.id]
      });

      toast.success("Order updated successfully");
    } catch (error:any) {
      console.error("Failed to update sort order:", error);
      toast.error(error?.response?.data?.message || error?.message ||"Failed to update order");

      // Revert to original data on error
      if (itineraryData) {
        setItems(itineraryData);
      }
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (sortTimeoutRef.current) {
        clearTimeout(sortTimeoutRef.current);
      }
    };
  }, []);

  // ============= search params ===============///
  const category = searchParams.get("category");
  const subCategory = searchParams.get("subcategory");
  const packagename = searchParams.get("package");

  const links = [
    { label: "package" },
    { label: category || "Category" },
    { label: subCategory || "Subcategory" },
    { label: packagename || "Package" },

    { label: "Itinerary", isActive: true },
  ];

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);

      await deleteItinerary(id, {
        onSuccess: () => {
          setDeletingId("");

          toast.success("Item deleted successfully");
        },
        onError: (error) => {
          console.error(error.message);
          toast.error("Failed to delete itinerary");
        },
      });
    } catch (error: any) {
      console.error(error.message);
      toast.error("Failed to delete itinerary");
    }
  };

  // Handle page selection toggle
  const togglePageSelection = (pageNum: number) => {
    setSelectedPages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(pageNum)) {
        if (newSet.size > 1) { // Keep at least one page selected
          newSet.delete(pageNum);
        }
      } else {
        newSet.add(pageNum);
      }
      return newSet;
    });
  };

  // Navigation functions for single page view
  const goToNextPage = () => {
    if (pageIndex < totalPages - 1) {
      const params = new URLSearchParams(searchParams);
      params.set("pageIndex", (pageIndex + 1).toString());
      params.set("selectedPages", (pageIndex + 1).toString());
      setSearchParams(params);
      setSelectedPages(new Set([pageIndex + 1]));
    }
  };

  const goToPreviousPage = () => {
    if (pageIndex > 0) {
      const params = new URLSearchParams(searchParams);
      params.set("pageIndex", (pageIndex - 1).toString());
      params.set("selectedPages", (pageIndex - 1).toString());
      setSearchParams(params);
      setSelectedPages(new Set([pageIndex - 1]));
    }
  };

  // Check if showing single page mode
  const isSinglePageMode = selectedPages.size === 1;
  const currentPageInView = isSinglePageMode ? Array.from(selectedPages)[0] : pageIndex;

  const columns: ColumnDef<Itinerary>[] = [
    {
      id: "drag",
      header: "",
      cell: () => null, // Rendered in SortableRow component
    },
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
      cell: ({ row }) => <div>{parseInt(row.id) + 1}</div>,
    },
    {
      accessorKey: "title",
      header: "Title",
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <div
          className="prose prose-sm max-w-sm line-clamp-1"
          dangerouslySetInnerHTML={{ __html: row.original.description || "" }}
        />
      ),
    },
    {
      accessorKey: "days",
      header: "Days",
    },
    {
      accessorKey: "duration",
      header: "Duration",
    },



    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => {
        const date = new Date(row.getValue("createdAt"));
        return <span>{date.toLocaleDateString()}</span>;
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const item = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                {deletingId === item._id && isDeleting ? (
                  <Loader className="h-4 w-4 animate-spin" />
                ) : (
                  <MoreHorizontal className="h-4 w-4" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
                onClick={() => setViewingItinerary(item)}
              >
                <Eye className="h-4 w-4" />
                View Itinerary
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
                onClick={() => setEditingId(item._id)}
              >
                <FilePenLine className="h-4 w-4" />
                Edit Itinerary
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <span className="flex cursor-pointer items-center text-sm text-red-500 gap-2 p-2 hover:bg-red-100 rounded">
                    <Trash2 className="w-4 h-4" />
                    Delete Item
                  </span>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
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
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data: selectedPagesData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    manualPagination: false,
    pageCount: -1,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: {
        pageIndex: 0,
        pageSize: selectedPagesData.length || 10,
      },
    },
  });

  if (isLoading) {
    return <TableShimmer />;
  }

  // Render either the list or the create/edit form
  if (showCreatePage) {
    return (
      <CreateItineraryPage
        id={params.id || ""}
        onClose={() => setShowCreatePage(false)}
      />
    );
  }

  if (editingId) {
    return (
      <EditItineraryPage id={editingId} onClose={() => setEditingId(null)} />
    );
  }

  // Render the list view
  return (
    <div className="w-full flex flex-col">
      <Breadcumb links={links} />
      <div className="flex flex-col sm:flex-row items-center justify-between py-4 gap-4">
        <Input
          placeholder="Filter by title..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(e) =>
            table.getColumn("title")?.setFilterValue(e.target.value)
          }
          className="max-w-sm"
        />
        <Button onClick={() => setShowCreatePage(true)}>
          <FilePenLine className="mr-2 h-4 w-4" />
          Add Itinerary
        </Button>
      </div>

      {/* Page Selection UI */}
      {totalPages > 1 && (
        <div className="mb-4 p-4 border rounded-lg bg-gray-50">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium mr-2">Select Pages to Display:</span>
            {Array.from({ length: totalPages }, (_, i) => i).map((pageNum) => (
              <div key={pageNum} className="flex items-center gap-2">
                <Checkbox
                  id={`page-${pageNum}`}
                  checked={selectedPages.has(pageNum)}
                  onCheckedChange={() => togglePageSelection(pageNum)}
                />
                <label
                  htmlFor={`page-${pageNum}`}
                  className="text-sm cursor-pointer select-none"
                >
                  Page {pageNum + 1}
                </label>
              </div>
            ))}
          </div>
          <div className="mt-2 text-xs text-gray-600">
            Showing data from {selectedPages.size} page(s) ({selectedPagesData.length} items)
          </div>
        </div>
      )}
      <div className="rounded-[2px] border">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableCell key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              <SortableContext
                items={items.map((item) => item._id)}
                strategy={verticalListSortingStrategy}
              >
                {table.getRowModel().rows.length ? (
                  table.getRowModel().rows.map((row) => (
                    <SortableRow key={row.original._id} row={row}>
                      {row.getVisibleCells().map((cell) => {
                        // Skip the drag handle cell as it's rendered in SortableRow
                        if (cell.column.id === "drag") return null;
                        return (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        );
                      })}
                    </SortableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="text-center h-24"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </SortableContext>
            </TableBody>
          </Table>
        </DndContext>
      </div>
      {/* Pagination Info and Controls */}
      <div className="flex items-center justify-between py-4">
        <div className="text-sm text-gray-600">
          Showing {selectedPagesData.length} of {items.length} items
          {selectedPages.size > 1 && ` across ${selectedPages.size} pages`}
        </div>

        <div className="flex items-center gap-4">
          {/* Page Size Selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Items per page:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                const newSize = Number(e.target.value);
                const params = new URLSearchParams(searchParams);
                params.set("pageSize", newSize.toString());
                params.set("pageIndex", "0");
                params.set("selectedPages", "0");
                setSearchParams(params);
                setSelectedPages(new Set([0]));
              }}
              className="border rounded px-2 py-1 text-sm"
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="30">30</option>
              <option value="40">40</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>

          {/* Previous/Next Navigation (shown only in single page mode) */}
          {isSinglePageMode && totalPages > 1 && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={goToPreviousPage}
                disabled={currentPageInView === 0}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <span className="text-sm text-gray-600">
                Page {currentPageInView + 1} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={goToNextPage}
                disabled={currentPageInView === totalPages - 1}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      <ItineraryViewModal
        isOpen={!!viewingItinerary}
        onClose={() => setViewingItinerary(null)}
        itineraryData={viewingItinerary}
      />
    </div>
  );
}
