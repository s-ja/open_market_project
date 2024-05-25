import { Common } from "@/styles/common";
import { Global, css } from "@emotion/react";
import { HelmetProvider, HelmetServerState } from "react-helmet-async";
import { Navigate, Route, Routes } from "react-router-dom";

import { codeState } from "@/states/categoryState";
import { axiosInstance } from "@/utils";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import ScrollToTop from "./components/ScrollToTop";
import RootLayout from "./layout/RootLayout";
import Index from "./pages/Index";
import Error404 from "./pages/error/Error404";
import ProductDetail from "./pages/product/ProductDetail";
import ProductEdit from "./pages/product/ProductEdit";
import ProductManage from "./pages/product/ProductManage";
import ProductOrder from "./pages/product/ProductOrder";
import ProductRegistration from "./pages/product/ProductRegistration";
import MyPage from "./pages/user/MyPage";
import SignIn from "./pages/user/SignIn";
import SignUp from "./pages/user/SignUp";
import UserBookmarks from "./pages/user/UserBookmarks";
import UserEdit from "./pages/user/UserEdit";
import UserOrders from "./pages/user/UserOrders";
import UserProducts from "./pages/user/UserProducts";
import UserReplies from "./pages/user/UserReplies";

const queryClient = new QueryClient();

function App() {
	const setCode = useSetRecoilState(codeState);

	const helmetContext: { helmet: HelmetServerState } = {
		helmet: {} as HelmetServerState,
	};

	useEffect(() => {
		(async () => {
			try {
				const response = await axiosInstance.get(`/codes/productCategory`);
				const responseData = response.data.item;
				const categoryCodeList = responseData.productCategory.codes;
				setCode(categoryCodeList);
			} catch (error) {
				console.error("상품 리스트 조회 실패:", error);
			}
		})();
	});

	return (
		<QueryClientProvider client={queryClient}>
			<ReactQueryDevtools initialIsOpen={false} />
			<HelmetProvider context={helmetContext}>
				<Global
					styles={css`
						${Common.reset}
					`}
				/>
				<ScrollToTop />
				<Routes>
					<Route path="/" element={<RootLayout />}>
						<Route index element={<Index />} />
						{/* sell */}
						<Route
							path="product/registration"
							element={<ProductRegistration />}
						/>
						<Route path="product/edit/:productId" element={<ProductEdit />} />
						<Route
							path="product/manage/:productId"
							element={<ProductManage />}
						/>
						{/* buy */}
						<Route path="product/:productId" element={<ProductDetail />} />
						<Route path="product/order/:productId" element={<ProductOrder />} />
						{/* user */}
						<Route path="mypage" element={<MyPage />} />
						<Route path="user/edit" element={<UserEdit />} />
						<Route path="user/bookmarks" element={<UserBookmarks />} />
						<Route path="user/products" element={<UserProducts />} />
						<Route path="user/orders" element={<UserOrders />} />
						<Route path="user/replies" element={<UserReplies />} />
						{/* signin, signup */}
						<Route path="signin" element={<SignIn />} />
						<Route path="signup" element={<SignUp />} />
						{/* 404 Error */}
						<Route path="/err404" element={<Error404 />} />
						<Route path="*" element={<Navigate replace to="/err404" />} />
					</Route>
				</Routes>
			</HelmetProvider>
		</QueryClientProvider>
	);
}

export default App;
