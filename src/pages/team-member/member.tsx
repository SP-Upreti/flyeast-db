import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useGetTeamMembers } from "@/hooks/useTeam";
import { MemberTable } from "@/components/member/Item-Table";
import type { Member } from "@/types/team-member";
import { MemberForm } from "@/components/member/memberform";
import { Icon } from "@iconify/react/dist/iconify.js";

export default function MembersPage() {
  const {
    data: members,
    isLoading,
    refetch: fetchMembers,
  } = useGetTeamMembers();

  const [isAdding, setIsAdding] = useState(false);

  const [memberToEdit, setMemberToEdit] = useState<Member | null>(null);

  return (
    <div className="container mx-auto ">
      {isAdding ? (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl text-red-500 font-bold">
              Add Team Member
            </h1>
          </div>
          <MemberForm
            onSuccess={() => {
              fetchMembers();
              setIsAdding(false);
            }}
            onCancel={() => setIsAdding(false)}
          />
        </div>
      ) : memberToEdit ? (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Edit Team Member</h1>
            <Button
              onClick={() => setMemberToEdit(null)}
              variant="outline"
              className="text-red-500 flex items-center gap-2 cursor-pointer"
            >
              <Icon icon="solar:exit-bold-duotone" width="24" height="24" />
              Exit
            </Button>
          </div>
          <MemberForm
            member={memberToEdit}
            onSuccess={() => {
              fetchMembers();
              setMemberToEdit(null);
            }}
            onCancel={() => setMemberToEdit(null)}
          />
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-4 ">
            <div className="flex items-center gap-1">
              <img src="/icons/group.png" alt="Real-Himalaya" className="h-5" />
              <span className="text-xl text-red-500 font-bold">
                Team Members
              </span>
            </div>
            <Button variant={"default"} onClick={() => setIsAdding(true)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M18 12.998h-5v5a1 1 0 0 1-2 0v-5H6a1 1 0 0 1 0-2h5v-5a1 1 0 0 1 2 0v5h5a1 1 0 0 1 0 2"
                />
              </svg>
              Add Member
            </Button>
          </div>
          <MemberTable
            members={members || []}
            isLoading={isLoading}
            onEdit={setMemberToEdit}
          />
        </>
      )}
    </div>
  );
}
