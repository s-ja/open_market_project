import HelmetSetup from "@/components/HelmetSetup";
import { UserRepliesListItem } from "@/components/ProductListComponent";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import {
	Heading,
	ProductContainer,
	ProductList,
	ProductSection,
} from "@/styles/ProductListStyle";
import { axiosInstance } from "@/utils";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function UserReplies() {
	useRequireAuth();
	const navigate = useNavigate();

	const [replies, setReplies] = useState<Reply[]>([]);

	async function fetchUserReplies() {
		try {
			const response = await axiosInstance.get<ReplyListResponse>(`/replies`);
			setReplies(response.data.item);
		} catch (error) {
			if (error instanceof AxiosError && error.response?.status === 404) {
				return navigate("/err404", { replace: true });
			}
			console.error(error);
		}
	}

	useEffect(() => {
		fetchUserReplies();
	}, []);

	return (
		<ProductSection>
			<HelmetSetup
				title="My Replies"
				description="작성한 댓글 목록"
				url="replies"
			/>
			<Heading>내가 쓴 댓글</Heading>
			<ProductContainer height="633px">
				<ProductList>
					{replies.map((reply) => {
						return <UserRepliesListItem reply={reply} />;
					})}
				</ProductList>
			</ProductContainer>
		</ProductSection>
	);
}
