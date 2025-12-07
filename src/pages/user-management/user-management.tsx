import { Suspense, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

import { TableShimmer } from "@/components/table-shimmer";
import { UserTable } from "@/components/user-management/Item-Table";
import { UserSheet } from "@/components/user-management/Iteam-Sheet";
import { useGetAllUsers } from "@/hooks/useAdmin";

export default function UserManagementPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { data: users, isLoading } = useGetAllUsers();

  return (
    <div className="container mx-auto py-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>

        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      <UserSheet
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={() => {
          setDialogOpen(false);
        }}
      />
      <Suspense fallback={<TableShimmer />}>
        <UserTable users={users || []} isLoading={false} />
      </Suspense>
    </div>
  );
}
