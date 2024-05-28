interface Product {
	_id: number;
	seller_id: number;
	price: number;
	shippingFees: number;
	show: boolean;
	active: boolean;
	name: string;
	mainImages: ProductFiles[];
	image?: string;
	content: string;
	quantity: number;
	buyQuantity: number;
	createdAt: string;
	updatedAt: string;
	extra?: {
		sellerName: string;
		isNew: boolean;
		isBest: boolean;
		category: string;
		tags: string[];
		soundFile: ProductFiles;
	};
	replies?: Reply[];
	bookmarks?: Bookmark[];
}

interface ProductResponse {
	ok: number;
	item: Product;
}

interface ProductListResponse {
	ok: number;
	item: Product[];
}

interface ProductFiles {
	path: string;
	name: string;
	originalname: string;
	duration?: number;
}

interface ProductRegisterForm {
	show: boolean;
	active?: boolean;
	name: string;
	mainImages: ProductFiles[];
	content: string;
	price: number;
	shippingFees: number;
	quantity: number;
	buyQuantity: number;
	extra: {
		sellerName: string;
		isNew?: boolean;
		isBest?: boolean;
		category: string;
		tags: string[];
		soundFile: ProductFiles;
	};
}

interface ProductEditForm {
	show: boolean;
	name: string;
	mainImages: ProductFiles[];
	content: string;
	price: number;
	shippingFees: number;
	buyQuantity: number;
	extra: {
		category: string;
		tags: string[];
		soundFile: ProductFiles;
		sellerName: string;
	};
}
