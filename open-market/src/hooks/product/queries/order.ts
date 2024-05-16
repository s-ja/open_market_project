import { getProductOrder } from "@/apis/product/order";
import { useQuery } from "@tanstack/react-query";

type TParams = {
	productId?: string;
	currentUser: CurrentUser | null;
	productDetailData: void | Product | undefined;
};

export const useProductOrderSuspenseQuery = ({
	productId,
	currentUser,
	productDetailData,
}: TParams) => {
	const { data, error, isLoading } = useQuery({
		queryKey: ["productorder", productId],
		queryFn: () => getProductOrder(productId),
		enabled: !!currentUser && currentUser._id !== productDetailData?.seller_id,
	});
	return { data, error, isLoading };
};
