import { useQuery } from "@tanstack/react-query";

import { commandCentreApi } from "../api/command-centre.api";

export function useCommandCentre() {
  return useQuery({
    queryKey: ["command-centre"],

    queryFn: () => commandCentreApi.getDashboard(),

    staleTime: 1000 * 60 * 5,

    refetchOnWindowFocus: false,
  });
}
