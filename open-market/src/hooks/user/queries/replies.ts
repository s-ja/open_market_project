import { getUserReplies } from "@/apis/user/replies";
import { useQuery } from "@tanstack/react-query";

export function useUserRepliesQuery() {
	return useQuery({
		queryKey: ["userReplies"],
		queryFn: () => getUserReplies(),
	});
}
