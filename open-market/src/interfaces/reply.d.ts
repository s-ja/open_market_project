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
