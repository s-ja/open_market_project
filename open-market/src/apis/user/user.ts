import { axiosInstance } from "@/utils";

export async function getUserData(userId: string) {
	const response = await axiosInstance.get(`/users/${userId}`);
	return response.data.item;
}
