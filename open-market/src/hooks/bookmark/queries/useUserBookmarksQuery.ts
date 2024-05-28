import { getUserBookmarks } from "@/apis/bookmark/get";
import { useQuery } from "@tanstack/react-query";

export function useUserBookmarksQuery() {
	const { data, isLoading } = useQuery({
		queryKey: ["userBookmarks"],
		queryFn: () => getUserBookmarks(),
		select: (data) => [...data].reverse(),
	});

	return { data, isLoading };
}
