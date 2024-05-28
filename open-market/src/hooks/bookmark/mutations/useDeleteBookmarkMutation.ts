import { deleteUserBookmark } from "@/apis/bookmark/delete";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useDeleteBookmarkMutation() {
	const queryClient = useQueryClient();

	const { mutate, isSuccess } = useMutation({
		mutationFn: ({ bookmarkId }) => deleteUserBookmark(bookmarkId),

		onMutate: async ({
			bookmarkId,
			productId,
		}: {
			bookmarkId: string | number;
			productId: string | number;
		}) => {
			const previousBookmark = queryClient.getQueryData<Bookmark>([
				"userBookmarks",
				bookmarkId,
			]);

			queryClient.setQueryData<Bookmark[]>(
				["userBookmarks", bookmarkId],
				(prev) => {
					if (!prev) return [];
					return prev!.filter(
						(bookmark) => bookmark._id.toString() !== bookmarkId,
					);
				},
			);
			return { previousBookmark, bookmarkId, productId };
		},

		onSuccess: (_, context) => {
			toast.success("북마크 삭제 완료", {
				ariaProps: {
					role: "status",
					"aria-live": "polite",
				},
			});
			const { productId } = context;

			queryClient.invalidateQueries({ queryKey: ["userBookmarks"] });
			queryClient.removeQueries({
				queryKey: ["bookmark", productId],
			});
		},

		onError: (error, _bookmarkId, context) => {
			console.error(error);

			queryClient.setQueryData(
				["userBookmarks", _bookmarkId],
				context!.previousBookmark,
			);
			toast.error("북마크 삭제 실패", {
				ariaProps: {
					role: "status",
					"aria-live": "polite",
				},
			});
		},
	});

	return { mutate, isSuccess };
}
