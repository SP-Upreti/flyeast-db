import { Suspense, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

import { TableShimmer } from "@/components/table-shimmer";
import { useGetCertificates } from "@/hooks/useCertificate";
import type { certificate } from "@/types/certificate";
import { CertificateForm } from "@/components/certificate/Item-Sheet";
import { CertificateTable } from "@/components/certificate/Item-Table";
import { Icon } from "@iconify/react/dist/iconify.js";

export default function CertificatePage() {
  const { data: certificates, isLoading, refetch } = useGetCertificates();
  const [isAdding, setIsAdding] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<certificate | null>(null);

  return (
    <div className="container mx-auto py-2">

      {isAdding ? (
        <div>
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-xl text-red-500 font-bold">
              Add Certificate
            </h1>
            <Button
              onClick={() => setIsAdding(false)}
              variant="outline"
              className="text-red-500 flex items-center gap-2 cursor-pointer"
            >
              <Icon icon="solar:exit-bold-duotone" width="24" height="24" />
              Exit
            </Button>
          </div>
          <CertificateForm
            onSuccess={() => {
              refetch();
              setIsAdding(false);
            }}
            onCancel={() => setIsAdding(false)}
          />
        </div>
      ) : itemToEdit ? (
        <div>
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">Edit Certificate</h1>
          </div>
          <CertificateForm
            certificate={itemToEdit}
            onSuccess={() => {
              refetch();
              setItemToEdit(null);
            }}
            onCancel={() => setItemToEdit(null)}
          />
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-xl font-bold text-red-500">Certificate</h1>
            <Button onClick={() => setIsAdding(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Certificate
            </Button>
          </div>


          <Suspense fallback={<TableShimmer />}>
            <CertificateTable
                  certificates={certificates?.data || []}
              isLoading={isLoading}
              onEdit={setItemToEdit}
            />
          </Suspense>
        </>
      )}
    </div>
  );
}
