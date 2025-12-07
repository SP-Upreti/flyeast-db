import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import RichTextEditor from "@/components/RichTextEditor";
import { useCreateCategory, useUpdateCategory } from "@/hooks/useCategory";
import { Loader } from "lucide-react";
import { Icon } from "@iconify/react/dist/iconify.js";
import slugify from "react-slugify";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional(),
  addToHome: z.boolean().optional(),
  sortOrder: z.string().optional(),
  image: z.any().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface CategoryFormProps {
  category?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export function CategoryForm({
  category,
  onSuccess,
  onCancel,
}: CategoryFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      addToHome: true,
      sortOrder: "0",
      image: null,
    },
  });

  const [value, setValue] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const { mutateAsync: createCategory, isPending: isCreatePending } =
    useCreateCategory();
  const { mutateAsync: updateCategory, isPending: isUpdatePending } =
    useUpdateCategory(category?._id || null);

  useEffect(() => {
    if (category) {
      form.reset({
        name: category.name || "",
        slug: category.slug || "",
        description: category.description || "",
        addToHome: category.addToHome ?? true,
        sortOrder: category.sortOrder?.toString() || "0",
      });
      setValue(category.description || "");

      if (category.image) {
        setPreviewUrl([category.image]);
      }
    }
  }, [category]);

  // Replace the current slug effect with this:
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "name") {
        const slug = value.name ? slugify(value.name, {}) : "";
        form.setValue("slug", slug, { shouldValidate: true });
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  // Remove the separate description effect since it's already handled in the main form
  useEffect(() => {
    form.setValue("description", value);
  }, [value]);

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("slug", values.slug);
      formData.append("sortOrder", values.sortOrder || "0");
      formData.append("addToHome", String(values.addToHome ?? true));

      if (values.description) {
        formData.append("description", values.description);
      }

      files.forEach((file) => {
        formData.append("image", file);
      });

      if (category?._id) {
        await updateCategory(formData);
        toast.success("Category updated successfully");
      } else {
        await createCategory(formData);
        toast.success("Category created successfully");
      }

      onSuccess();
    } catch (error: any) {
      console.error(error);
      if (error?.response?.data?.message?.includes("duplicate key")) {
        toast.error("Slug must be unique");
      } else {
        toast.error(error.details || "An error occurred. Please try again.");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maxSizeMB = 2;
    const newFiles = Array.from(e.target.files || []).filter((file) => {
      if (file.size > maxSizeMB * 1024 * 1024) {
        toast.error(`${file.name} exceeds ${maxSizeMB}MB limit.`);
        return false;
      }
      return true;
    });

    const updatedFiles = [...files, ...newFiles];
    setFiles(updatedFiles);
    form.setValue("image", updatedFiles, { shouldValidate: true });

    const newPreviewUrls = newFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrl((prev) => [...prev, ...newPreviewUrls]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      form.handleSubmit(onSubmit)();
    }
  };

  const removeImage = () => {
    setFiles([]);
    setPreviewUrl([]);
    form.setValue("image", null);
  };

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          onKeyDown={handleKeyDown}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Category Name <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter category name"
                      {...field}
                      className="bg-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Slug <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      readOnly
                      placeholder=" slug"
                      {...field}
                      className="bg-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="sortOrder"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Sort Order{" "}
                    <span className="text-red-400">(optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="0"
                      min={0}
                      {...field}
                      type="number"
                      className="bg-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="addToHome"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-3 space-y-0 pt-6">
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={field.onChange}
                      className="w-4 h-4 text-green-600 border-green-300 rounded focus:ring-green-500"
                    />
                  </FormControl>
                  <FormLabel className="font-normal">
                    Add to home menu
                  </FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Description{" "}
                  <span className="text-red-400">(optional)</span>
                </FormLabel>
                <FormControl>
                  <RichTextEditor
                    initialContent={value}
                    onChange={(content) => setValue(content || "")}
                    placeholder="Write category description..."
                    className="h-auto"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <FormLabel className="block text-sm font-medium text-zinc-700 mb-1">
              Images <span className="text-red-500">*</span>  <span className="text-[#E83759]">(Aspect Ratio 16/9) 1920 × 1080 px</span>
            </FormLabel>

            {/* Upload Area */}
            <div className=" group relative h-64 w-full mt-2 mx-auto rounded-sm border-2 border-dashed border-zinc-300 hover:border-red-500/50 transition-colors bg-zinc-50/50">
              {/* Upload Content (shown when empty) */}
              {previewUrl.length === 0 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                  <div className="bg-primary/10 p-3 rounded-full mb-3">
                    <Icon
                      icon="solar:upload-line-duotone"
                      width="24"
                      height="24"
                      className="group-hover:text-red-500"
                    />
                  </div>
                  <p className="text-sm text-zinc-600 mb-1">
                    <span className="font-medium text-primary">
                      Click to upload
                    </span>{" "}
                    or drag and drop
                  </p>
                  <p className="text-xs font-medium text-red-500">
                    JPG or PNG (max. 2MB)
                  </p>
                </div>
              )}

              {/* Preview Gallery (shown when images exist) */}
              {previewUrl.length > 0 && (
                <div className="flex h-full gap-2 p-2 overflow-x-auto">
                  {previewUrl.map((item, idx) => (
                    <div
                      key={idx}
                      className="relative flex-shrink-0 h-full aspect-square rounded-[2px] overflow-hidden border border-zinc-200 group"
                    >
                      <img
                        src={item}
                        alt="Upload preview"
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        className="absolute top-1 right-1 bg-white/80 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeImage()}
                      >
                        <svg
                          className="w-4 h-4 text-red-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Hidden File Input */}
              <Input
                type="file"
                accept="image/*"
                multiple
                className="absolute inset-0 w-full h-full cursor-pointer opacity-0"
                onChange={handleFileChange}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isCreatePending || isUpdatePending}
              className="text-red-300 hover:text-red-500 cursor-pointer"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isCreatePending || isUpdatePending}>
              {isCreatePending || isUpdatePending ? (
                <Loader size={16} className="animate-spin mr-2" />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  className="mr-1 h-4 w-4"
                >
                  <path
                    fill="currentColor"
                    d="M5 21q-.825 0-1.413-.588T3 19V5q0-.825.588-1.413T5 3h11.175q.4 0 .763.15t.637.425l2.85 2.85q.275.275.425.638t.15.762V19q0 .825-.588 1.413T19 21H5Zm7-3q1.25 0 2.125-.875T15 15q0-1.25-.875-2.125T12 12q-1.25 0-2.125.875T9 15q0 1.25.875 2.125T12 18Zm-6-8h9V6H6v4Z"
                  />
                </svg>
              )}
              {category ? "Update Package" : "Create Package"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
