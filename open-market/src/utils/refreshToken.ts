import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode";

const API_KEY = import.meta.env.VITE_API_SERVER;

export const axiosInstance = axios.create({
	baseURL: API_KEY,
	headers: {
		"Content-Type": "application/json",
		accept: "application/json",
	},
});

type TokenRefreshCallback = (accessToken: string) => void;

function isAxiosError(error: any): error is AxiosError {
	return error.isAxiosError === true;
}

const logTokenExpiration = (
	token: string,
	logLevel: "info" | "debug" = "info",
) => {
	try {
		const decoded = jwtDecode<{ exp: number }>(token);
		const expiresAt = new Date(decoded.exp * 1000);
		if (logLevel === "info") {
			console.info("Token refreshed");
		} else if (logLevel === "debug") {
			console.debug(`Token expires at: ${expiresAt}`);
		}
	} catch (error) {
		console.error("Failed to decode token:", error);
	}
};

let isRefreshing = false;
let subscribers: TokenRefreshCallback[] = [];

function onAccessTokenFetched(accessToken: string): void {
	logTokenExpiration(accessToken, "info"); // 토큰 만료 시간 로깅 // For production
	// logTokenExpiration(accessToken, "debug"); // 토큰 만료 시간 로깅 // For development/debugging
	subscribers.forEach((callback) => callback(accessToken));
	subscribers = [];
}

function addSubscriber(callback: TokenRefreshCallback): void {
	subscribers.push(callback);
}

async function refreshAccessToken(): Promise<string> {
	if (isRefreshing) {
		return new Promise<string>((resolve) => {
			addSubscriber((accessToken: string) => {
				resolve(accessToken);
			});
		});
	}
	isRefreshing = true;

	try {
		const response = await axios.get(
			"https://modi-ip3-modi.koyeb.app/api/users/refresh",
			{
				headers: {
					Authorization: `Bearer ${localStorage.getItem("refreshToken")}`,
				},
			},
		);
		const newAccessToken = response.data.accessToken;
		if (!response.data.ok || !newAccessToken) {
			throw new Error("Failed to refresh token");
		}
		localStorage.setItem("accessToken", newAccessToken);
		axiosInstance.defaults.headers.common["Authorization"] =
			`Bearer ${newAccessToken}`;
		onAccessTokenFetched(newAccessToken);
		return newAccessToken; // 갱신된 토큰 반환
	} catch (error) {
		if (isAxiosError(error)) {
			handleTokenRefreshError(error);
		} else {
			console.error("Unexpected error:", error);
			// 여기에 일반적인 에러 처리 로직
		}
		throw error;
	} finally {
		isRefreshing = false;
	}
}

function handleTokenRefreshError(error: AxiosError) {
	console.error("Error refreshing token:", error);
	let errorMessage = "토큰 갱신 중 문제가 발생했습니다. 다시 시도해주세요.";

	if (error.response) {
		const message = (error.response.data as { message?: string }).message;
		errorMessage =
			message || "토큰 갱신 중 문제가 발생했습니다. 다시 시도해주세요.";
	} else if (error.request) {
		errorMessage = "Network error. Please check your connection.";
	} else {
		errorMessage = error.message || errorMessage;
	}

	toast.error(errorMessage, {
		ariaProps: {
			role: "status",
			"aria-live": "polite",
		},
	});
	localStorage.removeItem("accessToken");
	localStorage.removeItem("refreshToken");
}

axiosInstance.interceptors.request.use(
	(config) => {
		let accessToken = localStorage.getItem("accessToken");
		if (accessToken) {
			config.headers["Authorization"] = `Bearer ${accessToken}`;
		}
		return config;
	},
	(error) => {
		console.error("interceptors error", error);
		return Promise.reject(error);
	},
);

axiosInstance.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;
		if (error.response.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;
			try {
				const newAccessToken = await refreshAccessToken();

				originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
				return axiosInstance(originalRequest);
			} catch (refreshError) {
				return Promise.reject(refreshError);
			}
		}
		return Promise.reject(error);
	},
);
