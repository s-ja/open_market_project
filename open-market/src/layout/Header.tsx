import { currentUserState } from "@/states/authState";
import {
	categoryValueState,
	fetchProductListState,
	productListState,
	searchKeywordState,
} from "@/states/productListState";
import { Common } from "@/styles/common";
import { axiosInstance } from "@/utils";
import styled from "@emotion/styled";
import {
	AccountCircle,
	FileUpload,
	Search,
	Logout,
} from "@mui/icons-material";
import {
	AppBar,
	Button,
	CircularProgress,
	IconButton,
	InputAdornment,
	TextField,
	Toolbar,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { KeyboardEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import logoImage from "/logo/logo2.svg";

const HeaderContainer = styled(AppBar)`
	background: rgba(40, 40, 44, 0.8);
	box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
	width: 100%;
	height: 80px;
	align-items: center;
	position: fixed;
	z-index: 100;
`;

const HeaderWrapper = styled(Toolbar)`
	width: 1440px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 100%;
	padding: 0 20px;
`;

const Logo = styled.h1`
	a {
		text-decoration: none;
		color: inherit;
		display: flex;
		align-items: center;

		img {
			height: 40px;
		}
	}
`;

const SearchBar = styled(TextField)`
	& .MuiOutlinedInput-root {
		width: 700px;
		border-radius: 100px;
		background-color: ${Common.colors.white};
		&.Mui-focused fieldset {
			border-color: ${Common.colors.emphasize};
		}
	}

	& .MuiInputLabel-root.Mui-focused {
		color: ${Common.colors.primary};
	}

	& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline {
		border-color: ${Common.colors.emphasize};
	}

	& .MuiIconButton-root {
		margin-right: -8px;
		padding: 2px;
		background-color: ${Common.colors.emphasize};
		color: ${Common.colors.white};
	}
`;

const ButtonWrapper = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 10px;
`;

const UploadButton = styled(Button)`
	color: ${Common.colors.white};
	background-color: transparent;
	border-radius: 10px;
	border: 1px solid ${Common.colors.emphasize};
	margin-right: ${Common.space.spacingLg};

	.MuiButton-startIcon {
		margin-right: ${Common.space.spacingMd};
		color: ${Common.colors.primary};
	}
`;

const UserButton = styled(Button)`
	all: unset;
	cursor: pointer;
	color: ${Common.colors.white};
	margin: 0 5px;
	display: flex;
	align-items: center;
	gap: 10px;
	&:hover {
		color: ${Common.colors.emphasize};
	}
	.notLoggedIn {
		border-radius: 10px;
		border: 1px solid ${Common.colors.emphasize};
		padding: 10px;
	}
`;

function Header() {
	const navigate = useNavigate();

	const [isLogoLoaded, setIsLogoLoaded] = useState(false);

	const [currentUser, setCurrentUser] = useRecoilState(currentUserState);
	const [productList, setProductList] = useRecoilState(productListState);

	const setSearchKeyword = useSetRecoilState<string>(searchKeywordState);
	const setCategoryValue = useSetRecoilState<string>(categoryValueState);

	const fetchedProductList = useRecoilValue(fetchProductListState(0));

	const { refetch } = useQuery({
		queryKey: ["productList", productList],
		queryFn: fetchProductList,
		refetchOnWindowFocus: false,
	});

	const [searchInput, setSearchInput] = useState("");

	async function fetchProductList() {
		try {
			return await axiosInstance.get("/products");
		} catch (error) {
			console.error(error);
		}
	}

	function onLogoLoad() {
		setIsLogoLoaded(true);
	}

	function handleSearchInputChange(event: React.ChangeEvent<HTMLInputElement>) {
		setSearchInput(event.target.value);
	}

	function handleEnterKeyPress(e: KeyboardEvent<HTMLInputElement>) {
		const target = e.target as HTMLInputElement;
		if (e.key === "Enter" && !e.nativeEvent.isComposing) {
			e.preventDefault();
			setSearchKeyword(target.value);
			setSearchInput("");
			setCategoryValue("all");
		}
	}

	function handleSearchClick() {
		setSearchKeyword(searchInput);
		setSearchInput("");
	}

	function handleLogout() {
		setCurrentUser(null);
		localStorage.removeItem("accessToken");
		localStorage.removeItem("refreshToken");
		sessionStorage.clear();

		toast.success(`로그아웃 되었습니다.`, {
			ariaProps: {
				role: "status",
				"aria-live": "polite",
			},
		});
		navigate("/");
	}

	useEffect(() => {
		setProductList(fetchedProductList!);
	}, []);

	useEffect(() => {
		refetch();
	}, [productList]);

	return (
		<HeaderContainer position="static" color="default" elevation={1}>
			<HeaderWrapper>
				<Logo>
					<Link
						to="/"
						onClick={() => {
							setSearchKeyword("");
							setCategoryValue("all");
							localStorage.removeItem("userProductsInfo");
							localStorage.removeItem("searchOrderKeyword");
						}}
					>
						<img
							src={logoImage}
							alt="모디 로고, 메인 페이지 이동 버튼"
							onLoad={onLogoLoad}
							style={{ display: isLogoLoaded ? "block" : "none" }}
						/>
						{!isLogoLoaded && <CircularProgress />}
					</Link>
				</Logo>
				<SearchBar
					size="small"
					variant="outlined"
					placeholder="검색어를 입력하세요"
					label="검색어 입력"
					value={searchInput}
					onChange={handleSearchInputChange}
					onKeyDown={(e) =>
						handleEnterKeyPress(e as KeyboardEvent<HTMLInputElement>)
					}
					InputProps={{
						endAdornment: (
							<InputAdornment position="end">
								<span aria-label="검색 버튼">
									<IconButton onClick={handleSearchClick}>
										<Search />
									</IconButton>
								</span>
							</InputAdornment>
						),
					}}
					sx={{ m: 2 }}
				/>
				{currentUser && (
					<ButtonWrapper>
						<UploadButton
							startIcon={<FileUpload />}
							variant="outlined"
							color="inherit"
							onClick={() => navigate("/productregistration")}
							aria-label="음원 상품 업로드 버튼"
						>
							업로드
						</UploadButton>

						<UserButton
							onClick={() => {
								navigate("/mypage");
							}}
							aria-label="마이페이지"
						>
							<AccountCircle />
						</UserButton>
						<UserButton onClick={handleLogout} aria-label="로그아웃">
							<Logout />
						</UserButton>
					</ButtonWrapper>
				)}
				{!currentUser && (
					<ButtonWrapper>
						<UserButton
							onClick={() => {
								navigate("/signin");
							}}
							aria-label="로그인"
						>
							<span className="notLoggedIn">로그인 / 회원가입</span>
						</UserButton>
					</ButtonWrapper>
				)}
			</HeaderWrapper>
		</HeaderContainer>
	);
}

export default Header;
