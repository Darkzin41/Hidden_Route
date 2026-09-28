import { useQuery } from "@tanstack/react-query";
import { api } from "../../shared/api/api-client.js";

export function useBeaches(search = "") {
  return useQuery({
    queryKey: ["beaches", search],
    queryFn: () =>
      api.get(
        `/api/beaches${search ? `?search=${encodeURIComponent(search)}` : ""}`,
      ),
  });
}

export function useBeach(slug) {
  return useQuery({
    queryKey: ["beach", slug],
    queryFn: () => api.get(`/api/beaches/${encodeURIComponent(slug)}`),
    enabled: Boolean(slug),
  });
}
