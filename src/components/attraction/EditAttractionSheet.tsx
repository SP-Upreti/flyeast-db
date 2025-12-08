import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { api } from "@/services/api";
import { toast } from "sonner";
import { useUpdateAttraction } from "@/hooks/useAttraction";
import RichTextEditor from "../RichTextEditor";

interface AttractionData {
  description: string;
}

export default function EditAttractionSheet({
  id,
  onClose,
}: {
  id: string;
  onClose: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const [formData, setFormData] = useState<AttractionData>({
    description: "",
  });
  const [errors, setErrors] = useState<Partial<AttractionData>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [data, setData] = useState<AttractionData | null>(null);
  const { mutateAsync: updateAttraction, isPending } = useUpdateAttraction(id);

  useEffect(() => {
    if (data) {
      setFormData({
        description: data.description || "",
      });
    }
  }, [data]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/attraction/${id}`);
        if (response.data?.data) {
          const attractionData = response.data.data;
          setData({
            description: attractionData.description || "",
          });
        } else {
          console.error("No data found in response:", response);
          toast.error("Failed to load attraction data");
        }
      } catch (error) {
        console.error("Error fetching attraction data:", error);
      }
    };

    fetchData();
  }, [id]);

  const validateForm = () => {
    const newErrors: Partial<AttractionData> = {};

    if (!formData.description.trim())
      newErrors.description = "Description is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("description", formData.description);


      updateAttraction(formDataToSend, {
        onSuccess: () => {
          toast.success("Attraction updated successfully");
          setFormData({
            description: "",
          });
          setIsOpen(false);
        },
        onError: () => {
          toast.error("Failed to update attraction");
        },
      });
    } catch (error) {
      console.error("Failed to update attraction");
    }
  };

  return (
    <div>
      <div className="">
        <div className="text-lg font-semibold flex justify-between">
          <div>
            <span>Edit Attraction</span>
          </div>
          <Button onClick={onClose} variant="outline">
            close
          </Button>
        </div>
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
              className="flex min-h-[60px] w-full rounded-[2px] border px-3 py-2 text-sm shadow-sm"
              placeholder="Enter description"
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description}</p>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button onClick={onClose} variant="outline" disabled={isPending}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isPending}>
              {isPending ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Update Attraction"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
