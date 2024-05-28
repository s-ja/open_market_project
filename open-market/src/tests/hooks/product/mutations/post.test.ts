import { postProductDetail } from "@/apis/product/post";
import { usePostProductMutation } from "@/hooks/product/mutations/usePostProductMutation";
import TestWrapper from "@/tests/Wrapper";
import { renderHook, waitFor } from "@testing-library/react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { MockInstance, vi } from "vitest";

vi.mock("react-router-dom", () => ({
	...vi.importActual("react-router-dom"),
	useNavigate: vi.fn(),
}));

vi.mock("@/apis/product/post", () => ({
	...vi.importActual("@/apis/product/post"),
	postProductDetail: vi.fn(),
}));

const mockPostProductDetail = postProductDetail as unknown as MockInstance;

describe("usePostProductMutation", () => {
	const mockProduct = {
		show: true,
		active: true,
		name: "",
		mainImages: [{ path: "", name: "", originalname: "" }],
		content: "",
		price: 0,
		shippingFees: 0,
		quantity: Number.MAX_SAFE_INTEGER,
		buyQuantity: 0,
		extra: {
			sellerName: "currentUser.name",
			isNew: true,
			isBest: false,
			category: "",
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
		const mockResponse = { _id: "123", ...mockProduct };
		const mockNavigate = vi.fn();
		(useNavigate as unknown as MockInstance).mockImplementation(
			() => mockNavigate,
		);

		mockPostProductDetail.mockResolvedValueOnce({ _id: "123" });
		const toastSuccessSpy = vi.spyOn(toast, "success");
		const { result } = renderHook(() => usePostProductMutation(), {
			wrapper: TestWrapper,
		});

		await waitFor(async () => {
			result.current.mutate(mockProduct);
		});

		expect(toastSuccessSpy).toHaveBeenCalledWith(
			"상품 등록 성공!",
			expect.anything(),
		);

		expect(mockNavigate).toHaveBeenCalledWith(
			`/product/manage/${mockResponse._id}`,
		);
	});

	it("should handle error on mutation failure", async () => {
		mockPostProductDetail.mockRejectedValueOnce(new Error("Network Error"));

		const { result } = renderHook(() => usePostProductMutation(), {
			wrapper: TestWrapper,
		});
		const consoleErrorSpyOn = vi.spyOn(console, "error");
		await waitFor(async () => {
			result.current.mutate(mockProduct);
		});
		expect(consoleErrorSpyOn).toHaveBeenCalled();
	});
});
