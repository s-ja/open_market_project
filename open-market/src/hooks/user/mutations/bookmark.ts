import { deleteUserBookmark, postUserBookmark } from "@/apis/user/bookmarks";
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

export function usePostBookmarkMutation() {
	const queryClient = useQueryClient();

	const { mutate, isSuccess } = useMutation({
		mutationFn: ({
			currentUserId,
			productId,
		}: {
			currentUserId: string | number;
			productId: string | number;
		}) => postUserBookmark(currentUserId, productId),

		onMutate: async ({ currentUserId, productId }) => {
			// 기존 북마크 데이터를 가져옵니다.
			const previousBookmark = queryClient.getQueryData<Bookmark>([
				"userBookmarks",
				currentUserId,
			]);

			const newData = {
				user_id: currentUserId,
				product_id: productId,
				memo: "",
			};

			queryClient.setQueryData(["userBookmarks", currentUserId], {
				...previousBookmark,
				...newData,
			});

			return { previousBookmark, currentUserId };
		},

		onSuccess: (_, { productId }) => {
			toast.success("북마크 성공 완료");
			queryClient.invalidateQueries({ queryKey: ["bookmark", productId] });
		},

		onError: (error, _, context) => {
			console.error(error);
			toast.error("북마크 추가 실패");

			if (context?.previousBookmark) {
				queryClient.setQueryData(
					["userBookmarks", context.currentUserId],
					context.previousBookmark,
				);
			}
		},

		onSettled: (_, __, { currentUserId }) => {
			// 쿼리를 무효화하여 최신 데이터를 가져옵니다.
			queryClient.invalidateQueries({
				queryKey: ["userBookmarks", currentUserId],
			});
		},
	});

	return { mutate, isSuccess };
}
