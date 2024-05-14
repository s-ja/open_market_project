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
	bookmarks?: number | Bookmark[];
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

interface Reply {
	_id: number;
	order_id: number;
	product_id: number;
	rating: number;
	content: string;
	createdAt: string;
	product: ReplyProduct;
	user: {
		name: string;
		_id: number;
	};
	extra?: {
		profileImage: string;
	};
}

interface PostReply {
	order_id: number;
	product_id: number;
	rating: number;
	content: string;
	extra?: {
		profileImage: string | null | undefined;
	};
}

interface ReplyProduct {
	_id: number;
	name: string;
	image: {
		name: string;
		originalname: string;
		path: string;
	};
}

interface ReplyResponse {
	ok: number;
	item: Reply;
}

interface PostReplyResponse {
	ok: number;
	item: PostReply;
}

interface ReplyListResponse {
	ok: number;
	item: Reply[];
}

interface Bookmark {
	_id: number;
	user_id: number;
	product_id: number;
	memo: string;
	createdAt: string;
}

interface BookmarkResponse {
	ok: number;
	item: Bookmark[];
}
