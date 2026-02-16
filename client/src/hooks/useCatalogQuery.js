import { useQuery } from "@tanstack/react-query";
import { catalogApi } from "../api/endpoints";
import { REFETCH_INTERVAL } from "../utils/config";

function useCatalogQuery(params) {
  return useQuery({
    queryKey: ["catalog", params],
    queryFn: () => catalogApi.getCatalogs(params),
    keepPreviousData: true,
    refetchInterval: REFETCH_INTERVAL,
  });
}

export default useCatalogQuery;
