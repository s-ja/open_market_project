export function sortByProfitProductList(list: Product[]) {
	return list.sort((a, b) => b.buyQuantity * b.price - a.buyQuantity * a.price);
}

export function sortByNewestProductList(list: Product[]) {
	return list.sort((a, b) => {
		return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
	});
}

export function sortByOrdersProductList(list: Product[]) {
	return list.sort((a, b) => {
		return b.buyQuantity - a.buyQuantity;
	});
}
