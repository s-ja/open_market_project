import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { signUp } from "@/apis/user/auth";
import toast from "react-hot-toast";

export function useSignUpMutation() {
	const navigate = useNavigate();

	return useMutation({
		mutationFn: signUp,
		onSuccess: () => {
			toast.success("회원가입 완료!", {
				ariaProps: {
					role: "status",
					"aria-live": "polite",
				},
			});
			navigate("/signin");
		},
		onError: (error: any) => {
			const message =
				error.response?.data?.message ||
				"회원가입 중 알 수 없는 오류가 발생했습니다.";
			toast.error(message, {
				ariaProps: {
					role: "status",
					"aria-live": "polite",
				},
			});
		},
	});
}
