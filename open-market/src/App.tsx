import { Common } from "@/styles/common";
import { Global, css } from "@emotion/react";
import { HelmetProvider, HelmetServerState } from "react-helmet-async";
import { Route, Routes } from "react-router-dom";

import { codeState } from "@/states/categoryState";
import { axiosInstance } from "@/utils";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import ScrollToTop from "./components/ScrollToTop";
import RootLayout from "./layout/RootLayout";
import Index from "./pages/Index";
import ErrorBoundary from "./pages/error/ErrorBoundary";
import ProductDetail from "./pages/product/ProductDetail";
import ProductEdit from "./pages/product/ProductEdit";
import ProductManage from "./pages/product/ProductManage";
import ProductPurchase from "./pages/product/ProductPurchase";
import ProductRegistration from "./pages/product/ProductRegistration";
import MyPage from "./pages/user/MyPage";
import SignIn from "./pages/user/SignIn";
import SignUp from "./pages/user/SignUp";
import UserEdit from "./pages/user/UserEdit";
import UserOrders from "./pages/user/UserOrders";
import UserProducts from "./pages/user/UserProducts";

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
					<Route
						path="/"
						element={<RootLayout />}
						errorElement={<ErrorBoundary />}
					>
						<Route index element={<Index />} />
						{/* sell */}
						<Route
							path="productregistration"
							element={<ProductRegistration />}
						/>
						<Route path="productedit/:productId" element={<ProductEdit />} />
						<Route
							path="productmanage/:productId"
							element={<ProductManage />}
						/>
						{/* buy */}
						<Route
							path="productdetail/:productId"
							element={<ProductDetail />}
						/>
						<Route
							path="productpurchase/:productId"
							element={<ProductPurchase />}
						/>
						{/* user */}
						<Route path="mypage" element={<MyPage />} />
						<Route path="useredit/:userId" element={<UserEdit />} />
						<Route path="user/:userId/products" element={<UserProducts />} />
						<Route path="orders" element={<UserOrders />} />
						{/* signin, signup */}
						<Route path="signin" element={<SignIn />} />
						<Route path="signup" element={<SignUp />} />
					</Route>
				</Routes>
			</HelmetProvider>
		</QueryClientProvider>
	);
}

export default App;
