import { axiosInstance } from "@/utils";

export async function getUserReplies(): Promise<Reply[] | undefined> {
	try {
		const response = await axiosInstance.get(`/replies`);
		return response.data.item;
	} catch (error) {
		console.error(error);
	}
}
