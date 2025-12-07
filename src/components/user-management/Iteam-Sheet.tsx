"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useCreateUser, useUpdateUserPermissions } from "@/hooks/useAdmin";

import type { User } from "@/hooks/useAdmin";

const PERMISSIONS = ["all", "edit", "view", "create", "delete"] as const;

type Permission = (typeof PERMISSIONS)[number];

const formSchema = (isEditing: boolean) =>
  z.object({
    email: z.string().email("Email is required"),
    password: isEditing
      ? z.string().optional()
      : z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(["admin", "editor", "user"], {
      required_error: "Role is required",
    }),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    permissions: z.array(z.enum(PERMISSIONS)).optional(),
  });

interface UserSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: User;
  onSuccess: () => void;
}

export function UserSheet({
  open,
  onOpenChange,
  user,
  onSuccess,
}: UserSheetProps) {
  const [selectedPermissions, setSelectedPermissions] = useState<Permission[]>(
    (user?.permissions as Permission[]) || []
  );
  const [role, setRole] = useState<string>(user?.role || "editor");

  const { mutateAsync: createUser, isPending: isCreatePending } =
    useCreateUser();
  const { mutateAsync: updateUserPermissions, isPending: isUpdatePending } =
    useUpdateUserPermissions(user?._id as string);

  const form = useForm<z.infer<ReturnType<typeof formSchema>>>({
    resolver: zodResolver(formSchema(!!user)),
    defaultValues: {
      email: user?.email || "",
      password: "",
      role: (user?.role as "admin" | "user") || "user",
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      permissions: (user?.permissions as Permission[]) || [],
    },
  });

  useEffect(() => {
    if (user) {
      setSelectedPermissions((user?.permissions as Permission[]) || []);
      setRole(user.role);
    } else {
      setSelectedPermissions([]);
      setRole("editor" as "admin" | "user");
    }
    form.reset({
      email: user?.email || "",
      password: "",
      role: (user?.role as "admin" | "user") || "editor",
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      permissions: (user?.permissions as Permission[]) || [],
    });
    // eslint-disable-next-line
  }, [user, open]);

  const handlePermissionChange = (perm: Permission) => {
    if (perm === "all") {
      if (selectedPermissions.includes("all")) {
        setSelectedPermissions([]);
      } else {
        setSelectedPermissions(["all"]);
      }
    } else {
      let updated = selectedPermissions.includes(perm)
        ? selectedPermissions.filter((p) => p !== perm)
        : [...selectedPermissions.filter((p) => p !== "all"), perm];
      setSelectedPermissions(updated);
    }
  };

  const isAllChecked = selectedPermissions.includes("all");
  const isEditChecked = selectedPermissions.includes("edit");
  const isViewChecked = selectedPermissions.includes("view");

  const isPermissionDisabled = (perm: Permission) => {
    if (role === "admin") return true;
    if (perm === "all") return isEditChecked || isViewChecked;
    if (perm === "edit" || perm === "view") return isAllChecked;
    return false;
  };

  const onSubmit = async (values: z.infer<ReturnType<typeof formSchema>>) => {
    if (role !== "admin" && selectedPermissions.length === 0) {
      toast.error("Please select at least one permission");
      return;
    }
    if (user) {
      await updateUserPermissions(
        {
          permissions: values.role === "admin" ? ["all"] : selectedPermissions,
          role: values.role,
          firstName: values.firstName,
          lastName: values.lastName,
        },
        {
          onSuccess: () => {
            toast.success("User updated successfully");
            onSuccess();
            onOpenChange(false);
          },
          onError: (error: any) => {
            toast.error(
              error.response?.data?.message || "Failed to update user"
            );
          },
        }
      );
    } else {
      createUser(
        {
          email: values.email,
          password: values.password!,
          role: values.role,
          permissions: values.role === "admin" ? ["all"] : selectedPermissions,
          firstName: values.firstName,
          lastName: values.lastName,
        },
        {
          onSuccess: () => {
            toast.success("User created successfully");
            onSuccess();
            onOpenChange(false);
          },
          onError: (error: any) => {
            toast.error(
              error.response?.data?.message || "Failed to create user"
            );
          },
        }
      );
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="sm:max-w-xl overflow-y-auto z-[9999]"
      >
        <SheetHeader>
          <SheetTitle>{user ? "Edit User" : "Add User"}</SheetTitle>
        </SheetHeader>
        <div className="mt-6 px-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 ">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Email" {...field} disabled={!!user} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {!user && (
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <div className="flex gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem className="w-1/2">
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="First Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem className="w-1/2">
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Last Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select
                      onValueChange={(val) => {
                        field.onChange(val);
                        setRole(val);
                        setSelectedPermissions(val === "admin" ? ["all"] : []);
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="z-[9999]">
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="user">User</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div>
                <FormLabel>Permissions</FormLabel>
                <div className="flex gap-4 mt-2">
                  {PERMISSIONS.map((perm) => (
                    <label key={perm} className="flex items-center gap-1">
                      <input
                        type="checkbox"
                        checked={selectedPermissions.includes(perm)}
                        disabled={isPermissionDisabled(perm)}
                        onChange={() => handlePermissionChange(perm)}
                        className="h-4 w-4"
                      />
                      <span className="capitalize">{perm}</span>
                    </label>
                  ))}
                </div>
                {role !== "admin" && selectedPermissions.length === 0 && (
                  <p className="text-xs text-red-500 mt-1">
                    Select at least one permission
                  </p>
                )}
              </div>
              <div className="flex justify-end space-x-2 pt-8">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isCreatePending || isUpdatePending}
                >
                  {user ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
