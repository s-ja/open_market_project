import { patchProductDetail } from "@/apis/product/product";
import { usePatchProductMutation } from "@/hooks/product/mutations/edit";
import TestWrapper from "@/tests/Wrapper";
import { renderHook, waitFor } from "@testing-library/react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { MockInstance, vi } from "vitest";

vi.mock("react-router-dom", () => ({
	...vi.importActual("react-router-dom"),
	useNavigate: vi.fn(),
}));

vi.mock("@/apis/product/product", () => ({
	...vi.importActual("@/apis/product/product"),
	patchProductDetail: vi.fn(),
}));

const mockEditProductDetail = patchProductDetail as unknown as MockInstance;

describe("usePatchProductMutation", () => {
	const mockProduct = {
		show: true,
		active: true,
		name: "product",
		mainImages: [{ path: "", name: "", originalname: "" }],
		content: "productproductproductproduct",
		price: 0,
		shippingFees: 0,
		quantity: Number.MAX_SAFE_INTEGER,
		buyQuantity: 0,
		extra: {
			sellerName: "1",
			isNew: true,
			isBest: false,
			category: "PC01",
			tags: [],
			soundFile: { path: "", name: "", originalname: "" },
		},
	};

	beforeEach(() => {
		vi.clearAllMocks(); // 모든 모크를 초기화
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	it("should navigate to product page on success", async () => {
		const mockNavigate = vi.fn();
		(useNavigate as unknown as MockInstance).mockImplementation(
			() => mockNavigate,
		);

		mockEditProductDetail.mockResolvedValueOnce({ _id: "123" });
		const toastSuccessSpy = vi.spyOn(toast, "success");
		const { result } = renderHook(() => usePatchProductMutation(), {
			wrapper: TestWrapper,
		});

		await waitFor(async () => {
			result.current.mutate({ productId: "123", newProduct: mockProduct });
		});

		expect(toastSuccessSpy).toHaveBeenCalledWith(
			"상품 수정 완료!",
			expect.anything(),
		);

		expect(mockNavigate).toHaveBeenCalledWith(-1);
	});

	it("should handle error on mutation failure", async () => {
		mockEditProductDetail.mockRejectedValueOnce(new Error("Network Error"));

		const { result } = renderHook(() => usePatchProductMutation(), {
			wrapper: TestWrapper,
		});
		const consoleErrorSpyOn = vi.spyOn(console, "error");
		await waitFor(async () => {
			result.current.mutate({ productId: "123", newProduct: mockProduct });
		});
		expect(consoleErrorSpyOn).toHaveBeenCalled();
	});
});
