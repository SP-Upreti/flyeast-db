import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  useCreateInclusion,
  useGetInclusion,
  useUpdateInclusion,
} from "@/hooks/useInclusion";
import { Loader } from "lucide-react";
import RichTextEditor from "../RichTextEditor";

interface InclusionData {
  description: string;
}

export default function CreateInclusionSheet({
  id,
  editId,
  onClose,
}: {
  id: string;
  editId?: string | null;
  onClose?: () => void;
}) {
  const [formData, setFormData] = useState<InclusionData>({
    description: "",
  });

  const { data: existingInclusion } = useGetInclusion(editId || "");

  useEffect(() => {
    if (editId && existingInclusion) {
      setFormData({
        description: existingInclusion.description || "",
      });
    }
  }, [editId, existingInclusion]);
  const [errors, setErrors] = useState<Partial<InclusionData>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutateAsync: createInclusion, isPending: isCreating } =
    useCreateInclusion();
  const { mutateAsync: updateInclusion, isPending: isUpdating } =
    useUpdateInclusion(editId || "");

  const validateForm = () => {
    const newErrors: Partial<InclusionData> = {};

    if (!formData.description.trim())
      newErrors.description = "Description is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isLoading = isCreating || isUpdating;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("description", formData.description);
   

      if (editId) {
        // Update existing inclusion
        await updateInclusion(formDataToSend);
        toast.success("Inclusion updated successfully");
      } else {
        // Create new inclusion
        await createInclusion({
          packageId: id,
          formData: formDataToSend,
        });
        toast.success("Inclusion created successfully");
      }

      // Reset form
      if (!editId) {
        setFormData({
          description: "",
        });
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }

      onClose?.();
    } catch (error: any) {
      console.error(
        `Error ${editId ? "updating" : "creating"} inclusion:`,
        error
      );
      toast.error(
        error.message || `Failed to ${editId ? "update" : "create"} inclusion`
      );
    }
  };

  return (
    <div className="w-full p-4 rounded-sm">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold">
          {editId ? "Update Inclusion" : "Create Inclusion"}
        </h1>
        <p className="text-sm text-gray-600">
          {editId
            ? "Modify this inclusion"
            : "Add a new inclusion for this package"}
        </p>
      </header>

      <form className="grid gap-6" onSubmit={handleSubmit}>
        


        {/* Description */}
        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-medium">
            Description
          </label>
          <RichTextEditor
            initialContent={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e })}
            className="min-h-[80px] w-full rounded-[2px] border border-gray-300 px-3 py-2 text-sm shadow-sm resize-y focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="Enter description"
            aria-invalid={!!errors.description}
            aria-describedby="description-error"
          />
          {errors.description && (
            <p id="description-error" className="text-sm text-red-500">
              {errors.description}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end items-center">
          <Button
            variant={"outline"}
            type="button"
            disabled={isUpdating}
            className="mr-2 border"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button type="submit" className="w-fit " disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                {editId ? "Updating..." : "Creating..."}
              </>
            ) : editId ? (
              "Update Inclusion"
            ) : (
              "Create Inclusion"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
