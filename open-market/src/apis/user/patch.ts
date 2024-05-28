import { axiosInstance } from "@/utils";

export async function patchUserData(
	userId: number,
	userData: patchUserDataRequest,
) {
	const response = await axiosInstance.patch(`/users/${userId}`, userData);
	return response.data;
}
