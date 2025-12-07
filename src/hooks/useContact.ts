import { api } from "@/services/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useGetContacts = () => {
  return useQuery({
    queryKey: ["contact"],
    queryFn: async () => {
      const response = await api.get("contact");
      return response.data.data;
    },
  });
};

export const useGetContactById = (id: string) => {
  return useQuery({
    queryKey: ["contact", id],
    queryFn: async () => {
      const response = await api.get("contact/" + id);
      return response.data.data;
    },
  });
};

export const useCreateContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      email: string;
      phone?: string;
      message: string;
    }) => {
      const response = await api.post("contact", data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact"] });
    },
  });
};

export const useUpdateContact = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      name?: string;
      email?: string;
      phone?: string;
      message?: string;
      status?: string;
    }) => {
      const response = await api.put("contact/" + id, data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact"] });
      queryClient.invalidateQueries({ queryKey: ["contact", id] });
    },
  });
};

export const useDeleteContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete("contact/" + id);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact"] });
    },
  });
};