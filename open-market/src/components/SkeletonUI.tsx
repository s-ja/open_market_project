import {
	FlexLayout,
	FormTopLayout,
	FormTopRightLayout,
	ProductInfoWrapper,
} from "@/pages/product/ProductManage";
import {
	MoreButton,
	ProductContainer,
	ProductList,
	ProductSection,
} from "@/styles/ProductListStyle";
import { Common } from "@/styles/common";
import ModeCommentIcon from "@mui/icons-material/ModeComment";
import { Box, Skeleton } from "@mui/material";
import { FilterContainer } from "./FilterComponent";
import { ProductExtraLinkContainer } from "./ProductDetailBadgeComponent";
import {
	ProductDetailArticle,
	ProductDetailInfo,
} from "./ProductDetailComponent";
import { ReplyContainer } from "./ReplyComponent";

export function IndexSkeleton({ searchKeyword }: { searchKeyword: string }) {
	return (
		<Box sx={{ width: "100%" }}>
			<Skeleton sx={{ width: "100%" }} variant="rectangular" height={580} />
			<ProductSection isIndex>
				<FilterContainer>
					<Skeleton variant="rounded" width={140} height={34} />
					<Skeleton variant="rounded" width={140} height={34} />
					<Skeleton variant="rounded" width={140} height={34} />
				</FilterContainer>
				<ProductContainer height={searchKeyword ? "633px" : "400px"}>
					<ProductList>
						<Skeleton variant="rounded" width={1140} height={64} />
						<Skeleton variant="rounded" width={1140} height={64} />
						<Skeleton variant="rounded" width={1140} height={64} />
						<Skeleton variant="rounded" width={1140} height={64} />
					</ProductList>
				</ProductContainer>
			</ProductSection>
		</Box>
	);
}

export function ProductDetailSkeleton() {
	return (
		<Box sx={{ width: "100%" }}>
			<ProductDetailArticle>
				<Skeleton
					variant="rectangular"
					width={270}
					height={270}
					sx={{ bgcolor: `${Common.colors.gray2}` }}
				/>
				<ProductDetailInfo>
					<Skeleton
						variant="text"
						width={300}
						height={50}
						sx={{ bgcolor: `${Common.colors.gray2}` }}
					/>
					<Skeleton
						variant="text"
						width={300}
						height={18}
						sx={{ bgcolor: `${Common.colors.gray2}` }}
					/>
					<Skeleton
						variant="rounded"
						width={425}
						height={160}
						sx={{ bgcolor: `${Common.colors.gray2}` }}
					/>
				</ProductDetailInfo>
			</ProductDetailArticle>
			<ProductExtraLinkContainer>
				<div>
					<Skeleton variant="rounded" width={200} height={50} />
					<Skeleton variant="rounded" width={200} height={50} />
				</div>
			</ProductExtraLinkContainer>
			<ReplyContainer>
				<h3>
					<ModeCommentIcon />
					댓글
				</h3>
				<Skeleton
					variant="circular"
					width={25}
					height={25}
					sx={{ bgcolor: `${Common.colors.gray2}` }}
				/>
				<Skeleton variant="rounded" width={260} height={24} />
				<Skeleton variant="rounded" width={1138} height={80} />
				<Skeleton
					variant="circular"
					width={25}
					height={25}
					sx={{ bgcolor: `${Common.colors.gray2}` }}
				/>
				<Skeleton variant="rounded" width={260} height={24} />
				<Skeleton variant="rounded" width={1138} height={80} />
			</ReplyContainer>
		</Box>
	);
}

export function ProductManagementSkeleton() {
	return (
		<Box sx={{ width: "100%" }}>
			<ProductInfoWrapper>
				<FormTopLayout>
					<Skeleton variant="rounded" width={300} height={300} />
					<FormTopRightLayout>
						<Skeleton variant="rounded" width={928} height={72} />
						<FlexLayout>
							<Skeleton variant="rounded" width={204} height={72} />
							<Skeleton variant="rounded" width={721} height={72} />
						</FlexLayout>
						<Skeleton variant="rounded" width={928} height={116} />
					</FormTopRightLayout>
				</FormTopLayout>
				<FlexLayout>
					<Skeleton variant="rounded" width={628} height={290} />
					<Skeleton variant="rounded" width={590} height={290} />
				</FlexLayout>
				<FlexLayout right>
					<Skeleton variant="rounded" width={200} height={80} />
					<Skeleton variant="rounded" width={200} height={80} />
				</FlexLayout>
			</ProductInfoWrapper>
		</Box>
	);
}

export function ProductEditSkeleton() {
	return (
		<Box sx={{ width: "100%" }}>
			<ProductInfoWrapper>
				<FormTopLayout>
					<Skeleton variant="rounded" width={300} height={300} />
					<FormTopRightLayout>
						<Skeleton variant="rounded" width={928} height={72} />
						<FlexLayout>
							<Skeleton variant="rounded" width={204} height={72} />
							<Skeleton variant="rounded" width={721} height={72} />
						</FlexLayout>
						<FlexLayout>
							<Skeleton variant="rounded" width={687} height={116} />
							<Skeleton variant="rounded" width={211} height={116} />
						</FlexLayout>
					</FormTopRightLayout>
				</FormTopLayout>
				<FlexLayout>
					<Skeleton variant="rounded" width={628} height={290} />
					<Skeleton variant="rounded" width={590} height={290} />
				</FlexLayout>
				<FlexLayout right>
					<Skeleton variant="rounded" width={200} height={80} />
					<Skeleton variant="rounded" width={200} height={80} />
				</FlexLayout>
			</ProductInfoWrapper>
		</Box>
	);
}

export function ProductPurchaseSkeleton() {
	return (
		<Box sx={{ width: "100%" }}>
			<ProductInfoWrapper>
				<FormTopLayout>
					<Skeleton variant="rounded" width={300} height={300} />
					<FormTopRightLayout>
						<Skeleton variant="rounded" width={928} height={72} />
						<FlexLayout>
							<Skeleton variant="rounded" width={677} height={72} />
							<Skeleton variant="rounded" width={221} height={72} />
						</FlexLayout>
						<FlexLayout>
							<Skeleton variant="rounded" width={1248} height={116} />
						</FlexLayout>
					</FormTopRightLayout>
				</FormTopLayout>
				<FlexLayout>
					<Skeleton variant="rounded" width={1248} height={290} />
				</FlexLayout>
				<FlexLayout right>
					<Skeleton variant="rounded" width={200} height={80} />
					<Skeleton variant="rounded" width={200} height={80} />
				</FlexLayout>
			</ProductInfoWrapper>
		</Box>
	);
}

export function ProductListSkeleton() {
	return (
		<Box sx={{ width: "100%" }}>
			<ProductContainer height="633px">
				<ProductList>
					<Skeleton variant="rounded" width={1140} height={64} />
					<Skeleton variant="rounded" width={1140} height={64} />
					<Skeleton variant="rounded" width={1140} height={64} />
					<Skeleton variant="rounded" width={1140} height={64} />
					<Skeleton variant="rounded" width={1140} height={64} />
					<Skeleton variant="rounded" width={1140} height={64} />
					<Skeleton variant="rounded" width={1140} height={64} />
					<Skeleton variant="rounded" width={1140} height={64} />
				</ProductList>
				<MoreButton>더보기</MoreButton>
			</ProductContainer>
		</Box>
	);
}

export function AudioSkeleton() {
	return <Skeleton variant="rounded" width={813} height={32} />;
}
