import { deleteUserBookmark } from "@/apis/user/bookmarks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useDeleteBookmarkMutation() {
	const queryClient = useQueryClient();

	const { mutate } = useMutation({
		mutationFn: (bookmarkId: string) => deleteUserBookmark(bookmarkId),

		onMutate: async (bookmarkId) => {
			const previousBookmarks = queryClient.getQueryData<Bookmark>([
				"userBookmarks",
			]);
			queryClient.setQueryData<Bookmark[]>(["userBookmarks"], (prev) =>
				prev!.filter((bookmark) => bookmark._id.toString() !== bookmarkId),
			);
			return { previousBookmarks };
		},

		onSuccess: () => {
			toast.success("북마크 삭제 완료", {
				ariaProps: {
					role: "status",
					"aria-live": "polite",
				},
			});
			queryClient.invalidateQueries({ queryKey: ["userBookmarks"] });
		},

		onError: (error, _bookmarkId, context) => {
			console.error(error);
			queryClient.setQueryData(["userBookmarks"], context!.previousBookmarks);
			toast.error("북마크 삭제 실패", {
				ariaProps: {
					role: "status",
					"aria-live": "polite",
				},
			});
		},
	});

	return { mutate };
}
