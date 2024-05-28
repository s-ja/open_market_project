import { getUserReplies } from "@/apis/reply/get";
import { useQuery } from "@tanstack/react-query";

export function useUserRepliesQuery() {
	return useQuery({
		queryKey: ["userReplies"],
		queryFn: () => getUserReplies(),
	});
}
