import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../../shared/api/api-client.js";

export function useAdminQuery(key, path) {
  return useQuery({ queryKey: ["admin", key], queryFn: () => api.get(path) });
}

export function useAdminMutation({ method = "patch", invalidate }) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ path, body }) => api[method](path, body),
    onSuccess: () => {
      for (const key of invalidate)
        queryClient.invalidateQueries({ queryKey: ["admin", key] });
      queryClient.invalidateQueries({ queryKey: ["beaches"] });
      queryClient.invalidateQueries({ queryKey: ["beach"] });
    },
  });
}

export function useUpload() {
  return useMutation({
    mutationFn(file) {
      const formData = new FormData();
      formData.append("image", file);
      return api.upload("/api/admin/uploads", formData);
    },
  });
}
