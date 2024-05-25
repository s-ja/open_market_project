import { useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export function useRequireAuth() {
	const navigate = useNavigate();

	useEffect(() => {
		const accessToken = localStorage.getItem("accessToken");
		if (!accessToken) {
			toast.error("로그인이 필요한 서비스입니다.", {
				ariaProps: {
					role: "status",
					"aria-live": "polite",
				},
			});
			navigate("/signin");
		}
	}, [navigate]);
}
