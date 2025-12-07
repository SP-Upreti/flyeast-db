import { api } from "@/services/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// Types for the user data
export interface User {
  _id: string;
  email: string;
  role: string;
  permissions: string[];
  firstName?: string;
  lastName?: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateUserData {
  email: string;
  password: string;
  role: string;
  permissions: string[];
  firstName: string;
  lastName: string;
}

interface UpdatePermissionsData {
  permissions: string[];
}

// Hook to get all users
export const useGetAllUsers = () => {
  return useQuery({
    queryKey: ["admin", "users"],
    queryFn: async () => {
      const response = await api.get("users/admin/get-all-users");
      return response.data as User[];
    },
  });
};

// Hook to create a new user
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateUserData) => {
      const response = await api.post("users/admin/create-user", data);
      return response.data as User;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      toast.success("User created successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to create user");
    },
  });
};

// Hook to update user permissions
export const useUpdateUserPermissions = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      role: string;
      permissions: string[];
      firstName: string;
      lastName: string;
    }) => {
      const response = await api.patch(
        `users/admin/update-user/${id}/permissions`,
        data
      );
      return response.data as User;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      toast.success("User permissions updated successfully");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.message || "Failed to update user permissions"
      );
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`users/admin/delete-user/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      toast.success("User deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to delete user");
    },
  });
};
