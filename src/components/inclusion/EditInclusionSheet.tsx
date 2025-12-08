import { useEffect,  useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { FilePenLine, Loader } from "lucide-react";
import { api } from "@/services/api";
import { toast } from "sonner";
import { useParams } from "react-router-dom";
import { useUpdateInclusion } from "@/hooks/useInclusion";
import RichTextEditor from "../RichTextEditor";

interface InclusionData {
  description: string;
}

export default function EditInclusionSheet({ id }: { id: string }) {
  const params = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<InclusionData>({
    description: "",
  });
  const [errors, setErrors] = useState<Partial<InclusionData>>({});
  const { mutateAsync: updateInclusion, isPending: isUpdating } =
    useUpdateInclusion(id);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await api.get(`/inclusion/${id}`);
        const fetchedData = response.data.data;
        setFormData({
          description: fetchedData.description || "",
        });
      } catch (error) {
        toast.error("Failed to fetch inclusion data");
      }
    };
    getData();
  }, [id]);

  const validateForm = () => {
    const newErrors: Partial<InclusionData> = {};

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
      await updateInclusion(formDataToSend, {
        onSuccess: () => {
          setFormData({            
            description: "",
          });
          setIsOpen(false);
        },
        onError: () => {
          toast.error("Failed to update inclusion");
        },
      });
    } catch (error) {
      toast.error("Failed to update inclusion");
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger>
        <Button
          variant="outline"
          className="w-full justify-start gap-2"
          onClick={() => setIsOpen(true)}
        >
          <FilePenLine className="h-4 w-4" />
          Edit Inclusion
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit Inclusion</SheetTitle>
          <SheetDescription>
            Modify the itinerary details for this package.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
       

          {/* Description */}
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>

            <RichTextEditor
              initialContent={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e })}
              className="flex min-h-[60px] w-full rounded-[2px] border px-3 py-2 text-sm shadow-sm"
              placeholder="Enter description"
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={isUpdating}
            className="w-fit"
          >
            {isUpdating ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Inclusion"
            )}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
