import { axiosInstance } from "@/utils";

export async function postProductReply(
	replyData: PostReply,
): Promise<PostReply | undefined> {
	try {
		const response = await axiosInstance.post<PostReplyResponse>(
			`/replies`,
			replyData,
		);

		return response.data.item;
	} catch (error) {
		console.error(error);
		throw error;
	}
}
