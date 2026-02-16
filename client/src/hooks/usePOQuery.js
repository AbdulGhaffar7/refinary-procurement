import { useQuery } from "@tanstack/react-query";
import { poApi } from "../api/endpoints";
import { REFETCH_INTERVAL } from "../utils/config";

function usePOQuery(params) {
  return useQuery({
    queryKey: ["catalog", params],
    queryFn: () => poApi.getPOs(params),
    keepPreviousData: true,
    refetchInterval: REFETCH_INTERVAL,
  });
}

export default usePOQuery;
