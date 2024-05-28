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
