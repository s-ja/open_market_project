import { getProductOrder } from "@/apis/product/order";
import { axiosInstance } from "@/utils";
import { describe, it, expect, vi } from "vitest";

vi.mock("@/utils", () => {
	return {
		axiosInstance: {
			get: vi.fn(),
		},
	};
});

describe("getProductOrder", () => {
	const productId = "45";
	const orderDataMock = {
		products: [{ _id: +productId }],
	};

	afterEach(() => {
		vi.resetAllMocks();
	});

	it("should fetch product order successfully", async () => {
		const mockResponse = {
			data: {
				item: [orderDataMock],
			},
		};
		axiosInstance.get = vi.fn().mockResolvedValue(mockResponse);

		const result = await getProductOrder(productId);

		expect(result).toEqual(orderDataMock);
		expect(axiosInstance.get).toHaveBeenCalledWith(`/orders`);
	});

	it("should throw an error if productId is undefined", async () => {
		const mockError = new Error("product id is undefined");
		axiosInstance.get = vi.fn().mockRejectedValue(mockError);

		await expect(getProductOrder(undefined)).rejects.toThrow(
			"productId is required",
		);
	});
});
