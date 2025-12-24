import { useState, useEffect } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { FilePenLine, Loader, MoreHorizontal, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { useParams, useSearchParams } from "react-router-dom";
import CreateShortItineraryPage from "./CreateShortItinerarySheet";
import EditShortItineraryPage from "./EditShortItinerarySheet";
import { TableShimmer } from "@/components/table-shimmer";
import { ShortItineraryViewModal } from "./ShortItineraryViewModal";
import { api } from "@/services/api";
import { DataTable } from "../ui/data-table";

interface ShortItinerary {
    _id: string;
    title: string;
    days: string;
    package: string;
    sortOrder: number;
    createdAt: string;
    updatedAt: string;
}

export default function ShortItineraryListPage() {
    const [showCreatePage, setShowCreatePage] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const params = useParams();
    const [searchParams] = useSearchParams();
    const [data, setData] = useState<ShortItinerary[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string>("");
    const [viewingItinerary, setViewingItinerary] = useState<ShortItinerary | null>(null);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
    });

    const category = searchParams.get("category");
    const subCategory = searchParams.get("subcategory");
    const packagename = searchParams.get("package");

    const links = [
        { label: "package" },
        { label: category || "Category" },
        { label: subCategory || "Subcategory" },
        { label: packagename || "Package" },
        { label: "Short Day Itinerary", isActive: true },
    ];

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const response = await api.get(`/short-itinerary/package/${params.id}`);
            setData(response.data.data || []);
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to fetch data");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (params.id) {
            fetchData();
        }
    }, [params.id]);

    const handleDelete = async (id: string) => {
        try {
            setDeletingId(id);
            await api.delete(`/short-itinerary/${id}`);
            toast.success("Item deleted successfully");
            fetchData();
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to delete");
        } finally {
            setDeletingId("");
        }
    };

    const columns: ColumnDef<ShortItinerary>[] = [
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
                                {deletingId === item._id ? (
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
                                View
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full justify-start gap-2"
                                onClick={() => setEditingId(item._id)}
                            >
                                <FilePenLine className="h-4 w-4" />
                                Edit
                            </Button>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <span className="flex cursor-pointer items-center text-sm text-red-500 gap-2 p-2 hover:bg-red-100 rounded">
                                        <Trash2 className="w-4 h-4" />
                                        Delete
                                    </span>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone.
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

    if (isLoading) {
        return <TableShimmer />;
    }

    if (showCreatePage) {
        return (
            <CreateShortItineraryPage
                id={params.id || ""}
                onClose={() => {
                    setShowCreatePage(false);
                    fetchData();
                }}
            />
        );
    }

    if (editingId) {
        return (
            <EditShortItineraryPage
                id={editingId}
                onClose={() => {
                    setEditingId(null);
                    fetchData();
                }}
            />
        );
    }

    return (
        <div className="w-full flex flex-col">
            <Breadcumb links={links} />
            <div className="flex items-center justify-between py-4">
                <h2 className="text-2xl font-bold">Short Day Itinerary</h2>
                <Button onClick={() => setShowCreatePage(true)}>
                    <FilePenLine className="mr-2 h-4 w-4" />
                    Add Short Itinerary
                </Button>
            </div>

            <DataTable
                data={data}
                columns={columns}
                filterColumn="title"
                filterPlaceholder="Filter by title..."
                pagination={{
                    itemsPerPage: pagination.limit,
                    currentPage: pagination.page,
                    totalItems: data.length,
                    totalPages: Math.ceil(data.length / pagination.limit),
                    onPageChange: (page) => {
                        setPagination((prev) => ({
                            ...prev,
                            page: page,
                        }));
                    },
                    onItemsPerPageChange: (itemsPerPage) => {
                        setPagination({
                            page: 1,
                            limit: itemsPerPage,
                        });
                    },
                    showItemsPerPage: true,
                    showPageInput: true,
                    showPageInfo: true,
                }}
            />

            <ShortItineraryViewModal
                isOpen={!!viewingItinerary}
                onClose={() => setViewingItinerary(null)}
                itineraryData={viewingItinerary}
            />
        </div>
    );
}
