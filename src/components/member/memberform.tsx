import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

import type { Member } from "@/types/team-member";
import { useCreateTeamMember, useUpdateTeamMember } from "@/hooks/useTeam";
import { ImageUploadField } from "../ui/ImageUploads";
import RichTextEditor from "../RichTextEditor";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  designation: z.string().min(1, "Designation is required"),
  memberType: z.enum(["boardmember", "fieldhero"], {
    required_error: "Member type is required",
  }),
  countryCode: z.string().min(1, "Country code is required"),
  phoneNumber: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  facebook: z.string().url().optional().or(z.literal("")),
  twitter: z.string().url().optional().or(z.literal("")),
  linkedin: z.string().url().optional().or(z.literal("")),
  instagram: z.string().url().optional().or(z.literal("")),
  addToHome: z.boolean().optional(),
});

interface MemberFormProps {
  member?: Member;
  onSuccess: () => void;
  onCancel: () => void;
}

export function MemberForm({ member, onSuccess, onCancel }: MemberFormProps) {
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [cvImage, setCvImage] = useState<File | null>(null);
  const [galleryImages, setGalleryImages] = useState<File[]>([]);

  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(
    member?.image || null
  );
  const [cvImagePreview, setCvImagePreview] = useState<string | null>(
    member?.cvImage || null
  );
  const [galleryPreviews, setGalleryPreviews] = useState<any>(
    member?.gallery || []
  );

  // Track existing images that should be kept and removed
  const [existingGalleryImages, setExistingGalleryImages] = useState<string[]>(
    member?.gallery || []
  );
  const [removedGalleryImages, setRemovedGalleryImages] = useState<string[]>([]);
  const [profileImageRemoved, setProfileImageRemoved] = useState(false);
  const [cvImageRemoved, setCvImageRemoved] = useState(false);

  const { mutate: updateMember, isPending: isUpdatePending } =
    useUpdateTeamMember(member?._id as string);

  const { mutate: addMember, isPending: isAddPending } = useCreateTeamMember();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: member?.name || "",
      designation: member?.designation || "",
      memberType: member?.memberType || "boardmember",
      countryCode: member?.countryCode || "+1",
      phoneNumber: member?.phoneNumber || "",
      description: member?.description || "",
      facebook: member?.facebook || "",
      twitter: member?.twitter || "",
      linkedin: member?.linkedin || "",
      instagram: member?.instagram || "",
      addToHome: member?.addToHome ?? false,
    },
  });

  useEffect(() => {
    if (member) {
      form.reset({
        name: member.name || "",
        designation: member.designation || "",
        memberType: member.memberType || "boardmember",
        countryCode: member.countryCode || "+1",
        phoneNumber: member.phoneNumber || "",
        description: member.description || "",
        facebook: member.facebook || "",
        twitter: member.twitter || "",
        linkedin: member.linkedin || "",
        instagram: member.instagram || "",
        addToHome: member.addToHome ?? false,
      });
      setProfileImagePreview(member.image || null);
      setCvImagePreview(member.cvImage || null);
      setGalleryPreviews(member.gallery || []);
      setExistingGalleryImages(member.gallery || []);
      setRemovedGalleryImages([]);
      setProfileImageRemoved(false);
      setCvImageRemoved(false);
    } else {
      form.reset();
      setProfileImagePreview(null);
      setCvImagePreview(null);
      setGalleryPreviews([]);
      setExistingGalleryImages([]);
      setRemovedGalleryImages([]);
      setProfileImageRemoved(false);
      setCvImageRemoved(false);
    }
    setProfileImage(null);
    setCvImage(null);
    setGalleryImages([]);
  }, [member, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("designation", values.designation);
      formData.append("memberType", values.memberType);
      formData.append("countryCode", values.countryCode);
      if (values.phoneNumber) {
        formData.append("phoneNumber", values.phoneNumber);
      }
      formData.append("description", values.description);

      if (values.facebook) formData.append("facebook", values.facebook);
      if (values.twitter) formData.append("twitter", values.twitter);
      if (values.linkedin) formData.append("linkedin", values.linkedin);
      if (values.instagram) formData.append("instagram", values.instagram);

      if (typeof values.addToHome === "boolean") {
        formData.append("addToHome", String(values.addToHome));
      }

      if (profileImage) {
        formData.append("image", profileImage);
      } else if (member && profileImageRemoved) {
        formData.append("removeImage", "true");
      }

      if (cvImage) {
        formData.append("cvImage", cvImage);
      } else if (member && cvImageRemoved) {
        formData.append("removeCvImage", "true");
      }

      // Send all gallery images - both new files and existing URLs that should be kept
      // First, add new gallery images as files
      galleryImages.forEach((image) => {
        formData.append("gallery", image);
      });

      // Then, add existing gallery images that should be kept as URLs
      if (member) {
        const keptGalleryImages = existingGalleryImages.filter(
          (image) => !removedGalleryImages.includes(image)
        );
        keptGalleryImages.forEach((imageUrl) => {
          formData.append("gallery", imageUrl);
        });

        // Send removed gallery images as removeGallery array
        if (removedGalleryImages.length > 0) {
          formData.append("removeGallery", JSON.stringify(removedGalleryImages));
        }
      }

      if (member) {
        updateMember(formData, {
          onSuccess: () => {
            toast(`Team member updated successfully`);
            onSuccess();
          },
          onError: () => {
            toast(`Failed to update team member`);
          },
        });
      } else {
        addMember(formData, {
          onSuccess: () => {
            toast(`Team member created successfully`);
            onSuccess();
          },
          onError: () => {
            toast(`Failed to create team member`);
          },
        });
      }
    } catch (error) {
      toast(`Failed to ${member ? "update" : "create"} team member`);
    }
  };

  const handleGalleryImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      const currentKeptExistingCount = existingGalleryImages.length - removedGalleryImages.length;
      const currentNewImagesCount = galleryImages.length;
      const currentTotalCount = currentKeptExistingCount + currentNewImagesCount;
      const remainingSlots = 6 - currentTotalCount;

      if (remainingSlots <= 0) {
        toast.error("Maximum 6 images allowed in gallery");
        e.target.value = ''; // Clear the input
        return;
      }

      const filesToAdd = newFiles.slice(0, remainingSlots);

      if (filesToAdd.length < newFiles.length) {
        toast.warning(`Only ${filesToAdd.length} images added. Maximum 6 images allowed.`);
      }

      setGalleryImages((prev) => [...prev, ...filesToAdd]);

      const newPreviews = filesToAdd.map((file) => URL.createObjectURL(file));
      setGalleryPreviews((prev: any) => [...prev, ...newPreviews]);
    }
  };

  const removeGalleryImage = (index: number) => {
    const isExistingImage = index < existingGalleryImages.length;

    if (isExistingImage) {
      // This is an existing image, track it for removal
      const imageToRemove = existingGalleryImages[index];
      setRemovedGalleryImages(prev => [...prev, imageToRemove]);
      setExistingGalleryImages(prev => prev.filter((_, i) => i !== index));
    } else {
      // This is a newly added image, remove from new images array
      const newImageIndex = index - existingGalleryImages.length;
      setGalleryImages(prev => prev.filter((_, i) => i !== newImageIndex));
    }

    // Always remove from previews
    setGalleryPreviews((prev: any) =>
      prev.filter((_: any, i: number) => i !== index)
    );
  };

  return (
    <div className="mt-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Member name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="designation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Designation</FormLabel>
                  <FormControl>
                    <Input placeholder="Member designation" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="memberType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Member Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select member type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="boardmember">Board Member</SelectItem>
                      <SelectItem value="fieldhero">Field Hero</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="countryCode"
                render={({ field }) => (
                  <FormItem className="w-1/3">
                    <FormLabel>Country Code</FormLabel>
                    <FormControl>
                      <Input placeholder="+1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem className="w-2/3">
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Phone number (optional)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <RichTextEditor
                    initialContent={field.value}
                    onChange={(value) => field.onChange(value)}
                    placeholder="Member description"
                    className="min-h-[300px] bg-white"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4">
            <h3 className="text-2xl text-red-500 font-semibold mt-10 mb-6">
              Social Media Links
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="facebook"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Facebook</FormLabel>
                    <FormControl>
                      <Input placeholder="Facebook URL" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="twitter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Twitter</FormLabel>
                    <FormControl>
                      <Input placeholder="Twitter URL" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="linkedin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>LinkedIn</FormLabel>
                    <FormControl>
                      <Input placeholder="LinkedIn URL" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="instagram"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instagram</FormLabel>
                    <FormControl>
                      <Input placeholder="Instagram URL" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="col-span-2 space-y-4">
            <h3 className="text-2xl text-red-500 font-semibold mt-10 mb-6">
              Images & Documents
            </h3>
          </div>

          <div className="grid gap-6 grid-cols-1">
            {/* Profile Image */}
            <div>
              <FormItem>
                <FormLabel>Profile Image  <span className="text-[#E83759]">(Aspect Ratio 16/9) 1920 × 1080 px</span></FormLabel>
                <FormControl>
                  <ImageUploadField
                    previewUrl={profileImagePreview}
                    onChange={(e: any) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setProfileImage(file);
                        setProfileImagePreview(URL.createObjectURL(file));
                        setProfileImageRemoved(false);
                      } else {
                        // This handles the remove case
                        setProfileImage(null);
                        setProfileImagePreview(null);
                        if (member?.image) {
                          setProfileImageRemoved(true);
                        }
                      }
                    }}
                    name={"image"}
                    label={"Upload Profile Image"}
                  />
                </FormControl>
              </FormItem>
            </div>

            {/* CV Image */}
            <div>
              <FormItem>
                <FormLabel>CV Image (Optional) (Any Size)</FormLabel>
                <FormControl>
                  <ImageUploadField
                    previewUrl={cvImagePreview}
                    onChange={(e: any) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setCvImage(file);
                        setCvImagePreview(URL.createObjectURL(file));
                        setCvImageRemoved(false);
                      } else {
                        // This handles the remove case
                        setCvImage(null);
                        setCvImagePreview(null);
                        if (member?.cvImage) {
                          setCvImageRemoved(true);
                        }
                      }
                    }}
                    name={"cvImage"}
                    label={"Upload CV Image"}
                  />
                </FormControl>
              </FormItem>
            </div>

            {/* Gallery Images */}
            <div>
              <FormItem>
                <FormLabel>Gallery Images (Maximum 6 images)  <span className="text-[#E83759]">(Aspect Ratio 1/1) Square</span></FormLabel>
                <FormControl>
                  <div className="space-y-4">
                    {galleryPreviews.length < 6 ? (
                      <Input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => {
                          handleGalleryImageChange(e);
                          // Clear the input after handling
                          e.target.value = '';
                        }}
                        className="cursor-pointer"
                      />
                    ) : (
                      <div className="p-4 border-2 border-dashed border-gray-200 rounded-sm bg-gray-50">
                        <p className="text-center text-gray-500">
                          Maximum of 6 images reached. Remove an image to add more.
                        </p>
                      </div>
                    )}
                    <p className="text-sm text-gray-500">
                      {galleryPreviews.length}/6 images uploaded
                      {galleryPreviews.length >= 6 && (
                        <span className="text-red-600 font-medium"> - Maximum reached</span>
                      )}
                    </p>

                    {galleryPreviews.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                        {galleryPreviews.map((preview: any, index: number) => (
                          <div key={index} className="relative group">
                            <img
                              src={typeof preview === 'string' ? preview : URL.createObjectURL(preview)}
                              alt={`Gallery image ${index + 1}`}
                              className="w-full h-32 object-cover rounded-sm border-2 border-gray-200"
                            />
                            <button
                              type="button"
                              onClick={() => removeGalleryImage(index)}
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </FormControl>
              </FormItem>
            </div>
          </div>

          <FormField
            control={form.control}
            name="addToHome"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Add to Home</FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end space-x-2 pt-8">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isAddPending || isUpdatePending}>
              {member ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
