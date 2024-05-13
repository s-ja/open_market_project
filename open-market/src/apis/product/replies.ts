import { axiosInstance } from "@/utils";

export async function getProductReplies(
	productId?: string,
): Promise<Reply[] | undefined> {
	try {
		const response = await axiosInstance.get(`/replies/products/${productId}`);
		return response.data.item;
	} catch (error) {
		console.error(error);
	}
}

export async function postProductReply(
	replyData: PostReply,
): Promise<PostReply> {
	const response = await axiosInstance.post<PostReplyResponse>(
		`/replies`,
		replyData,
	);

	return response.data.item;
}
