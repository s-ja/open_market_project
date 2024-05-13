import { getUserBookmarks } from "@/apis/user/bookMarks";
import { useQuery } from "@tanstack/react-query";

type TParams = {
	productId?: string;
};

export const useBookMarksSuspenseQuery = ({ productId }: TParams) => {
	const { data, error, isLoading } = useQuery({
		queryKey: ["bookmark", { productId }],
		queryFn: () => getUserBookmarks(productId),
	});

	return { data, error, isLoading };
};
