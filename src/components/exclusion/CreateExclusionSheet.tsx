import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader, Upload } from "lucide-react";
import { toast } from "sonner";
import {
  useCreateExclusion,
  useGetExclusion,
  useUpdateExclusion,
} from "@/hooks/useExclusion";
import RichTextEditor from "../RichTextEditor";

interface ExclusionData {
  description: string;
}

export default function CreateExclusionSheet({
  id,
  editId,
  onClose,
}: {
  id: string;
  editId?: string | null;
  onClose?: () => void;
}) {
  const [formData, setFormData] = useState<ExclusionData>({
    description: "",
  });

  const { data: existingExclusion } = useGetExclusion(editId || "");

  useEffect(() => {
    if (editId && existingExclusion) {
      setFormData({
        description: existingExclusion.description || "",

      });
    }
  }, [editId, existingExclusion]);

  const [errors, setErrors] = useState<Partial<ExclusionData>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutateAsync: createExclusion, isPending: isCreating } =
    useCreateExclusion();
  const { mutateAsync: updateExclusion, isPending: isUpdating } =
    useUpdateExclusion(editId || "");

  const validateForm = () => {
    const newErrors: Partial<ExclusionData> = {};

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
        // Update existing exclusion
        await updateExclusion(formDataToSend);
        toast.success("Exclusion updated successfully");
      } else {
        // Create new exclusion
        await createExclusion({
          packageId: id,
          formData: formDataToSend,
        });
        toast.success("Exclusion created successfully");
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
        `Error ${editId ? "updating" : "creating"} exclusion:`,
        error
      );
      toast.error(
        error.message || `Failed to ${editId ? "update" : "create"} exclusion`
      );
    }
  };

  return (
    <div className="flex justify-center w-full mt-4 min-h-screen">
      <form onSubmit={handleSubmit} className="w-full rounded-sm ">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold mb-4">
            {editId ? "Update Exclusion" : "Create Exclusion"}
          </h1>
        </div>

        <div className="space-y-6">



          {/* Description */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="description"
              className="text-sm font-medium text-gray-700"
            >
              Description
            </label>
            <RichTextEditor
              initialContent={formData.description}
              onChange={(
                content // content is the HTML string directly
              ) => setFormData({ ...formData, description: content })}
              className="rounded-[2px] border border-gray-300  text-sm  placeholder-gray-400 min-h-[80px] resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter description"
            />
            {errors.description && (
              <p className="text-sm text-red-600 mt-1">{errors.description}</p>
            )}
          </div>




          {/* Submit Button */}
          <div className="flex justify-end items-center pt-4 gap-2">
            <Button onClick={onClose} variant={"outline"}>
              Cancel
            </Button>

            <Button type="submit" className="w-fit " disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  {editId ? "Updating..." : "Creating..."}
                </>
              ) : editId ? (
                "Update Exclusion"
              ) : (
                "Create Exclusion"
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
