import { postProductReply } from "@/apis/product/replies";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function usePostReplyMutation() {
	const queryClient = useQueryClient();

	const mutation = useMutation({
		mutationFn: postProductReply,
		onMutate: async (newReply: PostReply) => {
			await queryClient.cancelQueries({ queryKey: ["productReplies"] });
			const previousReplies = queryClient.getQueryData<Reply>([
				"productReplies",
			]);
			queryClient.setQueryData<PostReply[]>(
				["productReplies"],
				(prevReplies) => [...prevReplies!, newReply],
			);
			return previousReplies;
		},
		onError: (_error, _newReply, context: Reply | undefined) => {
			queryClient.setQueryData(["productReplies"], context);
		},
		onSuccess: () => {
			toast.success("댓글을 작성했습니다.", {
				ariaProps: {
					role: "status",
					"aria-live": "polite",
				},
			});
			queryClient.invalidateQueries({ queryKey: ["productReplies"] });
		},
	});

	return mutation;
}
