import { Suspense, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

import { TableShimmer } from "@/components/table-shimmer";
import { ItemTable } from "@/components/usefulInfo/Item-Table";
import { ItemForm } from "./item-form";
import { useGetUsefulInfos, type UsefulInfoApiResponse } from "@/hooks/usefulInfo";
import type { usefulInfo } from "@/types/usefulinfo";

export default function InfoPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const { data: response, isLoading, refetch } = useGetUsefulInfos(page, limit) as {
    data: UsefulInfoApiResponse | undefined;
    isLoading: boolean;
    refetch: () => Promise<any>;
  };
  const [isAdding, setIsAdding] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<usefulInfo | null>(null);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div className="container mx-auto py-2">
      {isAdding ? (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold tracking-tight">
              Add Useful Info
            </h1>
            <Button onClick={() => setIsAdding(false)} variant="outline">
              Back to List
            </Button>
          </div>
          <ItemForm
            onSuccess={() => {
              refetch();
              setIsAdding(false);
            }}
            onCancel={() => setIsAdding(false)}
          />
        </div>
      ) : itemToEdit ? (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold tracking-tight">
              Edit Useful Info
            </h1>
            <Button onClick={() => setItemToEdit(null)} variant="outline">
              Back to List
            </Button>
          </div>
          <ItemForm
            item={itemToEdit}
            onSuccess={() => {
              refetch();
              setItemToEdit(null);
            }}
            onCancel={() => setItemToEdit(null)}
          />
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold tracking-tight">Useful Info</h1>
            <Button onClick={() => setIsAdding(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Useful Info
            </Button>
          </div>

          {/* <pre>{JSON.stringify(response, null, 2)}</pre> */}

          <Suspense fallback={<TableShimmer />}>
            <ItemTable
              pkgs={response?.data?.data as any || []}
              isLoading={isLoading}
              onEdit={setItemToEdit}
              pagination={{
                currentPage: page,
                itemsPerPage: limit,
                totalItems: response?.pagination?.total || 0,
                totalPages: response?.pagination?.totalPages || 1,
                onPageChange: handlePageChange,
              }}
            />
          </Suspense>
        </>
      )}
    </div>
  );
}
