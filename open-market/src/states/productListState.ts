import { atom } from "recoil";

export const productListState = atom<Product[]>({
	key: "productListState",
	default: [],
});

export const searchKeywordState = atom<string>({
	key: "searchKeywordState",
	default: "",
});

export const searchedProductListState = atom<Product[]>({
	key: "searchProductListState",
	default: [],
});

export const categoryValueState = atom<string>({
	key: "categoryValueState",
	default: "all",
});
