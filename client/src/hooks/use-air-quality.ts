import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";

export function useAirQualityList() {
  return useQuery({
    queryKey: [api.airQuality.list.path],
    queryFn: async () => {
      const res = await fetch(api.airQuality.list.path);
      if (!res.ok) throw new Error("Failed to fetch air quality data");
      return api.airQuality.list.responses[200].parse(await res.json());
    },
  });
}

export function useAirQuality(id: number) {
  return useQuery({
    queryKey: [api.airQuality.get.path, id],
    queryFn: async () => {
      const url = api.airQuality.get.path.replace(":id", id.toString());
      const res = await fetch(url);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch reading");
      return api.airQuality.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}
