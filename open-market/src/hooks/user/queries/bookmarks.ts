import { getUserBookmarks } from "@/apis/user/bookmarks";
import { useQuery } from "@tanstack/react-query";

export function useUserBookmarksQuery() {
	const { data, isLoading } = useQuery({
		queryKey: ["userBookmarks"],
		queryFn: () => getUserBookmarks(),
		select: (data) => [...data].reverse(),
	});

	return { data, isLoading };
}
