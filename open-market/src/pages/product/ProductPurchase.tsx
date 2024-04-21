import FunctionalButton from "@/components/FunctionalButton";
import HelmetSetup from "@/components/HelmetSetup";
import { ProductPurchaseSkeleton } from "@/components/SkeletonUI";
import Textarea from "@/components/Textarea";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { currentUserState } from "@/states/authState";
import { codeState } from "@/states/categoryState";
import { Common } from "@/styles/common";
import { axiosInstance, numberWithComma } from "@/utils";
import styled from "@emotion/styled";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { ProductInfoWrapper } from "./ProductManage";

interface FlexLayoutProps {
	right?: boolean;
}

interface StyleProps {
	wide?: boolean;
	large?: boolean;
}

interface LabelProps {
	bar?: boolean;
	large?: boolean;
}

const ProductPurchaseSection = styled.section`
	background-color: ${Common.colors.white};
	padding-top: 100px;
	padding-bottom: 20px;

	.a11yHidden {
		display: ${Common.a11yHidden};
	}

	.ProductInfoWrapper {
		background-color: ${Common.colors.gray2};
		padding: 40px;
		width: 1328px;
		margin: 0 auto;
		border-radius: 10px;
		display: flex;
		flex-direction: column;
		gap: ${Common.space.spacingXl};
	}
	.ProductImage {
		border-radius: 10px;
		width: 300px;
	}
	.ProductInfo {
		background-color: ${Common.colors.white};
	}
`;

const FormTopLayout = styled.div`
	width: 1248px;
	display: flex;
	gap: ${Common.space.spacingLg};
`;

const FormTopRightLayout = styled.div`
	display: flex;
	flex: 1;
	flex-direction: column;
	gap: ${Common.space.spacingLg};
	width: 918px;
`;

const FlexLayout = styled.div<FlexLayoutProps>`
	display: flex;
	gap: ${Common.space.spacingXl};
	${(props) => props.right && "justify-content: flex-end;"}
`;

const ProductItemWrapper = styled.div<StyleProps>`
	display: flex;
	border-radius: 10px;
	background-color: ${Common.colors.white};
	padding: ${Common.space.spacingLg} ${Common.space.spacingMd};
	${(props) => (props.wide ? "width: 677px;" : "flex-grow: 1;")}

	${(props) =>
		props.large
			? `height: 290px; position: relative;`
			: "height: 72px; 	align-items: center;"}
`;

const ProductLabel = styled.span<LabelProps>`
	color: ${Common.colors.gray};
	white-space: nowrap;

	${(props) =>
		props.bar &&
		`
    &:after {
      content: " | ";
    }
  `}
`;

const ProductValue = styled.span<LabelProps>`
	font-size: 16px;
	color: ${Common.colors.black};
	background-color: ${Common.colors.white};
	padding: ${Common.space.spacingLg};
	${(props) =>
		props.large &&
		`
    position: absolute;
    bottom: 0;
    right: 0;
    font-size: ${Common.font.size.xl};
    color:${Common.colors.gray}
  `}
`;

const ContentWrapper = styled.div`
	position: relative;

	.ContentInHash {
		color: ${Common.colors.gray};
		padding: 5px ${Common.space.spacingMd} ${Common.space.spacingMd} 0px;
		position: absolute;
		right: 0;
		bottom: 0;
	}
`;

function ProductPurchase() {
	const navigate = useNavigate();

	const { productId } = useParams();

	const category = useRecoilValue(codeState);
	const currentUser = useRecoilValue(currentUserState);

	const [isLoading, setIsLoading] = useState<boolean>(true);

	const [product, setProduct] = useState<Product>();
	const [genre, setGenre] = useState<string>();

	useRequireAuth();

	async function fetchProduct(id: string) {
		try {
			const response = await axiosInstance.get<ProductResponse>(
				`/products/${id}`,
			);
			if (currentUser?._id === response.data.item?.seller_id) {
				toast.error("비정상적인 접근입니다.", {
					ariaProps: {
						role: "status",
						"aria-live": "polite",
					},
				});
				return navigate("/", { replace: true });
			}
			fetchOrder(+id).then(() => {
				setProduct(response.data.item);
			});
		} catch (error) {
			if (error instanceof AxiosError && error.response?.status === 404) {
				return navigate("/err404", { replace: true });
			}
			console.error(error);
		}
	}

	async function fetchOrder(productId: number) {
		try {
			const response = await axiosInstance.get<OrderListResponse>(`/orders`);
			if (
				response.data.item.some((order) => order.products[0]._id === productId)
			) {
				toast.error("비정상적인 접근입니다.", {
					ariaProps: {
						role: "status",
						"aria-live": "polite",
					},
				});
				return navigate("/", { replace: true });
			}
		} catch (error) {
			console.error(error);
		}
	}

	async function handleProductOrder() {
		if (confirm("구매하시겠습니까?")) {
			try {
				const response = await axiosInstance.post<OrderResponse>("/orders", {
					products: [
						{
							_id: product?._id,
							quantity: 1,
						},
					],
				});
				if (response.data.ok) {
					toast.success("구매 완료!", {
						ariaProps: {
							role: "status",
							"aria-live": "polite",
						},
					});
					navigate(`/orders`);
				}
			} catch (error) {
				console.error(error);
			}
		}
	}

	useEffect(() => {
		if (productId === null || productId === "") {
			return navigate("/err404", { replace: true });
		}
		fetchProduct(productId!);
	}, []);

	useEffect(() => {
		if (product) {
			setIsLoading(false);
		}
	}, [product]);

	useEffect(() => {
		function translateCodeToValue(code: string) {
			if (
				code !== undefined &&
				category !== undefined &&
				product !== undefined
			) {
				return category!.find((item) => item.code === code)?.value;
			}
		}
		setGenre(translateCodeToValue(product?.extra?.category!));
	}, [product, category]);

	return (
		<ProductPurchaseSection>
			<HelmetSetup
				title="Order Product"
				description="음원 구매 페이지"
				url={`productpurchase/${productId}`}
			/>
			<h2 className="a11yHidden">상품 구매</h2>
			{isLoading ? (
				<ProductPurchaseSkeleton />
			) : (
				<ProductInfoWrapper>
					<FormTopLayout>
						<img
							src={`${product?.mainImages[0].path}`}
							alt={product?.name ? `${product.name}의 앨범 아트` : ""}
							className="ProductImage"
						/>
						<FormTopRightLayout>
							<ProductItemWrapper>
								<ProductLabel bar>제목</ProductLabel>
								<ProductValue>{product?.name}</ProductValue>
							</ProductItemWrapper>
							<FlexLayout>
								<ProductItemWrapper wide>
									<ProductLabel bar>아티스트</ProductLabel>
									<ProductValue> {product?.extra?.sellerName}</ProductValue>
								</ProductItemWrapper>
								<ProductItemWrapper>
									<ProductLabel bar>장르</ProductLabel>
									<ProductValue>{genre}</ProductValue>
								</ProductItemWrapper>
							</FlexLayout>
							<ContentWrapper>
								<Textarea readOnly={true} content={product?.content} small />
								<span
									className="ContentInHash"
									aria-label="상품에 등록된 해시태그 목록"
								>
									{product?.extra?.tags?.map((tag) => `#${tag} `)}
								</span>
							</ContentWrapper>
						</FormTopRightLayout>
					</FormTopLayout>
					<ProductItemWrapper large aria-label="결제 정보 : 가격">
						<ProductLabel>결제 정보</ProductLabel>
						<ProductValue large>
							{product?.price !== undefined
								? numberWithComma(product.price)
								: 0}
							₩
						</ProductValue>
					</ProductItemWrapper>
					<FlexLayout right>
						<FunctionalButton
							secondary
							handleFn={() => navigate(-1)}
							text="취소"
						/>
						<FunctionalButton handleFn={handleProductOrder} text="구매" />
					</FlexLayout>
				</ProductInfoWrapper>
			)}
		</ProductPurchaseSection>
	);
}

export default ProductPurchase;
