import { axiosInstance } from "@/utils";

export async function signIn(
	email: string,
	password: string,
): Promise<UserResponse> {
	const response = await axiosInstance.post<UserResponse>("/users/login", {
		email,
		password,
	});
	return response.data;
}

export async function signUp(userData: SignUpRequest) {
	const response = await axiosInstance.post("/users/", userData);
	return response.data;
}
