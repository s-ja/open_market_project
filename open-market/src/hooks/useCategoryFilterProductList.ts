import { axiosInstance } from "@/utils";
import { useQuery } from "@tanstack/react-query";

export interface CategoryFilterProductListProps {
	resource: string;
	category: string;
}

export const fetchFilterCategoryProductList = async ({
	resource,
	category,
}: CategoryFilterProductListProps) => {
	try {
		const { data } = await axiosInstance.get(
			`/${resource}?custom={"extra.category": "${category}"}`,
		);
		return data;
	} catch (error) {
		console.error("상품 리스트 조회 실패:", error);
	}
};

export function useCategoryFilterProductList({
	resource,
	category,
}: CategoryFilterProductListProps) {
	return useQuery({
		queryKey: ["products", { resource, category }],
		queryFn: () => fetchFilterCategoryProductList({ resource, category }),
	});
}
