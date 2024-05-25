import { patchUserData } from "@/apis/user/patch";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export function usePatchUserDataMutation() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: { userId: number; userData: patchUserDataRequest }) =>
			patchUserData(data.userId, data.userData),
		onSuccess: () => {
			toast.success("회원 정보가 수정되었습니다.", {
				ariaProps: {
					role: "status",
					"aria-live": "polite",
				},
			});
			queryClient.invalidateQueries({ queryKey: ["userData"] });
			navigate("/mypage");
		},
		onError: (error: any) => {
			console.error("Error updating user info:", error);
			toast.error("회원 정보 수정에 실패했습니다.", {
				ariaProps: {
					role: "status",
					"aria-live": "polite",
				},
			});
		},
	});
}
