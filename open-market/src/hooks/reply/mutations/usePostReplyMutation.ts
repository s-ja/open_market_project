import { postProductReply } from "@/apis/reply/post";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

type TParams = {
	productId?: string;
};

export function usePostReplyMutation({ productId }: TParams) {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: postProductReply,

		onMutate: async (newReply: PostReply) => {
			await queryClient.cancelQueries({
				queryKey: ["productReplies", productId],
			});
			const previousReplies = queryClient.getQueryData<Reply>([
				"productReplies",
				productId,
			]);
			queryClient.setQueryData<PostReply[]>(
				["productReplies", productId],
				// undefined일 때는 빈배열 반환
				(prevReplies = []) => [...prevReplies, newReply],
			);
			return previousReplies;
		},

		onSuccess: () => {
			toast.success("댓글을 작성했습니다.", {
				ariaProps: {
					role: "status",
					"aria-live": "polite",
				},
			});
			queryClient.invalidateQueries({
				queryKey: ["productReplies", productId],
			});
		},

		onError: (error, _newReply, context: Reply | undefined) => {
			console.error(error);
			queryClient.setQueryData(["productReplies"], context);
		},
	});

	return mutation;
}
