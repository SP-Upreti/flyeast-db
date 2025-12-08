import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { toast } from "sonner";
import { useParams } from "react-router-dom";
import {
  useCreateAttraction,
} from "@/hooks/useAttraction";
import RichTextEditor from "../RichTextEditor";

interface AttractionData {
  description: string;
}

export default function CreateAttractionSheet({
  onClose,
}: {
  id: string;
  onClose: () => void;
  onOpen: () => void;
}) {
  const params = useParams();

  const [formData, setFormData] = useState<AttractionData>({
    description: "",
  });
  const [errors, setErrors] = useState<Partial<AttractionData>>({});
  const [isOpen, setIsOpen] = useState(false);

  const { mutateAsync: createAttraction, isPending } = useCreateAttraction();

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



      await createAttraction(
        {
          packageId: params.id!,
          formData: formDataToSend,
        },
        {
          onSuccess: () => {
            toast.success("Attraction created successfully");
            setFormData({
              description: "",
            });
            setIsOpen(false);
            onClose(); // Navigate back to list page
          },
          onError: () => {
            toast.error("Failed to create attraction");
          },
        }
      );

      // toast.success("Attraction created successfully");
      setFormData({
        description: "",
      });
    } catch (error) {
      toast.error("Failed to create attraction");
    } finally {
      // setIsUpdating(isPending);
    }
  };

  return (
    <div className=" w-full  p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-2xl font-bold text-primary">Create Attraction</div>
        <Button onClick={onClose} variant={"outline"}>
          Close
        </Button>
      </div>


      {/* Description Field */}
      <div className="space-y-2">
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description <span className="text-red-500">*</span>
        </label>
        <RichTextEditor
          initialContent={formData.description}
          onChange={(content) =>
            setFormData({ ...formData, description: content })
          }
          className="w-full rounded-[2px]   text-sm min-h-[100px]  focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Enter description"
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description}</p>
        )}
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-4">
        <Button
          className="cursor-pointer"
          onClick={() => onClose()}
          variant={"outline"}
          disabled={isPending}
        >
          Cancel
        </Button>

        <Button onClick={handleSubmit} disabled={isPending}>
          {isPending ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            "Create Attraction"
          )}
        </Button>
      </div>
    </div>
  );
}
