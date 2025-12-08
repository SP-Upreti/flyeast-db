import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useUpdateExclusion, useGetExclusion } from "@/hooks/useExclusion";
import RichTextEditor from "../RichTextEditor";

interface ExclusionData {
  description: string;
}

interface EditExclusionSheetProps {
  id: string;
  editId: string;
  onClose: () => void;
}

export default function EditExclusionSheet({
  id,
  editId,
  onClose,
}: EditExclusionSheetProps) {
  const [formData, setFormData] = useState<ExclusionData>({
    description: "",
  });

  const [errors, setErrors] = useState<Partial<ExclusionData>>({});

  const { data: existingExclusion, isLoading: isLoadingExclusion } =
    useGetExclusion(editId);
  const { mutateAsync: updateExclusion, isPending: isUpdating } =
    useUpdateExclusion(editId);

  useEffect(() => {
    if (existingExclusion) {
      setFormData({
        description: existingExclusion.description || "",
      });
    }
  }, [existingExclusion]);

  const validateForm = () => {
    const newErrors: Partial<ExclusionData> = {};
    let isValid = true;

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
      isValid = false;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("description", formData.description);

      await updateExclusion(formDataToSend);
      toast.success("Exclusion updated successfully");
      onClose();
    } catch (error) {
      console.error("Error updating exclusion:", error);
      toast.error("Failed to update exclusion");
    }
  };

  return (
    <div className="flex justify-center w-full mt-4 min-h-screen">
      <form onSubmit={handleSubmit} className="w-full rounded-sm ">
        <div className="mb-6 flex items-center gap-4">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-semibold">Edit Exclusion</h1>
        </div>
        {isLoadingExclusion ? (
          <div className="flex items-center justify-center p-8">
            <Loader className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <div className="grid gap-4 py-4">


            <div className="grid gap-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <RichTextEditor
                initialContent={formData.description}
                onChange={(content) =>
                  setFormData({ ...formData, description: content })
                }
                placeholder="Enter description"
                className="min-h-[120px]"
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description}</p>
              )}
            </div>

            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isUpdating}
              className="w-full bg-red-600 hover:bg-red-700 text-white"
            >
              {isUpdating ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Exclusion"
              )}
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}
