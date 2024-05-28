import { getUserData } from "@/apis/user/get";
import { useQuery } from "@tanstack/react-query";

export function useUserDataQuery(userId: string) {
	return useQuery({
		queryKey: ["userData"],
		queryFn: () => getUserData(userId),
	});
}
